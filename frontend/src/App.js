import React, { useState } from 'react';
import './App.css';
import IngredientSelectPage from './pages/IngredientSelectPage';
import RecipePage from './pages/RecipePage';

function App() {
  const [currentPage, setCurrentPage] = useState('ingredients'); // 'ingredients' or 'recipes'

  const navigateToRecipes = () => {
    setCurrentPage('recipes');
  };

  const navigateToIngredients = () => {
    setCurrentPage('ingredients');
  };

  return (
    <div className="App">
      {currentPage === 'ingredients' && (
        <IngredientSelectPage onNavigateToRecipes={navigateToRecipes} />
      )}
      {currentPage === 'recipes' && (
        <RecipePage onNavigateToIngredients={navigateToIngredients} />
      )}
    </div>
  );
}

export default App;
