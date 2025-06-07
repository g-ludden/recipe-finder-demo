from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from typing import List
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
conn = engine.connect()

### Preload ingredients lookup
ingredient_lookup = {}

@app.post("/search-ingredient")
async def search_ingredient(request: Request, response_model=List[Ingredient]):
    payload = request.json()
    search_query = await payload.get("userInput", False)
    if not search_query or not isinstance(search_query, str):
        return {"none"}

    results = ingredient_lookup.search(search_query, 10)
    return {
        "candidateIngredients": results
    }

@app.post("/find-best-recipes")
async def find_best_recipes(request: Request):
    payload = await request.json()
    chosen_recipe_ids = payload.get("chosenRecipeIds", False)
    if not chosen_recipe_ids:
        return {"none"}

    conn.execute()