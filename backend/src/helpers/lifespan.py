from contextlib import asynccontextmanager

from fastapi import FastAPI, Request

from repositories.repository import Repository


async def get_repo(request: Request) -> Repository:
    return request.app.state.repo


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Repository
    repo = Repository()
    app.state.repo = repo

    # Initialize other resources here if needed
    # e.g., cache, message brokers, etc.

    try:
        yield
    finally:
        del repo
