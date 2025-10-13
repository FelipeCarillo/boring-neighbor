from .auth.router import auth_router
from .constructions.view import construction_router, phases_router, approvals_router, progress_router

routers = [
    auth_router,
    construction_router,
    phases_router,
    approvals_router,
    progress_router,
]

__all__ = [
    "routers",
]
