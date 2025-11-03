import boto3
from botocore.exceptions import ClientError
from io import BytesIO
from typing import Optional
import uuid

from src.configs.env import settings
from src.helpers.errors import InternalServerException


class S3Service:
    """
    Service for managing S3 storage operations (MinIO/AWS S3).
    """
    
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            region_name=settings.s3_region,
        )
        self.bucket_name = settings.s3_bucket_name
    
    def upload_file(
        self,
        file_content: bytes,
        file_name: str,
        content_type: str = "image/jpeg",
        folder: str = "",
    ) -> str:
        """
        Upload a file to S3 and return the S3 key.
        """
        try:
            unique_filename = f"{uuid.uuid4()}_{file_name}"
            s3_key = f"{folder}/{unique_filename}" if folder else unique_filename
            
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=file_content,
                ContentType=content_type,
            )
            
            return s3_key
        except ClientError as e:
            raise InternalServerException(detail=f"Failed to upload file: {str(e)}")
    
    def download_file(self, s3_key: str) -> bytes:
        """
        Download a file from S3 and return its content.
        """
        try:
            response = self.client.get_object(
                Bucket=self.bucket_name,
                Key=s3_key,
            )
            return response["Body"].read()
        except ClientError as e:
            raise InternalServerException(detail=f"Failed to download file: {str(e)}")
    
    def generate_presigned_url(self, s3_key: str, expiration: int = 3600) -> str:
        """
        Generate a presigned URL for accessing an S3 object.
        """
        try:
            url = self.client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": s3_key},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            raise InternalServerException(detail=f"Failed to generate presigned URL: {str(e)}")
    
    def delete_file(self, s3_key: str) -> bool:
        """
        Delete a file from S3.
        """
        try:
            self.client.delete_object(
                Bucket=self.bucket_name,
                Key=s3_key,
            )
            return True
        except ClientError as e:
            raise InternalServerException(detail=f"Failed to delete file: {str(e)}")
    
    def file_exists(self, s3_key: str) -> bool:
        """
        Check if a file exists in S3.
        """
        try:
            self.client.head_object(
                Bucket=self.bucket_name,
                Key=s3_key,
            )
            return True
        except ClientError:
            return False


s3_service = S3Service()


