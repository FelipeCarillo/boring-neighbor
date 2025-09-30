from fastapi import FastAPI, APIRouter

from configs import ENV
from router import routers

app = FastAPI(
    title=ENV.PROJECT_NAME,
    description="API responsável por gerenciar o acompanhamento de obras do Metro de São Paulo.",
    version="1.0.0",
)

root_router = APIRouter(prefix=f"/api/{ENV.API_VERSION}")

for router in routers:
    root_router.include_router(router)

app.include_router(root_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
