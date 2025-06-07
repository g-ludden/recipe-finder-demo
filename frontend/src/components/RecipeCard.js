import React from 'react';
import { components, backgrounds } from '../styles/foodStyles';

const RecipeCard = ({ 
  recipeName, 
  recipeUrl, 
  imageUrl, 
  avgRating, 
  nIngredientsUsed, 
  totalIngredients 
}) => {
  const handleGoToRecipe = () => {
    window.open(recipeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`${components.card.recipe} group relative animate-scale-in overflow-hidden max-w-sm`}>
      {/* Image Container */}
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={recipeName}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Recipe+Image';
          }}
        />
        
        {/* Rating Badge */}
        {/* Rating Badge - only show if avgRating is a valid number */}
          {avgRating && !isNaN(parseFloat(avgRating)) && parseFloat(avgRating) > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-100 to-amber-100 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 border border-orange-200 shadow-sm">
              <svg 
                className="w-4 h-4 text-amber-600 fill-current" 
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span className="text-sm font-semibold text-orange-800">
                {parseFloat(avgRating).toFixed(1)}
              </span>
            </div>
          )}
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Ingredients Usage */}
        <div className="mb-3">
          <span className={`${components.tag.ingredient} text-xs`}>
            {`You have ${nIngredientsUsed} out of ${totalIngredients} ingredients needed`}
          </span>
        </div>

        {/* Recipe Name */}
        <h3 className="text-lg font-bold text-stone-800 mb-3 line-clamp-2 leading-tight group-hover:text-orange-700 transition-colors duration-200">
          {recipeName}
        </h3>

        {/* Go to Recipe Button */}
        <button
          onClick={handleGoToRecipe}
          className={`${components.button.primary} w-full transform hover:-translate-y-0.5`}
        >
          Go to Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;