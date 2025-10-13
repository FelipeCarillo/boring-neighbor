#!/usr/bin/env python3

import os
import sys
import asyncio
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from repositories.repository import Repository
from infra.s3_manager import S3Manager
from services.point_cloud_service import PointCloudService

async def test_3d_processing():
    repository = Repository()
    s3_manager = S3Manager()
    point_cloud_service = PointCloudService(repository, s3_manager)
    
    print("Testing 3D processing with sample files...")
    
    ply_key = "test/raw.ply"
    obj_key = "test/PittsburghBridge.obj"
    
    try:
        report = await point_cloud_service.process_construction_3d(
            construction_id="test-construction-id",
            s3_ply_key=ply_key,
            s3_obj_key=obj_key
        )
        
        print(f"Processing completed!")
        print(f"Report ID: {report.id}")
        print(f"Status: {report.status}")
        print(f"Processing time: {report.processing_completed_at - report.processing_started_at}")
        
        if report.report_json:
            import json
            data = json.loads(report.report_json)
            print(f"Distance statistics:")
            print(f"  Min: {data['distance_statistics']['min']:.6f}")
            print(f"  Max: {data['distance_statistics']['max']:.6f}")
            print(f"  Mean: {data['distance_statistics']['mean']:.6f}")
            print(f"  Median: {data['distance_statistics']['median']:.6f}")
        
    except Exception as e:
        print(f"Error during processing: {e}")

if __name__ == "__main__":
    asyncio.run(test_3d_processing())
