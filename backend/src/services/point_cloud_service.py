import gc
import json
import asyncio
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import uuid4

import numpy as np
import open3d as o3d
import torch
import trimesh

from configs import ENV
from infra.s3_manager import S3Manager
from entities.construction import Construction3DReport
from repositories.repository import Repository


class PointCloudService:
    def __init__(self, repository: Repository, s3_manager: S3Manager):
        self.repository = repository
        self.s3_manager = s3_manager
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.batch_size = ENV.PROCESSING_BATCH_SIZE

    async def process_construction_3d(self, construction_id: str, s3_ply_key: str, s3_obj_key: str) -> Construction3DReport:
        report = Construction3DReport(
            id=str(uuid4()),
            construction_id=construction_id,
            s3_ply_key=s3_ply_key,
            s3_obj_key=s3_obj_key,
            status='processing',
            processing_started_at=datetime.utcnow()
        )
        
        self.repository.construction_3d_report_repo.create_report(report)
        
        try:
            report_data = await self._compute_delta_analysis(s3_ply_key, s3_obj_key)
            
            report.status = 'completed'
            report.report_json = json.dumps(report_data)
            report.processing_completed_at = datetime.utcnow()
            
        except Exception as e:
            report.status = 'failed'
            report.error_message = str(e)
            report.processing_completed_at = datetime.utcnow()
        
        return self.repository.construction_3d_report_repo.update_report(report)

    async def _compute_delta_analysis(self, s3_ply_key: str, s3_obj_key: str) -> Dict[str, Any]:
        ply_path = f"/tmp/{s3_ply_key.split('/')[-1]}"
        obj_path = f"/tmp/{s3_obj_key.split('/')[-1]}"
        
        self.s3_manager.download_file(s3_ply_key, ply_path)
        self.s3_manager.download_file(s3_obj_key, obj_path)
        
        try:
            point_cloud = o3d.io.read_point_cloud(ply_path)
            pc_points = np.asarray(point_cloud.points)
            
            mesh = trimesh.load(obj_path)
            
            distances = await self._compute_distances_gpu(pc_points, mesh)
            
            stats = self._generate_statistics(distances)
            volume_info = self._compute_volume_difference(mesh, pc_points)
            bbox_info = self._compute_bounding_box_comparison(point_cloud, mesh)
            
            return {
                'metadata': {
                    'timestamp': datetime.utcnow().isoformat(),
                    'ply_file': s3_ply_key,
                    'obj_file': s3_obj_key,
                    'device': str(self.device)
                },
                'geometry_info': {
                    'point_cloud': {
                        'num_points': len(pc_points),
                        'has_colors': point_cloud.has_colors(),
                        'has_normals': point_cloud.has_normals()
                    },
                    'mesh': {
                        'num_vertices': len(mesh.vertices),
                        'num_faces': len(mesh.faces),
                        'is_watertight': mesh.is_watertight,
                        'surface_area': float(mesh.area)
                    }
                },
                'distance_statistics': stats,
                'bounding_box_comparison': bbox_info,
                'volume_comparison': volume_info
            }
            
        finally:
            import os
            if os.path.exists(ply_path):
                os.remove(ply_path)
            if os.path.exists(obj_path):
                os.remove(obj_path)

    async def _compute_distances_gpu(self, pc_points: np.ndarray, mesh) -> np.ndarray:
        if not torch.cuda.is_available():
            return self._compute_distances_cpu(pc_points, mesh)
        
        num_points = len(pc_points)
        all_distances = []

        mesh_vertices = torch.from_numpy(mesh.vertices).float().to(self.device)
        mesh_faces = torch.from_numpy(mesh.faces).long().to(self.device)

        num_batches = (num_points + self.batch_size - 1) // self.batch_size

        for i in range(num_batches):
            start_idx = i * self.batch_size
            end_idx = min((i + 1) * self.batch_size, num_points)

            batch_points = torch.from_numpy(
                pc_points[start_idx:end_idx]
            ).float().to(self.device)

            batch_distances = self._point_to_mesh_distance_gpu(
                batch_points, mesh_vertices, mesh_faces
            )

            all_distances.append(batch_distances.cpu().numpy())

            del batch_points, batch_distances
            torch.cuda.empty_cache()

        del mesh_vertices, mesh_faces
        torch.cuda.empty_cache()
        gc.collect()

        return np.concatenate(all_distances)

    def _compute_distances_cpu(self, pc_points: np.ndarray, mesh) -> np.ndarray:
        distances = []
        for point in pc_points:
            point_distances = []
            for face in mesh.faces:
                v0, v1, v2 = mesh.vertices[face]
                closest_point = self._closest_point_on_triangle_cpu(point, v0, v1, v2)
                dist = np.linalg.norm(point - closest_point)
                point_distances.append(dist)
            distances.append(min(point_distances))
        return np.array(distances)

    def _point_to_mesh_distance_gpu(self, points, vertices, faces):
        N = points.shape[0]
        F = faces.shape[0]

        v0 = vertices[faces[:, 0]]
        v1 = vertices[faces[:, 1]]
        v2 = vertices[faces[:, 2]]

        mini_batch = 1000
        all_min_dists = []

        for i in range(0, N, mini_batch):
            end = min(i + mini_batch, N)
            p_batch = points[i:end]

            p = p_batch.unsqueeze(1)
            closest = self._closest_point_on_triangle_gpu(p, v0, v1, v2)
            dists = torch.norm(p - closest, dim=2)
            min_dists = torch.min(dists, dim=1)[0]
            all_min_dists.append(min_dists)

            del p, closest, dists, min_dists

        return torch.cat(all_min_dists)

    def _closest_point_on_triangle_gpu(self, p, v0, v1, v2):
        edge0 = v1 - v0
        edge1 = v2 - v0
        v0p = p - v0.unsqueeze(0)

        a = torch.sum(edge0 * edge0, dim=1)
        b = torch.sum(edge0 * edge1, dim=1)
        c = torch.sum(edge1 * edge1, dim=1)
        d = torch.sum(edge0.unsqueeze(0) * v0p, dim=2)
        e = torch.sum(edge1.unsqueeze(0) * v0p, dim=2)

        det = a * c - b * b
        s = b * e - c * d
        t = b * d - a * e

        s = s / det
        t = t / det

        s = torch.clamp(s, 0, 1)
        t = torch.clamp(t, 0, 1)

        mask = s + t > 1
        s[mask] = s[mask] / (s[mask] + t[mask])
        t[mask] = 1 - s[mask]

        closest = v0.unsqueeze(0) + s.unsqueeze(2) * edge0.unsqueeze(0) + t.unsqueeze(2) * edge1.unsqueeze(0)

        return closest

    def _closest_point_on_triangle_cpu(self, point, v0, v1, v2):
        edge0 = v1 - v0
        edge1 = v2 - v0
        v0p = point - v0

        a = np.dot(edge0, edge0)
        b = np.dot(edge0, edge1)
        c = np.dot(edge1, edge1)
        d = np.dot(edge0, v0p)
        e = np.dot(edge1, v0p)

        det = a * c - b * b
        s = b * e - c * d
        t = b * d - a * e

        s = s / det
        t = t / det

        s = np.clip(s, 0, 1)
        t = np.clip(t, 0, 1)

        if s + t > 1:
            s = s / (s + t)
            t = 1 - s

        closest = v0 + s * edge0 + t * edge1
        return closest

    def _generate_statistics(self, distances: np.ndarray) -> Dict[str, float]:
        return {
            'min': float(np.min(distances)),
            'max': float(np.max(distances)),
            'mean': float(np.mean(distances)),
            'median': float(np.median(distances)),
            'std': float(np.std(distances)),
            'percentile_90': float(np.percentile(distances, 90)),
            'percentile_95': float(np.percentile(distances, 95)),
            'percentile_99': float(np.percentile(distances, 99))
        }

    def _compute_volume_difference(self, mesh, pc_points: np.ndarray) -> Optional[Dict[str, float]]:
        try:
            mesh_volume = mesh.volume
            sample_size = min(5000, len(pc_points))
            sample_indices = np.random.choice(len(pc_points), sample_size, replace=False)
            pc_hull = trimesh.convex_hull(pc_points[sample_indices])
            pc_volume = pc_hull.volume

            return {
                'mesh_volume': float(mesh_volume),
                'point_cloud_volume_approx': float(pc_volume),
                'volume_difference': float(abs(mesh_volume - pc_volume)),
                'volume_difference_percent': float(abs(mesh_volume - pc_volume) / mesh_volume * 100)
            }
        except:
            return None

    def _compute_bounding_box_comparison(self, point_cloud, mesh) -> Dict[str, Any]:
        pc_bbox = point_cloud.get_axis_aligned_bounding_box()
        pc_extent = pc_bbox.get_extent()

        mesh_bbox = mesh.bounds
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
