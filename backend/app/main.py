from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from typing import List
import os, sqlalchemy

from sqlalchemy.orm import Session
from app.utils import fetch_top_k_ingredients, rev_ingredient_lookup
from app.database import get_db
from app.queries import FIND_BEST_RECIPES

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
async def find_best_recipes(request: Request, db: Session = Depends(get_db)):
    try:
        print(os.getenv("DATABASE_URL"))
        body = await request.json()
        chosen_ingredient_ids = body.get("ingredientIds", [])

        if not chosen_ingredient_ids:
            raise HTTPException(status_code=400, detail="No ingredients provided")

        params = {
            "ingredient_ids": ",".join(chosen_ingredient_ids),
            "limit": 50
        }

        result = db.execute(FIND_BEST_RECIPES, params=params)
        recipes = []
        for row in result:
            recipes.append({
                "id": row.recipe_id,
                "recipeName": row.recipe_name,
                "recipeUrl": row.recipe_url,
                "imageUrl": row.image_url,
                "avgRating": row.average_weighting,
                "nIngredientsUsed": row.n_ingredients_used
            })

        return {"recipes": recipes}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")