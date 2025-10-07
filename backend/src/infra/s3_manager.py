import boto3
from botocore.exceptions import ClientError

from configs import ENV
from helpers.logger import get_logger

logger = get_logger(__name__)


class S3Manager:
    def __init__(self):
        bucket_name = ENV.BUCKET_NAME
        stage = ENV.STAGE
        region_name = 'us-east-1'

        self.s3 = self._connect_client(
            bucket_name=bucket_name,
            stage=stage,
            region_name=region_name
        )
        self.bucket_name = bucket_name

    def get_presigned_url(self, object_name, expiration=3600):
        try:
            url = self.s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            logger.info(f"Generated presigned URL for {self.bucket_name}/{object_name}")
            return url
        except Exception as e:
            logger.error(f"Failed to generate presigned URL for {self.bucket_name}/{object_name}: {e}")
            raise

    def upload_file(self, file_path, object_name):
        try:
            self.s3.upload_file(file_path, self.bucket_name, object_name)
            logger.info(f"File {file_path} uploaded to {self.bucket_name}/{object_name}")
        except Exception as e:
            logger.error(f"Failed to upload file {file_path} to {self.bucket_name}/{object_name}: {e}")
            raise

    def download_file(self, object_name, file_path):
        try:
            self.s3.download_file(self.bucket_name, object_name, file_path)
            logger.info(f"File {object_name} downloaded from {self.bucket_name} to {file_path}")
        except Exception as e:
            logger.error(f"Failed to download file {object_name} from {self.bucket_name} to {file_path}: {e}")
            raise

    def list_files(self, prefix=''):
        try:
            response = self.s3.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix)
            files = [item['Key'] for item in response.get('Contents', [])]
            logger.info(f"Listed files in {self.bucket_name} with prefix '{prefix}': {files}")
            return files
        except Exception as e:
            logger.error(f"Failed to list files in {self.bucket_name} with prefix '{prefix}': {e}")
            raise

    def _connect_client(self, bucket_name: str, stage: str, region_name: str):
        if stage != "local":
            return boto3.client("s3", region_name=region_name)
        return self._setup_minio(bucket_name=bucket_name)

    @staticmethod
    def _setup_minio(bucket_name: str):
        s3 = boto3.client(
            "s3",
            endpoint_url="http://localhost:9000",
            aws_access_key_id="minio",
            aws_secret_access_key="minio123"
        )

        try:
            s3.head_bucket(Bucket=bucket_name)
            logger.info(f"Bucket '%s' já existe.", bucket_name)
        except ClientError as e:
            error_code = int(e.response['Error']['Code'])
            if error_code == 404:
                logger.warning("Bucket '%s' não encontrado. Criando...", bucket_name)
                s3.create_bucket(Bucket=bucket_name)
                logger.info("Bucket '%s' criado com sucesso.", bucket_name)
            else:
                logger.error("Erro ao acessar o bucket '%s': %s", bucket_name, e)
                raise

        return s3


if __name__ == "__main__":
    S3Manager()
