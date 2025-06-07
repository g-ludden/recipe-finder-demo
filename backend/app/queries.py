FIND_BEST_RECIPES = """
    WITH rel_ids AS (
        SELECT
            recipe_id,
            COUNT(*) AS n_ingredients_used
        FROM ingredients_master
        WHERE ingredient_id = ANY(:chosen_ingredient_ids)
        GROUP BY recipe_id
    )
    
    SELECT
        t1.recipe_id,
        t1.title as recipe_name,
        t1.link as recipe_url,
        t1.image_link as image_url,
        t1.avg_rating as rating,
        t1.ratings_count,
        t2.n_ingredients_used
    FROM recipe_master t1
    JOIN rel_ids t2
    ON t1.recipe_id = t2.recipe_id
    ORDER BY t2.n_ingredients_used DESC, t1.weighted_rating DESC
    LIMIT :limit
"""