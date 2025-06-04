# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os, sqlalchemy

app = FastAPI()

origins = [
    os.getenv("VITE_SITE_ORIGIN", "http://localhost:5173"),
    "https://frontend-production.up.railway.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

engine = sqlalchemy.create_engine(os.getenv("DATABASE_URL", ""))
