from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from typing import List
import os, sqlalchemy

from sqlalchemy import text
from sqlalchemy.orm import Session
from app.utils import fetch_top_k_ingredients, rev_ingredient_lookup, \
    pantry_ingredients_preload, pantry_ids, get_substitutes
from app.database import get_db
from app.queries import FIND_BEST_RECIPES

app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

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

@app.get("/fetch-pantry-ingredients")
def fetch_pantry_ingredients():
    return {"ingredients": pantry_ingredients_preload}

@app.post("/find-best-recipes")
async def find_best_recipes(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        chosen_ingredient_ids = body.get("ingredientIds", [])

        if not chosen_ingredient_ids:
            raise HTTPException(status_code=400, detail="No ingredients provided")

        # Add substitutes
        substitute_ids = get_substitutes(chosen_ingredient_ids)
        chosen_ingredient_ids = list(set(substitute_ids + chosen_ingredient_ids))


        query = FIND_BEST_RECIPES.format(
            ingredient_ids=",".join([str(id_) for id_ in chosen_ingredient_ids]),
            limit=200,
            pantry_ingredient_ids=",".join([str(id_) for id_ in pantry_ids]),
            alpha=0.7,
            beta=0.9
        )

        result = db.execute(text(query))
        recipes = []
        recipe_title_log = set()
        for row in result:
            if row.recipe_name not in recipe_title_log:
                recipes.append({
                    "id": row.recipe_id,
                    "recipeName": row.recipe_name,
                    "recipeUrl": row.recipe_url,
                    "imageUrl": row.image_url,
                    "avgRating": row.avg_rating,
                    "nIngredientsUsed": row.n_ingredients_used,
                    "totalIngredients": row.total_ingredients
                })
                recipe_title_log.add(row.recipe_name)

        return {"recipes": recipes}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/test-db")
async def test_db(db: Session = Depends(get_db)):
    try:
        print("Starting database test...")

        # Test 1: Check if we can get a database session
        print(f"Database session type: {type(db)}")
        print(f"Database URL: {os.getenv('DATABASE_URL')}")

        # Test 2: Try the simplest possible query
        from sqlalchemy import text
        result = db.execute(text("SELECT 1 as test_column"))
        print("Simple SELECT 1 worked")

        # Test 3: Check if we can fetch the result
        row = result.fetchone()
        print(f"Fetched row: {row}")
        print(f"Row type: {type(row)}")

        # Test 4: Try to list tables
        tables_result = db.execute(
            text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in tables_result.fetchall()]
        print(f"Available tables: {tables}")

        # Test 5: Try your actual table
        if 'recipe_master' in tables:
            count_result = db.execute(text("SELECT COUNT(*) FROM recipe_master"))
            count = count_result.fetchone()[0]
            print(f"recipe_master has {count} rows")
        else:
            print("recipe_master table not found!")

        return {"status": "success", "tables": tables}

    except Exception as e:
        print(f"Database test failed: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Database test error: {str(e)}")