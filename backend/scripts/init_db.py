#!/usr/bin/env python3

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine
from repositories.models.base import BaseModel
from configs import ENV

def create_tables():
    engine = create_engine(ENV.DATABASE_URL)
    Base.metadata.create_all(engine)
    print("Tabelas criadas com sucesso!")

if __name__ == "__main__":
    create_tables()
