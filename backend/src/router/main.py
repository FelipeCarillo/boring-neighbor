import uvicorn
from fastapi import FastAPI

from router.constructions import construction_router


def setup_routers(app: FastAPI):
    app.include_router(construction_router)


app = FastAPI()

setup_routers(app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
