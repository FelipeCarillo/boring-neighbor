#!/bin/bash

echo "Initializing database..."

cd "$(dirname "$0")/.."

echo "Running Alembic migrations..."
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

echo "Creating admin user..."
python scripts/create_admin.py

echo "Database initialization complete!"


