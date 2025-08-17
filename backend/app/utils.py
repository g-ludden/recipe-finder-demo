import pandas as pd
import inflect
import pickle as pkl
from rapidfuzz import fuzz, process

# Preload ingredient data and set some global vars
df = pd.read_excel('./app/data/ingredients.xlsx')
ingredients = df['ingredient_name'].tolist()
ids = df['ingredient_id'].tolist()
ingredient_lookup = {id_: ingredient for id_, ingredient in zip(ids, ingredients)}
rev_ingredient_lookup = {ingredient: id_ for ingredient, id_ in zip(ingredients, ids)}
ingredient_tokens = [
    set(ingredient.split(' ')) for ingredient in ingredients
]
N = len(ingredients)

pantry_df = pd.read_excel('./app/data/pantry_ingredients.xlsx')
pantry_ingredients = pantry_df['ingredient_name'].tolist()
pantry_ids = pantry_df['ingredient_id'].tolist()
pantry_ingredients_preload = [
    {
        "id": id_,
        "name": ingredient
    }
    for id_, ingredient in zip(pantry_ids, pantry_ingredients)
]

with open('./app/data/substitutions_final.pkl', 'rb') as f:
    substitutes_lookup = pkl.load(f)

inflector = inflect.engine()


def fetch_top_k_ingredients(search_query, limit=10):
    """
    Return top K results from ingredients list base on a
    user's search query.
    """
    search_query = search_query.lower()
    if ' ' in search_query:
        toks = search_query.split(' ')
        inflected_toks = [inflector.plural(tok) for tok in toks]
        full_toks = set(toks + inflected_toks)
        candidates = token_search(full_toks)

    else:
        search_query = search_query.lower()
        search_query_inflected = inflector.plural(search_query)
        candidates = [
            ing for ing in ingredients if (
                    search_query in ing
                    or search_query_inflected in ing
            )
        ]

    fuzz_ranked = process.extract(
        search_query, candidates, scorer=fuzz.token_sort_ratio, limit=limit
    )
    res = [x[0] for x in fuzz_ranked]
    return res


def token_search(tokens):
    candidate_idxs = [
        idx for idx in range(N) if len(ingredient_tokens[idx].intersection(tokens)) > 0
    ]
    candidates = [ingredient_lookup[idx] for idx in candidate_idxs]
    return candidates

def get_substitutes(ingredient_ids):
    ingredient_names = [ingredient_lookup[id_] for id_ in ingredient_ids]
    substitutes = []
    for ingredient in ingredient_names:
        substitutes += substitutes_lookup[ingredient]

    return [rev_ingredient_lookup[sub] for sub in substitutes]
