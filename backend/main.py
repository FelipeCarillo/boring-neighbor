from fastapi import FastAPI

from router import routers

app = FastAPI(
    title="Metro SP - Boring Neighbor",
    description="API responsável por gerenciar o acompanhamento de obras do Metro de São Paulo.",
    version="1.0.0",
)

for router in routers:
    app.include_router(router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
