import React, { useState, useEffect } from 'react';
import IngredientSearch from './IngredientSearch';
import { components, backgrounds } from '../styles/foodStyles';

// Default food-friendly styles using the new style system
const defaultStyles = {
  container: "w-full space-y-8",
  searchSection: "w-full",
  panelSection: "w-full",
  panelTitle: `${components.heading.h3} flex items-center space-x-2`,
  panelHeader: "flex items-center justify-between mb-6",
  ingredientPanel: `${components.card.ingredient} min-h-40 relative overflow-hidden`,
  ingredientGrid: "flex flex-wrap gap-3",
  ingredientTag: `${components.tag.ingredient} group relative animate-scale-in`,
  removeButton: "ml-3 text-orange-600 hover:text-red-600 hover:bg-red-100 rounded-full p-1 transition-all duration-200 transform hover:scale-110 group-hover:scale-100",
  removeIcon: "w-4 h-4",
  emptyState: "text-center py-12 text-stone-500",
  loadingState: "text-center py-12 text-orange-600 animate-pulse",
  clearAllButton: `${components.button.ghost} text-sm px-3 py-1`,
  retryButton: `${components.button.outline} text-sm px-4 py-2`,
  errorContainer: `${components.status.error} p-4 rounded-lg text-center`,
  statsContainer: "bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4 border border-orange-200 mb-4",
  statsText: "text-orange-800 text-sm font-medium",
  maxReachedWarning: `${components.status.warning} p-3 rounded-lg text-sm mb-4`,
};

const IngredientManager = ({
  loadPresetIngredients, // API function to load preset ingredients
  searchIngredient, // API function to search ingredients
  onIngredientsChange, // Callback when ingredients list changes
  initialIngredients = [], // Optional initial ingredients
  styles = {}, // Custom styles
  maxIngredients = 50, // Optional limit on total ingredients
  className = "",
  showStats = true, // Show ingredient count statistics
  showMaxWarning = true, // Show warning when approaching max
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
      // Show brief feedback for duplicate
      setError('This ingredient is already in your list');
      setTimeout(() => setError(null), 2000);
      return;
    }

    // Check max ingredients limit
    if (ingredients.length >= maxIngredients) {
      setError(`Maximum ${maxIngredients} ingredients allowed`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIngredients(prev => [...prev, ingredient]);
    setError(null); // Clear any previous errors
  };

  // Remove ingredient from panel with animation
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

  // Get ingredient emoji based on name (simple heuristic)
  const getIngredientEmoji = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tomato')) return '🍅';
    if (lowerName.includes('onion')) return '🧅';
    if (lowerName.includes('carrot')) return '🥕';
    if (lowerName.includes('pepper')) return '🌶️';
    if (lowerName.includes('lettuce') || lowerName.includes('salad')) return '🥬';
    if (lowerName.includes('potato')) return '🥔';
    if (lowerName.includes('mushroom')) return '🍄';
    if (lowerName.includes('corn')) return '🌽';
    if (lowerName.includes('apple')) return '🍎';
    if (lowerName.includes('banana')) return '🍌';
    if (lowerName.includes('cheese')) return '🧀';
    if (lowerName.includes('milk')) return '🥛';
    if (lowerName.includes('egg')) return '🥚';
    if (lowerName.includes('chicken')) return '🐔';
    if (lowerName.includes('beef')) return '🥩';
    if (lowerName.includes('fish')) return '🐟';
    if (lowerName.includes('bread')) return '🍞';
    if (lowerName.includes('rice')) return '🍚';
    if (lowerName.includes('pasta')) return '🍝';
    return '🥘'; // Default food emoji
  };

  // Calculate completion percentage for visual feedback
  const completionPercentage = Math.min((ingredients.length / Math.max(maxIngredients * 0.7, 5)) * 100, 100);
  const isNearingMax = ingredients.length >= maxIngredients * 0.8;

  return (
    <div className={`${componentStyles.container} ${className}`}>
      {/* Search Section */}
      <div className={componentStyles.searchSection}>
        <IngredientSearch
          searchIngredient={searchIngredient}
          onIngredientSelect={handleIngredientSelect}
          placeholder="Search and add ingredients... 🔍"
          styles={styles.search} // Allow nested search styles
        />
      </div>

      {/* Ingredient Panel Section */}
      <div className={componentStyles.panelSection}>
        {/* Panel Header */}
        <div className={componentStyles.panelHeader}>
          <h3 className={componentStyles.panelTitle}>
            <span className="text-2xl">📋</span>
            <span>Your Ingredients ({ingredients.length})</span>
          </h3>
          {ingredients.length > 0 && (
            <button
              onClick={handleClearAll}
              className={componentStyles.clearAllButton}
            >
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Stats Section */}
        {showStats && ingredients.length > 0 && (
          <div className={componentStyles.statsContainer}>
            <div className="flex items-center justify-between">
              <span className={componentStyles.statsText}>
                🎯 Progress: {ingredients.length} of {maxIngredients} ingredients
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-orange-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-orange-700 font-bold">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Warning for approaching max */}
        {showMaxWarning && isNearingMax && ingredients.length < maxIngredients && (
          <div className={componentStyles.maxReachedWarning}>
            ⚠️ You're approaching the maximum number of ingredients ({maxIngredients})
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className={componentStyles.errorContainer}>
            {error}
            {error.includes('Failed to load') && (
              <button
                onClick={handleRetry}
                className={`${componentStyles.retryButton} ml-3`}
              >
                🔄 Try Again
              </button>
            )}
          </div>
        )}

        {/* Ingredient Panel */}
        <div className={componentStyles.ingredientPanel}>
          {isLoading ? (
            <div className={componentStyles.loadingState}>
              <div className="text-3xl mb-2">🍳</div>
              <div>Loading your ingredients...</div>
            </div>
          ) : ingredients.length === 0 ? (
            <div className={componentStyles.emptyState}>
              <div className="text-6xl mb-4 opacity-50">🥗</div>
              <div className="text-lg font-medium text-stone-600 mb-2">
                No ingredients selected yet
              </div>
              <div className="text-sm text-stone-500">
                Search above to add ingredients to your recipe finder
              </div>
            </div>
          ) : (
            <div className={componentStyles.ingredientGrid}>
              {ingredients.map((ingredient, index) => (
                <div
                  key={ingredient.id || index}
                  className={`${componentStyles.ingredientTag} ${
                    index < 3 ? 'animate-slide-up' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-lg mr-2">
                    {getIngredientEmoji(ingredient.name)}
                  </span>
                  <span className="font-semibold">
                    {ingredient.name}
                  </span>
                  <button
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className={componentStyles.removeButton}
                    title={`Remove ${ingredient.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Subtle background pattern for empty state */}
          {ingredients.length === 0 && !isLoading && (
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-orange-200 via-transparent to-amber-200" />
            </div>
          )}
        </div>

        {/* Helper Text */}
        {ingredients.length > 0 && ingredients.length < 3 && (
          <div className="mt-4 text-center text-sm text-stone-500 bg-orange-50 rounded-lg p-3 border border-orange-100">
            💡 <strong>Tip:</strong> Add more ingredients to get better recipe matches!
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientManager;