import React, { useState, useEffect, useRef } from 'react';
import { components } from '../styles/foodStyles';

// Default food-friendly styles using the new style system
const defaultStyles = {
  container: "relative w-full",
  input: components.input.search,
  loadingSpinner: "absolute right-4 top-1/2 transform -translate-y-1/2",
  spinner: "text-orange-500 animate-spin text-lg",
  dropdown: "absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border-2 border-orange-200 rounded-xl shadow-xl max-h-64 overflow-y-auto",
  resultItem: "px-4 py-3 cursor-pointer border-b border-orange-100 last:border-b-0 transition-all duration-200 flex items-center space-x-3",
  resultItemSelected: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 transform translate-x-1",
  resultItemHover: "hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700",
  resultText: "font-medium text-stone-700",
  resultIcon: "w-8 h-8 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center text-orange-700 font-bold flex-shrink-0",
  noResults: "px-4 py-6 text-stone-500 text-center bg-gradient-to-r from-orange-25 to-amber-25 rounded-lg m-2",
  searchIcon: "absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 text-lg"
};

const IngredientSearch = ({ 
  onIngredientSelect, 
  placeholder = "Search for ingredients... 🔍",
  className = "",
  searchIngredient, // Assuming this function is passed as a prop
  styles = {} // Allow custom styles to be passed in
}) => {
  // Merge default styles with custom styles
  const componentStyles = { ...defaultStyles, ...styles };
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle search API call
  const handleSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      const ingredients = await searchIngredient(searchQuery);
      setResults(ingredients || []);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching ingredients:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle ingredient selection with animation
  const handleIngredientSelect = (ingredient) => {
    // Add a small animation effect
    const selectedElement = resultsRef.current?.children[selectedIndex];
    if (selectedElement) {
      selectedElement.style.transform = 'scale(0.98)';
      setTimeout(() => {
        selectedElement.style.transform = '';
      }, 150);
    }

    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    onIngredientSelect?.(ingredient);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleIngredientSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <div className={`${componentStyles.container} ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className={componentStyles.searchIcon}>
          🔍
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={componentStyles.input}
        />
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className={componentStyles.loadingSpinner}>
            <div className={componentStyles.spinner}>⟳</div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className={`${componentStyles.dropdown} animate-fade-in`}
        >
          {results.length > 0 ? (
            results.map((ingredient, index) => (
              <div
                key={ingredient.id || index}
                onClick={() => handleIngredientSelect(ingredient)}
                className={`${componentStyles.resultItem} ${
                  index === selectedIndex 
                    ? componentStyles.resultItemSelected
                    : componentStyles.resultItemHover
                }`}
              >
                <div className={componentStyles.resultIcon}>
                  {getIngredientEmoji(ingredient.name)}
                </div>
                <div className="flex-1">
                  <span className={componentStyles.resultText}>
                    {ingredient.name}
                  </span>
                  {ingredient.category && (
                    <div className="text-xs text-stone-500 mt-1">
                      {ingredient.category}
                    </div>
                  )}
                </div>
                {index === selectedIndex && (
                  <div className="text-orange-500 text-sm">
                    ↵
                  </div>
                )}
              </div>
            ))
          ) : (
            !isLoading && query.trim() && (
              <div className={componentStyles.noResults}>
                <div className="text-2xl mb-2">🤔</div>
                <div className="font-medium text-stone-600">
                  No ingredients found for "{query}"
                </div>
                <div className="text-sm text-stone-500 mt-1">
                  Try a different search term
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;