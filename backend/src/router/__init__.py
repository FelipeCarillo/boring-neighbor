from .auth.view import auth_router
from .constructions.view import construction_router

routers = [
    auth_router,
    construction_router,
]

__all__ = [
    "routers",
]
