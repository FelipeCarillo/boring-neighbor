# Metro SP Construction Management API

## Overview

Sistema de gestão de construções para o Metrô de São Paulo com análise de desvios BIM e relatórios com IA.

## Getting Started

### 1. Install Dependencies

```bash
cd backend
pip install -e .
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configurations.

### 3. Start Infrastructure

```bash
cd ../deploy/infra
docker-compose up -d
```

### 4. Initialize Database

```bash
cd ../../backend
chmod +x scripts/init_db.sh
./scripts/init_db.sh
```

### 5. Run Application

```bash
python run.py
```

API will be available at: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`

## Default Admin User

- **Registro**: 0000001
- **Password**: admin123
- **Email**: admin@metrosp.com.br

⚠️ **Change the password after first login!**

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login with registro + password | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/` | Create user | ADMIN/SUPERVISOR |
| GET | `/api/users/` | List users | ADMIN/SUPERVISOR |
| GET | `/api/users/{id}` | Get user | Authenticated |
| PUT | `/api/users/{id}` | Update user | ADMIN |
| DELETE | `/api/users/{id}` | Delete user | ADMIN |

### Constructions (`/api/constructions`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/constructions/` | Create construction | ADMIN/SUPERVISOR |
| GET | `/api/constructions/` | List constructions | Authenticated |
| GET | `/api/constructions/{id}` | Get construction details | Authenticated |
| PUT | `/api/constructions/{id}` | Update construction | ADMIN/SUPERVISOR |
| DELETE | `/api/constructions/{id}` | Delete construction | ADMIN |
| POST | `/api/constructions/{id}/users` | Assign users | ADMIN/SUPERVISOR |
| DELETE | `/api/constructions/{id}/users/{user_id}` | Remove user | ADMIN/SUPERVISOR |
| POST | `/api/constructions/{id}/bim` | Upload BIM reference | ADMIN/SUPERVISOR |

### Progress (`/api/progress`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/progress/` | Register progress with photo | Authenticated |
| GET | `/api/progress/{id}` | Get progress entry | Authenticated |
| GET | `/api/progress/construction/{id}` | List progress by construction | Authenticated |

### Reports (`/api/reports`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reports/construction/{id}` | Generate AI report | ADMIN/SUPERVISOR |
| GET | `/api/reports/{id}` | Get report | Authenticated |
| GET | `/api/reports/construction/{id}` | List reports | Authenticated |

## User Roles

### ADMIN
- Full system access
- User management (CRUD)
- Construction management (CRUD)
- All operations

### SUPERVISOR
- Create constructions
- Assign users to constructions
- Upload BIM references
- Generate reports
- Create users (OPERADOR/SUPERVISOR)

### OPERADOR
- View assigned constructions
- Register progress with photos
- View reports and deviations

## Workflow Example

### 1. Create Construction

```bash
POST /api/constructions/
{
  "name": "Estação Vila Madalena",
  "description": "Construção da nova estação",
  "location": "Vila Madalena, São Paulo",
  "start_date": "2025-01-15",
  "end_date": "2026-12-31"
}
```

### 2. Upload BIM Reference

```bash
POST /api/constructions/{id}/bim
Form Data:
  - file: [BIM_IMAGE.jpg]
  - phase_id: {phase_id}
  - description: "Planta estrutura pilar A"
```

### 3. Register Progress

```bash
POST /api/progress/
Form Data:
  - construction_id: {construction_id}
  - phase_id: {phase_id}
  - file: [PROGRESS_PHOTO.jpg]
  - notes: "Estrutura concluída 70%"
```

### 4. Generate Report

```bash
POST /api/reports/construction/{id}
```

## Deviation Calculation

The system uses **SSIM (Structural Similarity Index)** to calculate deviation between BIM references and progress photos:

- **Score 100**: Perfect match
- **Score 70-100**: Good conformity
- **Score < 70**: Critical deviation (flagged in reports)

### Process:
1. Grayscale conversion
2. Histogram equalization
3. Image resize
4. SSIM calculation
5. Score normalization (0-100)

## S3 Storage Structure

```
metro-sp-constructions/
├── constructions/
│   └── {construction_id}/
│       ├── bim/
│       │   └── {uuid}_{filename}.jpg
│       └── progress/
│           └── {uuid}_{filename}.jpg
```

## OpenAI Report Generation

Reports include:

1. **Executive Summary**: Overall construction status
2. **Deviation Analysis**: Critical deviations (score < 70)
3. **Phase Analysis**: Progress per phase
4. **Recommendations**: Corrective actions
5. **Risks**: Technical and schedule risks

## Standard Phases

Automatically created for each construction:

1. Fundação (Foundation)
2. Estrutura (Structure)
3. Alvenaria (Masonry)
4. Instalações (Installations)
5. Acabamento (Finishing)
6. Finalização (Finalization)

## Error Handling

All errors return consistent format:

```json
{
  "detail": "Error message description"
}
```

Status codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Development

### Run migrations

```bash
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```

### Create new user

```python
python scripts/create_admin.py
```

### Run tests

```bash
pytest tests/
```

## Production Deployment

1. Update environment variables in `.env`
2. Use strong JWT secret key
3. Configure proper CORS origins
4. Use production-ready database
5. Setup SSL/TLS
6. Configure OpenAI API key
7. Setup S3/MinIO with proper credentials


