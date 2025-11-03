"""
Script para adicionar campos de modelo 3D na tabela constructions.
Execute apenas uma vez se o banco já existir antes desta atualização.
"""
from sqlalchemy import text
from src.repositories.database import engine

def add_model_3d_fields():
    """
    Adiciona campos de modelo 3D na tabela constructions.
    """
    with engine.connect() as conn:
        try:
            # Verificar se os campos já existem
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'constructions' 
                AND column_name = 'model_3d_s3_key'
            """))
            
            if result.fetchone():
                print("✅ Campos de modelo 3D já existem na tabela constructions")
                return
            
            # Adicionar campos
            conn.execute(text("""
                ALTER TABLE constructions
                ADD COLUMN model_3d_s3_key VARCHAR(500) NULL,
                ADD COLUMN model_3d_file_name VARCHAR(255) NULL,
                ADD COLUMN model_3d_file_size INTEGER NULL,
                ADD COLUMN model_3d_file_type VARCHAR(10) NULL
            """))
            
            conn.commit()
            print("✅ Campos de modelo 3D adicionados com sucesso!")
            
        except Exception as e:
            print(f"❌ Erro ao adicionar campos: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    add_model_3d_fields()

