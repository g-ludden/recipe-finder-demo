import React, { useState, useEffect, useCallback} from 'react';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { components, backgrounds, layout } from '../styles/foodStyles';
import { useLocalStorage } from '../hooks/useLocalStorage';

const RecipePage = ({onNavigateToIngredients}) => {
  const [selectedIngredients] = useLocalStorage('selectedIngredients', []);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gridLayout, setGridLayout] = useState('standard');
  const API_BASE_URL = process.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Fetch recipes when component mounts and selectedIngredients exist
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      fetchRecipes();
    }
  }, [selectedIngredients]);

  // Auto-detect optimal grid layout based on screen size and recipe count
  useEffect(() => {
    const detectOptimalLayout = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setGridLayout('mobile');
      } else if (width < 1024) {
        setGridLayout('tablet');
      } else if (width >= 1536 && recipes.length > 8) {
        setGridLayout('ultrawide');
      } else if (width >= 1024 && recipes.length > 6) {
        setGridLayout('desktop');
      } else {
        setGridLayout('standard');
      }
    };

    detectOptimalLayout();
    window.addEventListener('resize', detectOptimalLayout);
    return () => window.removeEventListener('resize', detectOptimalLayout);
  }, [recipes.length]);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ingredientIds = selectedIngredients.map(ingredient => ingredient.id);
      
      const response = await fetch('http://127.0.0.1:8000/find-best-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredientIds: ingredientIds
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
  
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedIngredients]);
  
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      fetchRecipes();
    }
  }, [selectedIngredients, fetchRecipes]);

  const handleRetry = () => {
    fetchRecipes();
  };

  const handleBackToIngredients = () => {
    onNavigateToIngredients();
    console.log('Navigate back to ingredient selection');
  };

  // Get the appropriate grid classes based on current layout
  const getGridClasses = () => {
    const baseClasses = layout.grid.base;
    
    let gridClass;
    switch(gridLayout) {
      case 'mobile':
        gridClass = layout.grid.recipeGrid.mobile;
        break;
      case 'tablet':
        gridClass = layout.grid.recipeGrid.tablet;
        break;
      case 'desktop':
        gridClass = layout.grid.recipeGrid.desktop;
        break;
      case 'compact':
        gridClass = layout.grid.recipeGrid.compact;
        break;
      case 'ultrawide':
        gridClass = layout.grid.recipeGrid.ultrawide;
        break;
      default:
        gridClass = layout.grid.recipeGrid.standard;
    }
    
    const gapClass = gridLayout === 'compact' ? layout.grid.gap.sm : layout.grid.gap.responsive;
    
    return `${baseClasses} ${gridClass} ${gapClass}`;
  };

  // Show message if no ingredients selected
  if (selectedIngredients.length === 0) {
    return (
      <Layout className={backgrounds.primary}>
        <div className={`${layout.section} animate-fade-in`}>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-lg">
                <span className="text-3xl">🤔</span>
              </div>
              <h1 className={`${components.heading.h1} mb-4`}>
                No Ingredients Selected
              </h1>
              <p className={`${components.heading.subtitle} mb-8`}>
                Please select some ingredients first to find matching recipes.
              </p>
              <button
                onClick={handleBackToIngredients}
                className={`${components.button.primary} px-8 py-3`}
              >
                Select Ingredients
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className={backgrounds.primary}>
      <div className={`${layout.section} animate-fade-in`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">🍳</span>
            </div>
            <h1 className={`${components.heading.h1} mb-4`}>
              Recipe Recommendations
            </h1>
            <p className={`${components.heading.subtitle} mb-4`}>
              Based on your {selectedIngredients.length} selected ingredient{selectedIngredients.length !== 1 ? 's' : ''}
            </p>
            
            {/* Selected Ingredients Summary */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {selectedIngredients.slice(0, 5).map((ingredient, index) => (
                <span key={ingredient.id || index} className={components.tag.ingredient}>
                  {ingredient.name}
                </span>
              ))}
              {selectedIngredients.length > 5 && (
                <span className={components.tag.secondary}>
                  +{selectedIngredients.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4 shadow-lg animate-pulse">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className={`${components.heading.h4} mb-2`}>
                Finding Perfect Recipes...
              </h3>
              <p className="text-stone-600">
                Searching for the best matches
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className={`${components.status.error} p-6 rounded-lg text-center mb-8`}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <span className="text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
              <p className="mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className={`${components.button.primary} px-6 py-2`}
                >
                  Try Again
                </button>
                <button
                  onClick={handleBackToIngredients}
                  className={`${components.button.ghost} px-6 py-2`}
                >
                  Back to Ingredients
                </button>
              </div>
            </div>
          )}

          {/* Recipe Results */}
          {!isLoading && !error && recipes.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className={`${components.heading.h3} mb-2`}>
                    Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-stone-600">
                    Have look through and take your pick!
                  </p>
                </div>
                <button
                  onClick={handleBackToIngredients}
                  className={`${components.button.ghost} px-4 py-2`}
                >
                  ← Modify Ingredients
                </button>
              </div>

              {/* Auto-Responsive Recipe Grid */}
              <div className={getGridClasses()}>
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipeName={recipe.recipeName}
                    recipeUrl={recipe.recipeUrl}
                    imageUrl={recipe.imageUrl}
                    avgRating={recipe.avgRating}
                    nIngredientsUsed={recipe.nIngredientsUsed}
                    totalIngredients={recipe.totalIngredients}
                  />
                ))}
              </div>
            </>
          )}

          {/* No Results State */}
          {!isLoading && !error && recipes.length === 0 && selectedIngredients.length > 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-lg">
                <span className="text-3xl">😔</span>
              </div>
              <h3 className={`${components.heading.h3} mb-4`}>
                No Recipes Found
              </h3>
              <p className={`${components.heading.subtitle} mb-8`}>
                We couldn't find any recipes that match your selected ingredients. 
                Try selecting different or more common ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBackToIngredients}
                  className={`${components.button.primary} px-8 py-3`}
                >
                  Try Different Ingredients
                </button>
                <button
                  onClick={handleRetry}
                  className={`${components.button.ghost} px-8 py-3`}
                >
                  Search Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RecipePage;