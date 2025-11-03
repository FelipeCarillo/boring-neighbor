from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
import boto3
from botocore.exceptions import ClientError

from src.configs.env import settings
from src.repositories.database import engine
from src.repositories.models.base import Base
# Import all models to ensure relationships are resolved
from src.repositories.models import (  # noqa: F401
    User,
    Construction,
    ConstructionPhase,
    BIMReference,
    ConstructionProgress,
    DeviationReport,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    FastAPI lifespan context manager for startup and shutdown events.
    """
    
    Base.metadata.create_all(bind=engine)
    
    try:
        s3_client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            region_name=settings.s3_region,
        )
        
        try:
            s3_client.head_bucket(Bucket=settings.s3_bucket_name)
        except ClientError:
            s3_client.create_bucket(Bucket=settings.s3_bucket_name)
    except Exception as e:
        print(f"Warning: S3 setup failed - {e}")
    
    yield
    
    engine.dispose()


