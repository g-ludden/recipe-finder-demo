import React, { useState, useEffect, useRef } from 'react';
import { components } from '../styles/foodStyles';

// Simplified styles for debugging - removing potential problematic CSS
const debugStyles = {
  container: "relative w-full",
  inputWrapper: "relative w-full",
  input: "w-full px-4 py-3 pl-12 pr-12 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 bg-white transition-colors duration-200 placeholder-stone-400 text-stone-700 outline-none",
  searchIcon: "absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-lg pointer-events-none z-10",
  loadingSpinner: "absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10",
  spinner: "text-orange-500 animate-spin text-lg",
  dropdown: "absolute z-50 w-full mt-2 bg-white border-2 border-orange-200 rounded-xl shadow-xl max-h-64 overflow-y-auto",
  resultItem: "px-4 py-3 cursor-pointer border-b border-orange-100 last:border-b-0 transition-colors duration-200 flex items-center space-x-3 hover:bg-orange-50",
  resultItemSelected: "bg-orange-100 text-orange-800",
  resultText: "font-medium text-stone-700",
  resultIcon: "w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold flex-shrink-0",
  noResults: "px-4 py-6 text-stone-500 text-center bg-orange-25 rounded-lg m-2",
};

const IngredientSearch = ({ 
  onIngredientSelect, 
  placeholder = "Search for ingredients... ",
  className = "",
  searchIngredient,
  styles = {}
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  console.log('🔥 IngredientSearch mounted');

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() && searchIngredient) {
        handleSearch(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchIngredient]);

  const handleSearch = async (searchQuery) => {
    console.log('Searching for:', searchQuery);
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

  // Simple input change handler
  const handleInputChange = (e) => {
    console.log('🔥 Input change detected:', e.target.value);
    setQuery(e.target.value);
  };

  const handleInputClick = (e) => {
    console.log('🔥 Input clicked');
  };

  const handleInputFocus = (e) => {
    console.log('🔥 Input focused');
  };

  const handleIngredientSelect = (ingredient) => {
    console.log('Ingredient selected:', ingredient);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    onIngredientSelect?.(ingredient);
  };

  return (
    <div className={`relative w-full ${className}`} ref={searchRef}>
      {/* STEP 1: Start with minimal styling */}
      <div className="relative">
        {/* Search Icon */}
        <div 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-lg"
          style={{ pointerEvents: 'none', zIndex: 2 }}
        >

        </div>
        
        {/* Input with minimal, safe styling */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          autoComplete="off"
          tabIndex={0}
          className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border-2 border-orange-200 bg-white text-stone-700 placeholder-stone-400"
          style={{
            // Override any problematic inherited styles
            pointerEvents: 'auto',
            userSelect: 'text',
            WebkitUserSelect: 'text',
            zIndex: 1,
            position: 'relative',
            outline: 'none',
            // Remove any backdrop filters that might cause issues
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none'
          }}
        />
        
        {/* Loading Spinner */}
        {isLoading && (
          <div 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
            style={{ pointerEvents: 'none', zIndex: 2 }}
          >
            <div className="animate-spin">⟳</div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-orange-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
        >
          {results.length > 0 ? (
            results.map((ingredient, index) => (
              <div
                key={ingredient.id || index}
                className={`px-4 py-3 cursor-pointer border-b border-orange-100 last:border-b-0 transition-colors duration-200 flex items-center space-x-3 hover:bg-orange-50 ${
                  index === selectedIndex ? 'bg-orange-100' : ''
                }`}
                onClick={() => handleIngredientSelect(ingredient)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold flex-shrink-0">
                  🥘
                </div>
                <span className="font-medium text-stone-700">
                  {ingredient.name}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-stone-500 text-center">
              No ingredients found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// const IngredientSearch = ({ 
//   onIngredientSelect, 
//   placeholder = "Search for ingredients... 🔍",
//   className = "",
//   searchIngredient,
//   styles = {}
// }) => {
//   const componentStyles = { ...debugStyles, ...styles };
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(-1);
  
//   const searchRef = useRef(null);
//   const inputRef = useRef(null);
//   const resultsRef = useRef(null);

//   // Debug logging to track input interactions
//   useEffect(() => {
//     console.log('IngredientSearch mounted');
//     console.log('searchIngredient prop:', typeof searchIngredient);
    
//     // Test if input is focusable
//     if (inputRef.current) {
//       console.log('Input element found:', inputRef.current);
//       console.log('Input computed styles:', window.getComputedStyle(inputRef.current));
//     }
//   }, []);

//   // Debounce search
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (query.trim() && searchIngredient) {
//         handleSearch(query);
//       } else {
//         setResults([]);
//         setIsOpen(false);
//       }
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [query, searchIngredient]);

//   const handleSearch = async (searchQuery) => {
//     console.log('Searching for:', searchQuery);
//     setIsLoading(true);
//     try {
//       const ingredients = await searchIngredient(searchQuery);
//       setResults(ingredients || []);
//       setIsOpen(true);
//       setSelectedIndex(-1);
//     } catch (error) {
//       console.error('Error searching ingredients:', error);
//       setResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Simplified input change handler with debugging
//   const handleInputChange = (e) => {
//     console.log('Input change detected:', e.target.value);
//     console.log('Event target:', e.target);
//     setQuery(e.target.value);
//   };

//   // Simplified keyboard handler that doesn't interfere with typing
//   const handleKeyDown = (e) => {
//     console.log('Key pressed:', e.key);
    
//     // Only handle navigation keys when dropdown is open
//     if (!isOpen || results.length === 0) {
//       console.log('Dropdown not open or no results, allowing normal key behavior');
//       return; // Allow normal typing
//     }

//     // Only prevent default for navigation keys
//     if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
//       e.preventDefault();
      
//       switch (e.key) {
//         case 'ArrowDown':
//           setSelectedIndex(prev => 
//             prev < results.length - 1 ? prev + 1 : 0
//           );
//           break;
//         case 'ArrowUp':
//           setSelectedIndex(prev => 
//             prev > 0 ? prev - 1 : results.length - 1
//           );
//           break;
//         case 'Enter':
//           if (selectedIndex >= 0 && results[selectedIndex]) {
//             handleIngredientSelect(results[selectedIndex]);
//           }
//           break;
//         case 'Escape':
//           setIsOpen(false);
//           setSelectedIndex(-1);
//           break;
//       }
//     }
//   };

//   const handleIngredientSelect = (ingredient) => {
//     console.log('Ingredient selected:', ingredient);
//     setQuery('');
//     setResults([]);
//     setIsOpen(false);
//     setSelectedIndex(-1);
//     onIngredientSelect?.(ingredient);
//   };

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSelectedIndex(-1);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Test focus functionality
//   const handleInputFocus = (e) => {
//     console.log('Input focused');
//   };

//   const handleInputBlur = (e) => {
//     console.log('Input blurred');
//   };

//   const handleInputClick = (e) => {
//     console.log('Input clicked');
//   };

//   useEffect(() => {
//     const input = inputRef.current;
//     if (!input) return;
    
//     console.log('🔥 Setting up direct DOM events for input:', input);
    
//     // Direct DOM event handlers (bypassing React)
//     const handleDirectInput = (e) => {
//       console.log('🔥 DIRECT DOM INPUT EVENT!', e.target.value);
//       setQuery(e.target.value);
//     };
    
//     const handleDirectClick = (e) => {
//       console.log('🔥 DIRECT DOM CLICK EVENT!', e);
//       e.stopPropagation();
//       input.focus();
//     };
    
//     const handleDirectFocus = (e) => {
//       console.log('🔥 DIRECT DOM FOCUS EVENT!');
//     };
    
//     const handleDirectKeydown = (e) => {
//       console.log('🔥 DIRECT DOM KEYDOWN EVENT!', e.key);
//       // Don't prevent default here, let typing work normally
//     };
    
//     // Use native DOM addEventListener (not React's system)
//     input.addEventListener('input', handleDirectInput, true);
//     input.addEventListener('click', handleDirectClick, true);
//     input.addEventListener('focus', handleDirectFocus, true);
//     input.addEventListener('keydown', handleDirectKeydown, true);
    
//     // Also add mousedown for immediate feedback
//     input.addEventListener('mousedown', (e) => {
//       console.log('🔥 DIRECT DOM MOUSEDOWN!');
//       e.stopPropagation();
//     }, true);
    
//     return () => {
//       input.removeEventListener('input', handleDirectInput, true);
//       input.removeEventListener('click', handleDirectClick, true);
//       input.removeEventListener('focus', handleDirectFocus, true);
//       input.removeEventListener('keydown', handleDirectKeydown, true);
//     };
//   }, []);
  
//   return (
//     <div className={`${componentStyles.container} ${className}`} ref={searchRef}>
//       <div className={componentStyles.inputWrapper}>
//         {/* Search Icon - with pointer-events-none to prevent blocking */}
//         <div className={componentStyles.searchIcon}>
//           🔍
//         </div>
        
//         {/* Input with debugging attributes */}
//         <input
//           ref={inputRef}
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           onFocus={handleInputFocus}
//           onBlur={handleInputBlur}
//           onClick={handleInputClick}
//           placeholder={placeholder}
//           className={componentStyles.input}
//           autoComplete="off"
//           tabIndex={0}
//           style={{
//             // Inline styles to override any conflicting CSS
//             pointerEvents: 'auto !important',
//             userSelect: 'text !important',
//             WebkitUserSelect: 'text !important',
//             zIndex: 999
//           }}
//         />
        
//         {/* Loading Spinner - with pointer-events-none */}
//         {isLoading && (
//           <div className={componentStyles.loadingSpinner}>
//             <div className={componentStyles.spinner}>⟳</div>
//           </div>
//         )}
//       </div>

//       {/* Search Results Dropdown */}
//       {isOpen && (
//         <div 
//           ref={resultsRef}
//           className={componentStyles.dropdown}
//         >
//           {results.length > 0 ? (
//             results.map((ingredient, index) => (
//               <div
//                 key={ingredient.id || index}
//                 className={`${componentStyles.resultItem} ${
//                   index === selectedIndex ? componentStyles.resultItemSelected : ''
//                 }`}
//                 onClick={() => handleIngredientSelect(ingredient)}
//                 onMouseEnter={() => setSelectedIndex(index)}
//               >
//                 <div className={componentStyles.resultIcon}>
//                   🥘
//                 </div>
//                 <span className={componentStyles.resultText}>
//                   {ingredient.name}
//                 </span>
//               </div>
//             ))
//           ) : (
//             <div className={componentStyles.noResults}>
//               No ingredients found. Try a different search term.
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

export default IngredientSearch;