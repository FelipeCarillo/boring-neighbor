import pytest
from unittest.mock import Mock, patch, MagicMock
from io import BytesIO

from src.infra.s3_manager import S3Manager


class TestS3Manager:
    def setup_method(self):
        with patch('src.infra.s3_manager.boto3.client') as mock_boto3:
            mock_s3_client = Mock()
            mock_boto3.return_value = mock_s3_client
            self.s3_manager = S3Manager()
            self.s3_manager.s3 = mock_s3_client

    def test_get_presigned_url_success(self):
        expected_url = "https://test-bucket.s3.amazonaws.com/test-key?signature=abc123"
        self.s3_manager.s3.generate_presigned_url.return_value = expected_url
        
        result = self.s3_manager.get_presigned_url("test-key")
        
        assert result == expected_url
        self.s3_manager.s3.generate_presigned_url.assert_called_once_with(
            'get_object',
            Params={'Bucket': self.s3_manager.bucket_name, 'Key': 'test-key'},
            ExpiresIn=3600
        )

    def test_get_presigned_url_with_custom_expiration(self):
        expected_url = "https://test-bucket.s3.amazonaws.com/test-key?signature=abc123"
        self.s3_manager.s3.generate_presigned_url.return_value = expected_url
        
        result = self.s3_manager.get_presigned_url("test-key", expiration=7200)
        
        assert result == expected_url
        self.s3_manager.s3.generate_presigned_url.assert_called_once_with(
            'get_object',
            Params={'Bucket': self.s3_manager.bucket_name, 'Key': 'test-key'},
            ExpiresIn=7200
        )

    def test_get_presigned_url_exception(self):
        self.s3_manager.s3.generate_presigned_url.side_effect = Exception("S3 Error")
        
        with pytest.raises(Exception, match="S3 Error"):
            self.s3_manager.get_presigned_url("test-key")

    def test_upload_file_success(self):
        self.s3_manager.s3.upload_file.return_value = None
        
        self.s3_manager.upload_file("local/path/file.txt", "s3/key/file.txt")
        
        self.s3_manager.s3.upload_file.assert_called_once_with(
            "local/path/file.txt", 
            self.s3_manager.bucket_name, 
            "s3/key/file.txt"
        )

    def test_upload_file_exception(self):
        self.s3_manager.s3.upload_file.side_effect = Exception("Upload Error")
        
        with pytest.raises(Exception, match="Upload Error"):
            self.s3_manager.upload_file("local/path/file.txt", "s3/key/file.txt")

    def test_download_file_success(self):
        self.s3_manager.s3.download_file.return_value = None
        
        self.s3_manager.download_file("s3/key/file.txt", "local/path/file.txt")
        
        self.s3_manager.s3.download_file.assert_called_once_with(
            self.s3_manager.bucket_name,
            "s3/key/file.txt",
            "local/path/file.txt"
        )

    def test_download_file_exception(self):
        self.s3_manager.s3.download_file.side_effect = Exception("Download Error")
        
        with pytest.raises(Exception, match="Download Error"):
            self.s3_manager.download_file("s3/key/file.txt", "local/path/file.txt")

    def test_upload_file_stream_success(self):
        file_stream = BytesIO(b"test content")
        
        self.s3_manager.upload_file_stream(file_stream, "s3/key/file.txt")
        
        self.s3_manager.s3.upload_fileobj.assert_called_once_with(
            file_stream,
            self.s3_manager.bucket_name,
            "s3/key/file.txt",
            ExtraArgs={}
        )

    def test_upload_file_stream_with_content_type(self):
        file_stream = BytesIO(b"test content")
        
        self.s3_manager.upload_file_stream(file_stream, "s3/key/file.txt", "text/plain")
        
        self.s3_manager.s3.upload_fileobj.assert_called_once_with(
            file_stream,
            self.s3_manager.bucket_name,
            "s3/key/file.txt",
            ExtraArgs={'ContentType': 'text/plain'}
        )

    def test_upload_file_stream_exception(self):
        file_stream = BytesIO(b"test content")
        self.s3_manager.s3.upload_fileobj.side_effect = Exception("Upload Error")
        
        with pytest.raises(Exception, match="Upload Error"):
            self.s3_manager.upload_file_stream(file_stream, "s3/key/file.txt")

    def test_delete_file_success(self):
        self.s3_manager.s3.delete_object.return_value = None
        
        self.s3_manager.delete_file("s3/key/file.txt")
        
        self.s3_manager.s3.delete_object.assert_called_once_with(
            Bucket=self.s3_manager.bucket_name,
            Key="s3/key/file.txt"
        )

    def test_delete_file_exception(self):
        self.s3_manager.s3.delete_object.side_effect = Exception("Delete Error")
        
        with pytest.raises(Exception, match="Delete Error"):
            self.s3_manager.delete_file("s3/key/file.txt")

    def test_list_files_success(self):
        mock_response = {
            'Contents': [
                {'Key': 'folder/file1.txt'},
                {'Key': 'folder/file2.txt'}
            ]
        }
        self.s3_manager.s3.list_objects_v2.return_value = mock_response
        
        result = self.s3_manager.list_files("folder/")
        
        assert result == ['folder/file1.txt', 'folder/file2.txt']
        self.s3_manager.s3.list_objects_v2.assert_called_once_with(
            Bucket=self.s3_manager.bucket_name,
            Prefix='folder/'
        )

    def test_list_files_empty(self):
        mock_response = {'Contents': []}
        self.s3_manager.s3.list_objects_v2.return_value = mock_response
        
        result = self.s3_manager.list_files("empty-folder/")
        
        assert result == []

    def test_list_files_exception(self):
        self.s3_manager.s3.list_objects_v2.side_effect = Exception("List Error")
        
        with pytest.raises(Exception, match="List Error"):
            self.s3_manager.list_files("folder/")

    def test_generate_presigned_upload_url_success(self):
        expected_url = "https://test-bucket.s3.amazonaws.com/test-key?signature=abc123"
        self.s3_manager.s3.generate_presigned_url.return_value = expected_url
        
        result = self.s3_manager.generate_presigned_upload_url("test-key")
        
        assert result == expected_url
        self.s3_manager.s3.generate_presigned_url.assert_called_once_with(
            'put_object',
            Params={'Bucket': self.s3_manager.bucket_name, 'Key': 'test-key'},
            ExpiresIn=3600
        )

    def test_generate_presigned_upload_url_with_content_type(self):
        expected_url = "https://test-bucket.s3.amazonaws.com/test-key?signature=abc123"
        self.s3_manager.s3.generate_presigned_url.return_value = expected_url
        
        result = self.s3_manager.generate_presigned_upload_url("test-key", content_type="text/plain")
        
        assert result == expected_url
        self.s3_manager.s3.generate_presigned_url.assert_called_once_with(
            'put_object',
            Params={
                'Bucket': self.s3_manager.bucket_name, 
                'Key': 'test-key',
                'ContentType': 'text/plain'
            },
            ExpiresIn=3600
        )

    def test_generate_presigned_upload_url_exception(self):
        self.s3_manager.s3.generate_presigned_url.side_effect = Exception("Presigned URL Error")
        
        with pytest.raises(Exception, match="Presigned URL Error"):
            self.s3_manager.generate_presigned_upload_url("test-key")
