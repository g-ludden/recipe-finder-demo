import React, { useState, useEffect, useRef } from 'react';

// Default styles object - easily customizable
const defaultStyles = {
  container: "relative w-full",
  input: "w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  loadingSpinner: "absolute right-3 top-1/2 transform -translate-y-1/2",
  spinner: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500",
  dropdown: "absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto",
  resultItem: "px-4 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors",
  resultItemSelected: "bg-blue-50 text-blue-700",
  resultItemHover: "hover:bg-gray-50",
  resultText: "font-medium text-gray-900",
  noResults: "px-4 py-3 text-gray-500 text-center"
};

const IngredientSearch = ({ 
  onIngredientSelect, 
  placeholder = "Search for ingredients...",
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

  // Handle ingredient selection
  const handleIngredientSelect = (ingredient) => {
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

  return (
    <div className={`${componentStyles.container} ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
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
            <div className={componentStyles.spinner}></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className={componentStyles.dropdown}
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
                <span className={componentStyles.resultText}>
                  {ingredient.name}
                </span>
              </div>
            ))
          ) : (
            !isLoading && query.trim() && (
              <div className={componentStyles.noResults}>
                No ingredients found for "{query}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;