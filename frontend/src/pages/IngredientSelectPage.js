import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import IngredientManager from '../components/IngredientManager';
import { components, backgrounds, layout } from '../styles/foodStyles';

const IngredientSelectPage = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock API functions - replace with your actual API calls
  const loadPresetIngredients = async () => {
    // Your existing API call
    return [];
  };

  const searchIngredient = async (query) => {
    try {
        if (!query.trim()) return [];
        
        // Replace with your actual API endpoint
        const response = await fetch(`http://127.0.0.1:8000/search-ingredient?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to search ingredients');
        }
        const data = await response.json();
        return data.ingredients || [];
      } catch (error) {
        console.error('Error searching ingredients:', error);
        return [];
      }
  };

  const saveIngredients = async (ingredients) => {
    setIsLoading(true);
    setError(null);
    try {
      // Your existing save logic
      console.log('Saving ingredients:', ingredients);
    } catch (error) {
      console.error('Error saving ingredients:', error);
      setError('Failed to save ingredients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient before continuing.');
      return;
    }
    
    console.log('Continuing with ingredients:', selectedIngredients);
    // Add your navigation logic here
  };

  // Enhanced custom styles using the new style system
  const customIngredientStyles = {
    container: `${layout.containerSmall} space-y-8`,
    panelTitle: components.heading.h3,
    ingredientPanel: `${components.card.ingredient} min-h-40`,
    ingredientTag: components.tag.ingredient,
    removeButton: "ml-3 text-orange-600 hover:text-red-600 hover:bg-red-100 rounded-full p-1 transition-all duration-200 transform hover:scale-110",
  };

  return (
    <Layout className={backgrounds.primary}>
      <div className={`${layout.section} animate-fade-in`}>
        <div className={layout.containerSmall}>
          {/* Enhanced Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">🥗</span>
            </div>
            <h1 className={`${components.heading.h1} mb-4`}>
              Select Your Ingredients
            </h1>
            <p className={`${components.heading.subtitle} max-w-2xl mx-auto`}>
              Search and select the ingredients you'd like to use. We'll find the perfect recipes 
              that make the most of what you have on hand.
            </p>
          </div>

          {/* Ingredient Manager with enhanced styling */}
          <div className={`${components.card.elevated} p-8 mb-8`}>
            <IngredientManager
              loadPresetIngredients={loadPresetIngredients}
              searchIngredient={searchIngredient}
              onIngredientsChange={setSelectedIngredients}
              initialIngredients={selectedIngredients}
              styles={customIngredientStyles}
              maxIngredients={20}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleContinue}
              disabled={selectedIngredients.length === 0 || isLoading}
              className={`${components.button.primary} px-8 py-3 text-lg min-w-48 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className={`${components.loading.spin} w-5 h-5 mr-2`}>⟳</div>
                  Processing...
                </div>
              ) : (
                `Find Recipes (${selectedIngredients.length})`
              )}
            </button>
            
            <button
              onClick={() => setSelectedIngredients([])}
              className={components.button.outline}
              disabled={selectedIngredients.length === 0}
            >
              Clear All
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className={`${components.status.error} p-4 rounded-lg mt-6 text-center`}>
              {error}
            </div>
          )}

          {/* Tips Section */}
          <div className={`${components.card.base} p-6 mt-12`}>
            <h3 className={`${components.heading.h4} mb-4 text-center`}>
              💡 Pro Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Add main ingredients like proteins and vegetables first</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Don't forget about spices and seasonings you have</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>The more ingredients you add, the better recipe matches we'll find</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>You can always remove ingredients that don't work</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IngredientSelectPage;