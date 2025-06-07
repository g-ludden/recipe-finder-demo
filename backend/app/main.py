from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from typing import List
import os, sqlalchemy

from app.utils import fetch_top_k_ingredients, rev_ingredient_lookup

app = FastAPI()

origins = [
    os.getenv("VITE_SITE_ORIGIN", "http://localhost:3000"),
    "https://frontend-production.up.railway.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

# engine = sqlalchemy.create_engine(os.getenv("DATABASE_URL", ""))
# conn = engine.connect()


@app.get("/search-ingredient")
async def search_ingredient(q: str):
    search_query = q
    if not search_query or not isinstance(search_query, str):
        raise HTTPException(status_code=69, detail="Invalid input")

    search_results = fetch_top_k_ingredients(search_query)
    ingredients = [
        {
            "id": rev_ingredient_lookup[ing],
            "name": ing
        }
        for ing in search_results
    ]
    return {"ingredients": ingredients}



@app.post("/find-best-recipes")
async def find_best_recipes(request: Request):
    raise NotImplementedError()