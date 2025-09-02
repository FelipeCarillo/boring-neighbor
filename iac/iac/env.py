import os

from dotenv import load_dotenv

load_dotenv()


class Env:

    @property
    def STAGE(self) -> str:
        stage = os.getenv("STAGE")
        if not stage:
            raise ValueError("STAGE environment variable is not set.")
        return stage

    @property
    def AWS_REGION(self) -> str:
        aws_region = os.getenv("AWS_REGION")
        if not aws_region:
            raise ValueError("AWS_REGION environment variable is not set.")
        return aws_region

    @property
    def USER_POOL_NAME(self) -> str:
        user_pool_name = os.getenv("USER_POOL_NAME")
        if not user_pool_name:
            raise ValueError("USER_POOL_NAME environment variable is not set.")
        return f"{user_pool_name}-{self.STAGE}"


ENV = Env()
