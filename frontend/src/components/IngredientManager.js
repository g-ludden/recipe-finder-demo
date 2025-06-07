import React, { useState, useEffect } from 'react';
import IngredientSearch from './IngredientSearch';

// Default styles object - easily customizable
const defaultStyles = {
  container: "w-full space-y-6",
  searchSection: "w-full",
  panelSection: "w-full",
  panelTitle: "text-lg font-semibold text-gray-800 mb-4",
  ingredientPanel: "bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-32",
  ingredientGrid: "flex flex-wrap gap-2",
  ingredientTag: "inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium",
  removeButton: "ml-2 text-blue-600 hover:text-red-600 hover:bg-red-100 rounded-full p-1 transition-colors",
  removeIcon: "w-4 h-4",
  emptyState: "text-gray-500 text-center py-8",
  loadingState: "text-gray-500 text-center py-8 animate-pulse"
};

const IngredientManager = ({
  loadPresetIngredients, // API function to load preset ingredients
  searchIngredient, // API function to search ingredients
  onIngredientsChange, // Callback when ingredients list changes
  initialIngredients = [], // Optional initial ingredients
  styles = {}, // Custom styles
  maxIngredients = 50, // Optional limit on total ingredients
  className = ""
}) => {
  // Merge default styles with custom styles
  const componentStyles = { ...defaultStyles, ...styles };
  
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load preset ingredients on component mount
  useEffect(() => {
    if (loadPresetIngredients && initialIngredients.length === 0) {
      loadPresetIngredientsData();
    }
  }, []);

  // Notify parent component when ingredients change
  useEffect(() => {
    onIngredientsChange?.(ingredients);
  }, [ingredients, onIngredientsChange]);

  // Load preset ingredients from API
  const loadPresetIngredientsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const presetIngredients = await loadPresetIngredients();
      setIngredients(presetIngredients || []);
    } catch (err) {
      console.error('Error loading preset ingredients:', err);
      setError('Failed to load preset ingredients');
    } finally {
      setIsLoading(false);
    }
  };

  // Add ingredient from search
  const handleIngredientSelect = (ingredient) => {
    // Check if ingredient already exists
    const exists = ingredients.some(existing => existing.id === ingredient.id);
    if (exists) {
      return; // Don't add duplicates
    }

    // Check max ingredients limit
    if (ingredients.length >= maxIngredients) {
      console.warn(`Maximum ${maxIngredients} ingredients allowed`);
      return;
    }

    setIngredients(prev => [...prev, ingredient]);
  };

  // Remove ingredient from panel
  const handleRemoveIngredient = (ingredientId) => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== ingredientId));
  };

  // Clear all ingredients
  const handleClearAll = () => {
    setIngredients([]);
  };

  // Retry loading preset ingredients
  const handleRetry = () => {
    loadPresetIngredientsData();
  };

  return (
    <div className={`${componentStyles.container} ${className}`}>
      {/* Search Section */}
      <div className={componentStyles.searchSection}>
        <IngredientSearch
          searchIngredient={searchIngredient}
          onIngredientSelect={handleIngredientSelect}
          placeholder="Search and add ingredients..."
          styles={styles.search} // Allow nested search styles
        />
      </div>

      {/* Ingredient Panel Section */}
      <div className={componentStyles.panelSection}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={componentStyles.panelTitle}>
            Ingredients ({ingredients.length})
          </h3>
          {ingredients.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear All
            </button>
          )}
        </div>

        <div className={componentStyles.ingredientPanel}>
          {isLoading ? (
            <div className={componentStyles.loadingState}>
              Loading ingredients...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={handleRetry}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Try Again
              </button>
            </div>
          ) : ingredients.length === 0 ? (
            <div className={componentStyles.emptyState}>
              No ingredients selected. Search and add ingredients above.
            </div>
          ) : (
            <div className={componentStyles.ingredientGrid}>
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className={componentStyles.ingredientTag}>
                  <span>{ingredient.name}</span>
                  <button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className={componentStyles.removeButton}
                    aria-label={`Remove ${ingredient.name}`}
                    title={`Remove ${ingredient.name}`}
                  >
                    <svg 
                      className={componentStyles.removeIcon} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientManager;