FIND_BEST_RECIPES = """
    WITH matches AS (
        SELECT DISTINCT 
            recipe_id,
            ingredient_id,
            CASE
                WHEN ingredient_id IN ({ingredient_ids}) 
                THEN 1 ELSE 0
            END AS used_ingredient,
            CASE
                WHEN ingredient_id IN ({ingredient_ids}) 
                THEN (
                    CASE WHEN ingredient_id IN ({pantry_ingredient_ids})
                    THEN 1 ELSE 2 END
                )
                ELSE 0
            END AS score
        FROM ingredients_master
    ),
    
    rel_ids AS (
        SELECT
            recipe_id,
            SUM(used_ingredient) AS n_ingredients_used,
            COUNT(*) AS total_ingredients,
            SUM(score) AS total_score
        FROM matches
        GROUP BY recipe_id
    )
    
    SELECT
        t1.recipe_id,
        t1.title as recipe_name,
        t1.link as recipe_url,
        t1.image_link as image_url,
        t1.avg_rating as avg_rating,
        t2.n_ingredients_used,
        t2.total_ingredients,
        t2.total_score
    FROM recipe_master t1
    JOIN rel_ids t2
    ON t1.recipe_id = t2.recipe_id
    AND t2.n_ingredients_used > 0
    AND t2.total_ingredients > 6
    AND t1.avg_rating > 0
    ORDER BY  t2.total_ingredients - t2.n_ingredients_used, 
    t1.weighted_rating DESC
    LIMIT {limit}
"""