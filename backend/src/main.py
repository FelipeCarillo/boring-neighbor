from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.configs.env import settings
from src.helpers.lifespan import lifespan
from src.router.auth import router as auth_router
from src.router.users import router as users_router
from src.router.constructions import router as constructions_router
from src.router.progress import router as progress_router
from src.router.reports import router as reports_router


app = FastAPI(
    title="Metro SP - Construction Management System",
    description="""
    Sistema de Gestão de Construções para o Metrô de São Paulo.
    
    ## Features
    
    * **Authentication**: JWT-based authentication with role-based access control
    * **User Management**: ADMIN, SUPERVISOR, and OPERADOR roles
    * **Construction Management**: Create and manage construction projects
    * **Progress Tracking**: Register construction progress with photos
    * **BIM Deviation Analysis**: Automatic comparison between BIM references and real photos using SSIM
    * **AI Reports**: OpenAI-powered analysis and recommendations
    
    ## Roles
    
    * **ADMIN**: Full system access, user management, construction CRUD
    * **SUPERVISOR**: Construction management, user assignment, BIM uploads, report generation
    * **OPERADOR**: Register progress on assigned constructions
    
    ## Authentication
    
    Use o botão **Authorize** no topo da página para inserir seu token Bearer.
    Obtenha o token fazendo login em `/api/auth/login`.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(constructions_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(reports_router, prefix="/api")


@app.get("/")
def root():
    """
    Root endpoint - Health check.
    """
    return {
        "service": "Metro SP Construction Management API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}


