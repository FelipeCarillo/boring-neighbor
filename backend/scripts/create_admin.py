import sys
sys.path.append(".")

from src.repositories.database import get_db_context
from src.repositories.repositories.user_repo.user_repo import UserRepository
from src.helpers.auth import hash_password
from src.helpers.enums import UserRole


def create_admin_user():
    """
    Create initial admin user for the system.
    Registro: 0000001
    Password: admin123
    """
    with get_db_context() as db:
        user_repo = UserRepository(db)
        
        existing_admin = user_repo.get_by_registro("0000001")
        if existing_admin:
            print("Admin user already exists!")
            return
        
        admin = user_repo.create(
            registro="0000001",
            password_hash=hash_password("admin123"),
            name="Administrador Sistema",
            email="admin@metrosp.com.br",
            role=UserRole.ADMIN,
        )
        
        print(f"Admin user created successfully!")
        print(f"Registro: 0000001")
        print(f"Password: admin123")
        print(f"Email: {admin.email}")
        print(f"\nPlease change the password after first login!")


if __name__ == "__main__":
    create_admin_user()


