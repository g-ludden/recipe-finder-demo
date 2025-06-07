import React, { useState, useEffect } from 'react';
import IngredientManager from '../components/IngredientManager';

const IngredientSelectPage = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API function to load preset ingredients
  const loadPresetIngredients = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/ingredients/presets');
      if (!response.ok) {
        throw new Error('Failed to load preset ingredients');
      }
      const data = await response.json();
      return data.ingredients || [];
    } catch (error) {
      console.error('Error loading preset ingredients:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // API function to search ingredients
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

  // Handle ingredients change from IngredientManager
  const handleIngredientsChange = (ingredients) => {
    setSelectedIngredients(ingredients);
    console.log('Selected ingredients updated:', ingredients);
  };

  // Save selected ingredients (example action)
  const handleSaveIngredients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/ingredients/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to save ingredients');
      }

      const data = await response.json();
      console.log('Ingredients saved successfully:', data);
      
      // Show success message or redirect
      alert('Ingredients saved successfully!');
    } catch (error) {
      console.error('Error saving ingredients:', error);
      setError('Failed to save ingredients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Continue with selected ingredients (example action)
  const handleContinue = () => {
    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient before continuing.');
      return;
    }
    
    console.log('Continuing with ingredients:', selectedIngredients);
    // Add your navigation logic here
    // e.g., navigate('/next-step');
  };

  // Custom styles for the IngredientManager
  const customStyles = {
    container: "max-w-4xl mx-auto p-6 space-y-6",
    panelTitle: "text-xl font-bold text-gray-900 mb-4",
    ingredientPanel: "bg-white border-2 border-gray-300 rounded-xl p-6 min-h-40 shadow-sm",
    ingredientTag: "inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold border border-green-200",
    removeButton: "ml-3 text-green-600 hover:text-red-600 hover:bg-red-100 rounded-full p-1 transition-all duration-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Ingredients
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search and select the ingredients you'd like to use. You can add multiple ingredients 
            and remove any you don't need.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ingredient Manager Component */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <IngredientManager
            loadPresetIngredients={loadPresetIngredients}
            searchIngredient={searchIngredient}
            onIngredientsChange={handleIngredientsChange}
            initialIngredients={[]}
            styles={customStyles}
            maxIngredients={20}
            className="p-6"
          />
        </div>

        {/* Summary Section */}
        {selectedIngredients.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Selection Summary
            </h3>
            <p className="text-blue-700 mb-4">
              You have selected <strong>{selectedIngredients.length}</strong> ingredient{selectedIngredients.length !== 1 ? 's' : ''}:
            </p>
            <div className="text-sm text-blue-600">
              {selectedIngredients.map((ingredient, index) => (
                <span key={ingredient.id}>
                  {ingredient.name}
                  {index < selectedIngredients.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleSaveIngredients}
            disabled={selectedIngredients.length === 0 || isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Saving...' : 'Save Ingredients'}
          </button>
          
          <button
            onClick={handleContinue}
            disabled={selectedIngredients.length === 0}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Continue with Selection
          </button>
          
          <button
            onClick={() => setSelectedIngredients([])}
            disabled={selectedIngredients.length === 0}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Clear All
          </button>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gray-100 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            How to Use
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              Use the search box to find ingredients by name
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              Click on search results to add them to your selection
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              Remove ingredients by clicking the × button on each tag
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">4.</span>
              Save your selection or continue to the next step
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IngredientSelectPage;