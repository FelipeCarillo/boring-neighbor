import gc
import json
from datetime import datetime

import numpy as np
import open3d as o3d
import torch
import trimesh


class DeltaReportGPU:
    def __init__(self, ply_path, obj_path, batch_size=10000):
        """
        Inicializa o gerador de relatório com suporte CUDA

        Args:
            ply_path: Caminho para arquivo PLY (nuvem de pontos)
            obj_path: Caminho para arquivo OBJ (malha)
            batch_size: Tamanho do lote para processamento (ajuste conforme sua GPU)
        """
        self.ply_path = ply_path
        self.obj_path = obj_path
        self.batch_size = batch_size
        self.device = torch.device('cuda')

        print(f"🚀 Usando: {self.device}")
        if torch.cuda.is_available():
            print(f"   GPU: {torch.cuda.get_device_name(0)}")
            print(f"   Memória disponível: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")

        self.point_cloud = None
        self.mesh = None
        self.distances = None

    def load_data(self):
        """Carrega os arquivos PLY e OBJ"""
        print("\n📂 Carregando nuvem de pontos (PLY)...")
        self.point_cloud = o3d.io.read_point_cloud(self.ply_path)
        self.pc_points = np.asarray(self.point_cloud.points)

        print("📂 Carregando malha (OBJ)...")
        self.mesh = trimesh.load(self.obj_path)

        print(f"✓ PLY: {len(self.pc_points):,} pontos")
        print(f"✓ OBJ: {len(self.mesh.vertices):,} vértices, {len(self.mesh.faces):,} faces")

    def compute_distances_gpu(self):
        """Calcula distâncias usando GPU em lotes para economizar memória"""
        print("\n⚡ Calculando distâncias ponto-a-superfície na GPU...")

        num_points = len(self.pc_points)
        all_distances = []

        # Converte malha para tensores GPU
        mesh_vertices = torch.from_numpy(self.mesh.vertices).float().to(self.device)
        mesh_faces = torch.from_numpy(self.mesh.faces).long().to(self.device)

        # Processa em lotes
        num_batches = (num_points + self.batch_size - 1) // self.batch_size

        for i in range(num_batches):
            start_idx = i * self.batch_size
            end_idx = min((i + 1) * self.batch_size, num_points)

            # Lote atual de pontos
            batch_points = torch.from_numpy(
                self.pc_points[start_idx:end_idx]
            ).float().to(self.device)

            # Calcula distâncias para este lote
            batch_distances = self.point_to_mesh_distance_gpu(
                batch_points, mesh_vertices, mesh_faces
            )

            all_distances.append(batch_distances.cpu().numpy())

            # Libera memória GPU
            del batch_points, batch_distances
            torch.cuda.empty_cache()

            # Progresso
            progress = (i + 1) / num_batches * 100
            print(f"  Progresso: {progress:.1f}% ({end_idx:,}/{num_points:,} pontos)", end='\r')

        print("\n✓ Cálculo concluído!")

        # Concatena resultados
        self.distances = np.concatenate(all_distances)

        # Limpa memória
        del mesh_vertices, mesh_faces
        torch.cuda.empty_cache()
        gc.collect()

    def point_to_mesh_distance_gpu(self, points, vertices, faces):
        """
        Calcula distância de pontos para malha triangular na GPU

        Args:
            points: tensor [N, 3]
            vertices: tensor [V, 3]
            faces: tensor [F, 3]
        """
        N = points.shape[0]
        F = faces.shape[0]

        # Extrai triângulos
        v0 = vertices[faces[:, 0]]  # [F, 3]
        v1 = vertices[faces[:, 1]]  # [F, 3]
        v2 = vertices[faces[:, 2]]  # [F, 3]

        # Para cada ponto, calcula distância para todos os triângulos
        # Processa em mini-batches se necessário
        mini_batch = 1000
        all_min_dists = []

        for i in range(0, N, mini_batch):
            end = min(i + mini_batch, N)
            p_batch = points[i:end]  # [MB, 3]

            # Expande dimensões para broadcast
            p = p_batch.unsqueeze(1)  # [MB, 1, 3]

            # Calcula ponto mais próximo em cada triângulo
            closest = self.closest_point_on_triangle_gpu(p, v0, v1, v2)

            # Distância ao ponto mais próximo
            dists = torch.norm(p - closest, dim=2)  # [MB, F]

            # Menor distância para cada ponto
            min_dists = torch.min(dists, dim=1)[0]  # [MB]
            all_min_dists.append(min_dists)

            del p, closest, dists, min_dists

        return torch.cat(all_min_dists)

    def closest_point_on_triangle_gpu(self, p, v0, v1, v2):
        """
        Encontra ponto mais próximo em triângulo (vetorizado para GPU)

        Args:
            p: pontos [N, 1, 3]
            v0, v1, v2: vértices do triângulo [F, 3]
        """
        # Arestas do triângulo
        edge0 = v1 - v0  # [F, 3]
        edge1 = v2 - v0  # [F, 3]

        # Vetor do vértice ao ponto
        v0p = p - v0.unsqueeze(0)  # [N, F, 3]

        a = torch.sum(edge0 * edge0, dim=1)  # [F]
        b = torch.sum(edge0 * edge1, dim=1)  # [F]
        c = torch.sum(edge1 * edge1, dim=1)  # [F]
        d = torch.sum(edge0.unsqueeze(0) * v0p, dim=2)  # [N, F]
        e = torch.sum(edge1.unsqueeze(0) * v0p, dim=2)  # [N, F]

        det = a * c - b * b
        s = b * e - c * d
        t = b * d - a * e

        # Coordenadas baricêntricas
        s = s / det
        t = t / det

        # Clamp para dentro do triângulo
        s = torch.clamp(s, 0, 1)
        t = torch.clamp(t, 0, 1)

        # Garante s + t <= 1
        mask = s + t > 1
        s[mask] = s[mask] / (s[mask] + t[mask])
        t[mask] = 1 - s[mask]

        # Calcula ponto mais próximo
        closest = v0.unsqueeze(0) + s.unsqueeze(2) * edge0.unsqueeze(0) + t.unsqueeze(2) * edge1.unsqueeze(0)

        return closest

    def generate_statistics(self):
        """Gera estatísticas das distâncias"""
        stats = {
            'min': float(np.min(self.distances)),
            'max': float(np.max(self.distances)),
            'mean': float(np.mean(self.distances)),
            'median': float(np.median(self.distances)),
            'std': float(np.std(self.distances)),
            'percentile_90': float(np.percentile(self.distances, 90)),
            'percentile_95': float(np.percentile(self.distances, 95)),
            'percentile_99': float(np.percentile(self.distances, 99))
        }
        return stats

    def compute_volume_difference(self):
        """Calcula diferença de volume"""
        try:
            mesh_volume = self.mesh.volume
            # Amostra pontos para convex hull (mais eficiente)
            sample_size = min(5000, len(self.pc_points))
            sample_indices = np.random.choice(len(self.pc_points), sample_size, replace=False)
            pc_hull = trimesh.convex_hull(self.pc_points[sample_indices])
            pc_volume = pc_hull.volume

            return {
                'mesh_volume': float(mesh_volume),
                'point_cloud_volume_approx': float(pc_volume),
                'volume_difference': float(abs(mesh_volume - pc_volume)),
                'volume_difference_percent': float(abs(mesh_volume - pc_volume) / mesh_volume * 100)
            }
        except:
            return None

    def compute_bounding_box_comparison(self):
        """Compara bounding boxes"""
        pc_bbox = self.point_cloud.get_axis_aligned_bounding_box()
        pc_extent = pc_bbox.get_extent()

        mesh_bbox = self.mesh.bounds
        mesh_extent = mesh_bbox[1] - mesh_bbox[0]

        return {
            'point_cloud_bbox': {
                'min': pc_bbox.min_bound.tolist(),
                'max': pc_bbox.max_bound.tolist(),
                'extent': pc_extent.tolist()
            },
            'mesh_bbox': {
                'min': mesh_bbox[0].tolist(),
                'max': mesh_bbox[1].tolist(),
                'extent': mesh_extent.tolist()
            },
            'extent_difference': (np.abs(pc_extent - mesh_extent)).tolist()
        }

    def generate_report(self, output_file='delta_report.json', print_console=True):
        """Gera relatório completo"""
        print("\n" + "=" * 60)
        print("GERANDO RELATÓRIO DE DELTA COM GPU")
        print("=" * 60)

        self.load_data()
        self.compute_distances_gpu()

        stats = self.generate_statistics()
        volume_info = self.compute_volume_difference()
        bbox_info = self.compute_bounding_box_comparison()

        report = {
            'metadata': {
                'timestamp': datetime.now().isoformat(),
                'ply_file': self.ply_path,
                'obj_file': self.obj_path,
                'device': str(self.device)
            },
            'geometry_info': {
                'point_cloud': {
                    'num_points': len(self.pc_points),
                    'has_colors': self.point_cloud.has_colors(),
                    'has_normals': self.point_cloud.has_normals()
                },
                'mesh': {
                    'num_vertices': len(self.mesh.vertices),
                    'num_faces': len(self.mesh.faces),
                    'is_watertight': self.mesh.is_watertight,
                    'surface_area': float(self.mesh.area)
                }
            },
            'distance_statistics': stats,
            'bounding_box_comparison': bbox_info
        }

        if volume_info:
            report['volume_comparison'] = volume_info

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        if print_console:
            self.print_report(report)

        print(f"\n✓ Relatório salvo em: {output_file}")
        return report

    def print_report(self, report):
        """Imprime relatório formatado"""
        print("\n" + "=" * 60)
        print("RELATÓRIO DE COMPARAÇÃO - NUVEM DE PONTOS vs MALHA")
        print("=" * 60)

        print("\n📊 INFORMAÇÕES GERAIS:")
        print(f"  Nuvem de Pontos: {report['geometry_info']['point_cloud']['num_points']:,} pontos")
        print(f"  Malha 3D: {report['geometry_info']['mesh']['num_vertices']:,} vértices, "
              f"{report['geometry_info']['mesh']['num_faces']:,} faces")
        print(f"  Malha fechada: {'Sim' if report['geometry_info']['mesh']['is_watertight'] else 'Não'}")
        print(f"  Área superficial: {report['geometry_info']['mesh']['surface_area']:.4f} unidades²")

        print("\n📏 ESTATÍSTICAS DE DISTÂNCIA (unidades):")
        stats = report['distance_statistics']
        print(f"  Mínima:        {stats['min']:.6f}")
        print(f"  Máxima:        {stats['max']:.6f}")
        print(f"  Média:         {stats['mean']:.6f}")
        print(f"  Mediana:       {stats['median']:.6f}")
        print(f"  Desvio Padrão: {stats['std']:.6f}")
        print(f"  Percentil 90%: {stats['percentile_90']:.6f}")
        print(f"  Percentil 95%: {stats['percentile_95']:.6f}")
        print(f"  Percentil 99%: {stats['percentile_99']:.6f}")

        if 'volume_comparison' in report:
            print("\n📦 COMPARAÇÃO DE VOLUME:")
            vol = report['volume_comparison']
            print(f"  Volume da Malha:          {vol['mesh_volume']:.4f} unidades³")
            print(f"  Volume da Nuvem (aprox):  {vol['point_cloud_volume_approx']:.4f} unidades³")
            print(f"  Diferença:                {vol['volume_difference']:.4f} unidades³")
            print(f"  Diferença Percentual:     {vol['volume_difference_percent']:.2f}%")

        print("\n📐 BOUNDING BOX:")
        bbox = report['bounding_box_comparison']
        pc_extent = bbox['point_cloud_bbox']['extent']
        mesh_extent = bbox['mesh_bbox']['extent']
        print(f"  Nuvem de Pontos: {pc_extent[0]:.3f} x {pc_extent[1]:.3f} x {pc_extent[2]:.3f}")
        print(f"  Malha:           {mesh_extent[0]:.3f} x {mesh_extent[1]:.3f} x {mesh_extent[2]:.3f}")

        print("\n" + "=" * 60)


# Exemplo de uso
if __name__ == "__main__":
    ply_file = "raw.ply"
    obj_file = "PittsburghBridge.obj"

    # Ajuste batch_size conforme memória GPU (menor = menos memória)
    delta = DeltaReportGPU(ply_file, obj_file, batch_size=10000)
    report = delta.generate_report(output_file='relatorio_delta.json')
