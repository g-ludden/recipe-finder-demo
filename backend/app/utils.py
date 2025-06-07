import pandas as pd
import random
import inflect
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

inflector = inflect.engine()


def fetch_top_k_ingredients(search_query, limit=10):
    """
    Return top K results from ingredients list base on a
    user's search query
    """
    search_query = search_query.lower()
    if ' ' in search_query:
        toks = search_query.split(' ')
        inflected_toks = [inflector.plural(tok) for tok in toks]
        full_toks = set(toks + inflected_toks)
        candidates = token_search(full_toks)
        fuzz_ranked = process.extract(
            search_query, candidates, scorer=fuzz.token_sort_ratio, limit=limit
        )
        res = [x[0] for x in fuzz_ranked]
        return res
    else:
        search_query = search_query.lower()
        res = [ing for ing in ingredients if search_query in ing]

        if len(res) > limit:
            return res[:limit]
        else:
            return res

def token_search(tokens):
    candidate_idxs = [
        idx for idx in range(N) if len(ingredient_tokens[idx].intersection(tokens)) > 0
    ]
    candidates = [ingredient_lookup[idx] for idx in candidate_idxs]
    return candidates