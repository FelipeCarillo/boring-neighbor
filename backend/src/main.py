from fastapi import FastAPI, APIRouter

from configs import ENV
from helpers.lifespan import lifespan
from router import routers

app = FastAPI(
    title=ENV.PROJECT_NAME,
    description="API responsável por gerenciar o acompanhamento de obras do Metro de São Paulo.",
    version=ENV.API_VERSION,
    lifespan=lifespan
)

root_router = APIRouter(prefix=f"/api/{ENV.API_VERSION}")

for router in routers:
    root_router.include_router(router)

app.include_router(root_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
