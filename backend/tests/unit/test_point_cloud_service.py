import pytest
from unittest.mock import Mock, patch, MagicMock
import numpy as np
import json
from datetime import datetime
from uuid import uuid4

from src.services.point_cloud_service import PointCloudService


class TestPointCloudService:
    def setup_method(self):
        self.mock_repository = Mock()
        self.mock_s3_manager = Mock()
        self.service = PointCloudService(self.mock_repository, self.mock_s3_manager)

    @patch('src.services.point_cloud_service.torch')
    def test_init_with_cuda_available(self, mock_torch):
        mock_torch.cuda.is_available.return_value = True
        mock_torch.device.return_value = "cuda:0"
        
        service = PointCloudService(self.mock_repository, self.mock_s3_manager)
        
        assert service.device == "cuda:0"

    @patch('src.services.point_cloud_service.torch')
    def test_init_without_cuda(self, mock_torch):
        mock_torch.cuda.is_available.return_value = False
        mock_torch.device.return_value = "cpu"
        
        service = PointCloudService(self.mock_repository, self.mock_s3_manager)
        
        assert service.device == "cpu"

    @pytest.mark.asyncio
    async def test_process_construction_3d_success(self):
        construction_id = "test-construction-id"
        s3_ply_key = "test/ply.ply"
        s3_obj_key = "test/obj.obj"
        
        mock_report = Mock()
        mock_report.id = str(uuid4())
        mock_report.status = "completed"
        mock_report.report_json = json.dumps({"test": "data"})
        mock_report.processing_completed_at = datetime.utcnow()
        
        self.mock_repository.construction_3d_report_repo.create_report.return_value = mock_report
        self.mock_repository.construction_3d_report_repo.update_report.return_value = mock_report
        
        with patch.object(self.service, '_compute_delta_analysis') as mock_compute:
            mock_compute.return_value = {"test": "data"}
            
            result = await self.service.process_construction_3d(construction_id, s3_ply_key, s3_obj_key)
            
            assert result == mock_report
            assert result.status == "completed"

    @pytest.mark.asyncio
    async def test_process_construction_3d_failure(self):
        construction_id = "test-construction-id"
        s3_ply_key = "test/ply.ply"
        s3_obj_key = "test/obj.obj"
        
        mock_report = Mock()
        mock_report.id = str(uuid4())
        mock_report.status = "failed"
        mock_report.error_message = "Processing failed"
        mock_report.processing_completed_at = datetime.utcnow()
        
        self.mock_repository.construction_3d_report_repo.create_report.return_value = mock_report
        self.mock_repository.construction_3d_report_repo.update_report.return_value = mock_report
        
        with patch.object(self.service, '_compute_delta_analysis') as mock_compute:
            mock_compute.side_effect = Exception("Processing failed")
            
            result = await self.service.process_construction_3d(construction_id, s3_ply_key, s3_obj_key)
            
            assert result == mock_report
            assert result.status == "failed"
            assert result.error_message == "Processing failed"

    @patch('src.services.point_cloud_service.o3d')
    @patch('src.services.point_cloud_service.trimesh')
    @patch('src.services.point_cloud_service.os')
    def test_compute_delta_analysis_success(self, mock_os, mock_trimesh, mock_o3d):
        s3_ply_key = "test/ply.ply"
        s3_obj_key = "test/obj.obj"
        
        mock_point_cloud = Mock()
        mock_point_cloud.points = np.array([[1, 2, 3], [4, 5, 6]])
        mock_point_cloud.has_colors.return_value = True
        mock_point_cloud.has_normals.return_value = False
        mock_point_cloud.get_axis_aligned_bounding_box.return_value = Mock()
        mock_point_cloud.get_axis_aligned_bounding_box.return_value.get_extent.return_value = np.array([1, 1, 1])
        mock_point_cloud.get_axis_aligned_bounding_box.return_value.min_bound = np.array([0, 0, 0])
        mock_point_cloud.get_axis_aligned_bounding_box.return_value.max_bound = np.array([1, 1, 1])
        
        mock_mesh = Mock()
        mock_mesh.vertices = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
        mock_mesh.faces = np.array([[0, 1, 2]])
        mock_mesh.is_watertight = True
        mock_mesh.area = 10.0
        mock_mesh.volume = 100.0
        mock_mesh.bounds = (np.array([0, 0, 0]), np.array([1, 1, 1]))
        
        mock_o3d.io.read_point_cloud.return_value = mock_point_cloud
        mock_trimesh.load.return_value = mock_mesh
        
        mock_os.path.exists.return_value = True
        mock_os.remove.return_value = None
        
        with patch.object(self.service, '_compute_distances_gpu') as mock_distances:
            mock_distances.return_value = np.array([0.1, 0.2, 0.3])
            
            result = await self.service._compute_delta_analysis(s3_ply_key, s3_obj_key)
            
            assert "metadata" in result
            assert "geometry_info" in result
            assert "distance_statistics" in result
            assert "bounding_box_comparison" in result
            assert "volume_comparison" in result

    @patch('src.services.point_cloud_service.torch')
    def test_compute_distances_gpu_with_cuda(self, mock_torch):
        mock_torch.cuda.is_available.return_value = True
        
        pc_points = np.array([[1, 2, 3], [4, 5, 6]])
        mock_mesh = Mock()
        mock_mesh.vertices = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
        mock_mesh.faces = np.array([[0, 1, 2]])
        
        with patch.object(self.service, '_point_to_mesh_distance_gpu') as mock_gpu_distance:
            mock_gpu_distance.return_value = Mock()
            mock_gpu_distance.return_value.cpu.return_value.numpy.return_value = np.array([0.1, 0.2])
            
            result = await self.service._compute_distances_gpu(pc_points, mock_mesh)
            
            assert isinstance(result, np.ndarray)

    @patch('src.services.point_cloud_service.torch')
    def test_compute_distances_gpu_without_cuda(self, mock_torch):
        mock_torch.cuda.is_available.return_value = False
        
        pc_points = np.array([[1, 2, 3], [4, 5, 6]])
        mock_mesh = Mock()
        mock_mesh.vertices = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
        mock_mesh.faces = np.array([[0, 1, 2]])
        
        with patch.object(self.service, '_compute_distances_cpu') as mock_cpu_distance:
            mock_cpu_distance.return_value = np.array([0.1, 0.2])
            
            result = await self.service._compute_distances_gpu(pc_points, mock_mesh)
            
            assert isinstance(result, np.ndarray)

    def test_generate_statistics(self):
        distances = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
        
        result = self.service._generate_statistics(distances)
        
        assert result['min'] == 1.0
        assert result['max'] == 5.0
        assert result['mean'] == 3.0
        assert result['median'] == 3.0
        assert 'std' in result
        assert 'percentile_90' in result
        assert 'percentile_95' in result
        assert 'percentile_99' in result

    @patch('src.services.point_cloud_service.trimesh')
    def test_compute_volume_difference_success(self, mock_trimesh):
        mock_mesh = Mock()
        mock_mesh.volume = 100.0
        
        pc_points = np.random.rand(1000, 3)
        
        mock_hull = Mock()
        mock_hull.volume = 95.0
        mock_trimesh.convex_hull.return_value = mock_hull
        
        result = self.service._compute_volume_difference(mock_mesh, pc_points)
        
        assert result is not None
        assert result['mesh_volume'] == 100.0
        assert result['point_cloud_volume_approx'] == 95.0
        assert result['volume_difference'] == 5.0
        assert result['volume_difference_percent'] == 5.0

    @patch('src.services.point_cloud_service.trimesh')
    def test_compute_volume_difference_exception(self, mock_trimesh):
        mock_mesh = Mock()
        mock_mesh.volume = 100.0
        
        pc_points = np.random.rand(1000, 3)
        mock_trimesh.convex_hull.side_effect = Exception("Hull error")
        
        result = self.service._compute_volume_difference(mock_mesh, pc_points)
        
        assert result is None

    def test_compute_bounding_box_comparison(self):
        mock_point_cloud = Mock()
        mock_bbox = Mock()
        mock_bbox.get_extent.return_value = np.array([10, 20, 30])
        mock_bbox.min_bound = np.array([0, 0, 0])
        mock_bbox.max_bound = np.array([10, 20, 30])
        mock_point_cloud.get_axis_aligned_bounding_box.return_value = mock_bbox
        
        mock_mesh = Mock()
        mock_mesh.bounds = (np.array([1, 1, 1]), np.array([11, 21, 31]))
        
        result = self.service._compute_bounding_box_comparison(mock_point_cloud, mock_mesh)
        
        assert 'point_cloud_bbox' in result
        assert 'mesh_bbox' in result
        assert 'extent_difference' in result
        assert result['point_cloud_bbox']['extent'] == [10, 20, 30]
        assert result['mesh_bbox']['extent'] == [10, 20, 30]

    def test_closest_point_on_triangle_cpu(self):
        point = np.array([1, 1, 1])
        v0 = np.array([0, 0, 0])
        v1 = np.array([2, 0, 0])
        v2 = np.array([0, 2, 0])
        
        result = self.service._closest_point_on_triangle_cpu(point, v0, v1, v2)
        
        assert isinstance(result, np.ndarray)
        assert len(result) == 3
