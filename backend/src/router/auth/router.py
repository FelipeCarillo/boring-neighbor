from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import RedirectResponse

from configs import ENV
from entities import User
from helpers.auth import get_user
from helpers.errors import handle_exception
from .controller import AuthController
from .models import AuthResponse, TokenFormData, UserResponse
from .service import AuthService

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def get_service() -> AuthService:
    return AuthService()


def get_controller(
        service: AuthService = Depends(get_service)
) -> AuthController:
    return AuthController(service)


@handle_exception
@auth_router.get("/login")
def login(
        request: Request
):
    """Initiate Azure AD OAuth2 login flow."""
    azure_tenant_id = ENV.AZURE_TENANT_ID
    azure_client_id = ENV.AZURE_CLIENT_ID
    redirect_uri = ENV.REDIRECT_URI
    session_state = request.query_params.get('state')
    origin = request.headers.get("referer") or request.headers.get("origin") or ""

    if f"{ENV.API_DOMAIN}/docs" in origin:
        state = f"{session_state}, swagger"
    elif ENV.UI_DOMAIN and ENV.UI_DOMAIN in origin:
        state = "ui"
    else:
        state = "api"

    # Build OAuth2 authorization URL
    auth_url = (
        f"https://login.microsoftonline.com/{azure_tenant_id}/oauth2/v2.0/authorize"
        f"?client_id={azure_client_id}"
        f"&response_type=code"
        f"&redirect_uri={redirect_uri}"
        f"&scope=openid profile email"
        f"&state={state}"
    )

    return RedirectResponse(url=auth_url)


@handle_exception
@auth_router.get("/callback", response_model=AuthResponse)
async def callback(
        code: str,
        session_state: str,
        state: str,
        controller: AuthController = Depends(get_controller)
):
    """Handle OAuth2 callback and exchange code for tokens."""
    data = TokenFormData(code=code, state=session_state)
    response = await controller.token(data)

    if state == "ui":
        ui_redirect_url = f"{ENV.UI_DOMAIN}/auth/callback?access_token={response.access_token}&refresh_token={response.refresh_token}&token_type={response.token_type}&expires_in={response.expires_in}"
        return RedirectResponse(url=ui_redirect_url)

    elif "swagger" in state:
        state = state.replace(", swagger", "")
        return RedirectResponse(
            f"{ENV.API_DOMAIN}/docs/oauth2-redirect?code={response.access_token}&state={state}"
        )

    return response


@handle_exception
@auth_router.post("/token")
async def token(
        code: str = Form(...),
):
    """Exchange authorization code for access token."""
    return {"access_token": code, "token_type": "bearer"}


@handle_exception
@auth_router.get("/me", response_model=UserResponse)
async def me(
        user: User = Depends(get_user)
):
    """Get current user information."""
    return UserResponse(**user.model_dump())
