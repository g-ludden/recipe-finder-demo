import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import IngredientManager from '../components/IngredientManager';
import { components, backgrounds, layout } from '../styles/foodStyles';
import { useLocalStorage } from '../hooks/useLocalStorage';

const IngredientSelectPage = ({onNavigateToRecipes}) => {
  //const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useLocalStorage('selectedIngredients', []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock API functions - replace with your actual API calls
  const loadPresetIngredients = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/fetch-pantry-ingredients`);
        if (!response.ok) {
          throw new Error('Failed to fetch pantry ingredients');
        }
        const data = await response.json();
        console.log('Pantry ingredients', data)
        return data.ingredients || [];
      } catch (error) {
        console.error('Error fetching pantry ingredients:', error);
        return [];
      }
  };

  const searchIngredient = async (query) => {
    try {
      if (!query.trim()) return [];
      
      const response = await fetch(`http://127.0.0.1:8000/search-ingredient?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search ingredients');
      }
      const data = await response.json();
      console.log('Search ingredient results', data)
      return data.ingredients || [];
    } catch (error) {
      console.error('Error searching ingredients:', error);
      return [];
    }
  };

  const handleContinue = () => {
    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient before continuing.');
      return;
    }

    onNavigateToRecipes();
    console.log('Continuing with ingredients:', selectedIngredients);
  };

  // Enhanced custom styles using full-width containers
  const customIngredientStyles = {
    container: `w-full px-4 sm:px-6 lg:px-8 space-y-8`, // Full width with padding
    panelTitle: components.heading.h3,
    ingredientPanel: `${components.card.ingredient} min-h-40`,
    ingredientTag: components.tag.ingredient,
    removeButton: "ml-3 text-orange-600 hover:text-red-600 hover:bg-red-100 rounded-full p-1 transition-all duration-200 transform hover:scale-110",
  };

  return (
    <Layout className={backgrounds.primary}>
      <div className={`${layout.section} animate-fade-in`}>
        {/* Changed from layout.containerSmall to full width with padding */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Enhanced Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">🥗</span>
            </div>
            <h1 className={`${components.heading.h1} mb-4`}>
              Select Your Ingredients
            </h1>
            {/* Removed max-w-2xl mx-auto for full width */}
            <p className={`${components.heading.subtitle}`}>
              Search and select the ingredients you'd like to use. We'll search the web to find the perfect recipes 
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
              {isLoading ? 'Loading...' : 'Find Recipes'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IngredientSelectPage;