// Food-Friendly Style System for Recipe Finder
// Import this file and use the style objects throughout your components

// Color Palette - Warm, appetizing colors
export const colors = {
    // Primary warm oranges and reds
    primary: {
      50: 'orange-50',
      100: 'orange-100',
      200: 'orange-200',
      300: 'orange-300',
      400: 'orange-400',
      500: 'orange-500',
      600: 'orange-600',
      700: 'orange-700',
      800: 'orange-800',
      900: 'orange-900',
    },
    // Secondary warm colors
    secondary: {
      50: 'amber-50',
      100: 'amber-100',
      200: 'amber-200',
      300: 'amber-300',
      400: 'amber-400',
      500: 'amber-500',
      600: 'amber-600',
      700: 'amber-700',
      800: 'amber-800',
      900: 'amber-900',
    },
    // Accent colors for variety
    accent: {
      red: 'red-500',
      green: 'green-500',
      yellow: 'yellow-500',
      brown: 'amber-800',
    },
    // Neutral colors with warmth
    neutral: {
      50: 'stone-50',
      100: 'stone-100',
      200: 'stone-200',
      300: 'stone-300',
      400: 'stone-400',
      500: 'stone-500',
      600: 'stone-600',
      700: 'stone-700',
      800: 'stone-800',
      900: 'stone-900',
    }
  };
  
  // Background Gradients
  export const backgrounds = {
    primary: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
    secondary: 'bg-gradient-to-r from-orange-100 to-amber-100',
    card: 'bg-white/80 backdrop-blur-sm',
    cardHover: 'bg-white/90 backdrop-blur-sm',
    warm: 'bg-gradient-to-br from-orange-100 via-yellow-50 to-red-50',
    subtle: 'bg-gradient-to-r from-orange-25 to-amber-25',
  };
  
  // Component Styles - Ready to use class combinations
  export const components = {
    // Buttons
    button: {
      primary: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5',
      secondary: 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5',
      outline: 'border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
      ghost: 'text-orange-600 hover:bg-orange-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
      danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
    },
  
    // Cards
    card: {
      base: 'bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-orange-100',
      elevated: 'bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-orange-200 transform hover:-translate-y-1',
      recipe: 'bg-white/85 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200 overflow-hidden transform hover:-translate-y-2',
      ingredient: 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200',
    },
  
    // Input Fields
    input: {
      base: 'w-full px-4 py-3 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder-stone-400',
      search: 'w-full px-5 py-3 pl-12 rounded-full border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 bg-white/90 backdrop-blur-sm transition-all duration-200 placeholder-stone-400 shadow-sm',
    },
  
    // Tags/Pills
    tag: {
      ingredient: 'inline-flex items-center bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold border border-orange-200 shadow-sm',
      category: 'inline-flex items-center bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium border border-amber-200',
      cuisine: 'inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium border border-red-200',
    },
  
    // Typography
    heading: {
      h1: 'text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent',
      h2: 'text-3xl font-bold text-stone-800',
      h3: 'text-2xl font-semibold text-stone-700',
      h4: 'text-xl font-semibold text-stone-700',
      subtitle: 'text-lg text-stone-600',
    },
  
    // Special Effects
    effects: {
      glow: 'shadow-lg shadow-orange-200/50',
      warmGlow: 'shadow-xl shadow-amber-200/60',
      softShadow: 'shadow-md shadow-stone-200/50',
      borderGlow: 'border-2 border-orange-300 shadow-lg shadow-orange-200/40',
    },
  
    // Status States
    status: {
      success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
      warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
      error: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200',
      info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
    },
  
    // Loading States
    loading: {
      shimmer: 'animate-pulse bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 bg-size-200 bg-pos-0',
      spin: 'animate-spin text-orange-500',
    },
  };
  
  // Layout Helpers
  export const layout = {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    containerSmall: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    containerLarge: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-8 sm:py-12 lg:py-16',
    sectionSmall: 'py-6 sm:py-8 lg:py-10',
    grid: {
      auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      recipes: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      ingredients: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4',
    },
  };
  
  // Animation Presets
  export const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scaleIn: 'animate-scale-in',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    wiggle: 'animate-wiggle',
  };
  
  // Usage Examples:
  /*
  import { components, backgrounds, layout } from './foodStyles';
  
  // Using in a component:
  <div className={`${backgrounds.primary} ${layout.container}`}>
    <h1 className={components.heading.h1}>Welcome to Recipe Finder</h1>
    <button className={components.button.primary}>
      Find Recipes
    </button>
    <div className={components.card.recipe}>
      <span className={components.tag.ingredient}>Tomato</span>
    </div>
  </div>
  */
  
  // Custom CSS you can add to your global CSS file for enhanced animations:
  export const customCSS = `
  /* Add these to your global CSS file for enhanced food-friendly styling */
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes wiggle {
    0%, 7% { transform: rotateZ(0); }
    15% { transform: rotateZ(-15deg); }
    20% { transform: rotateZ(10deg); }
    25% { transform: rotateZ(-10deg); }
    30% { transform: rotateZ(6deg); }
    35% { transform: rotateZ(-4deg); }
    40%, 100% { transform: rotateZ(0); }
  }
  
  .animate-fade-in { animation: fade-in 0.5s ease-out; }
  .animate-slide-up { animation: slide-up 0.6s ease-out; }
  .animate-scale-in { animation: scale-in 0.4s ease-out; }
  .animate-wiggle { animation: wiggle 0.6s ease-in-out; }
  
  .bg-size-200 { background-size: 200% 200%; }
  .bg-pos-0 { background-position: 0% 0%; }
  
  /* Warm gradient hover effects */
  .warm-hover:hover {
    background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  /* Food-themed shadows */
  .food-shadow {
    box-shadow: 0 10px 25px rgba(251, 146, 60, 0.15);
  }
  
  .food-shadow-lg {
    box-shadow: 0 20px 40px rgba(251, 146, 60, 0.2);
  }
  `;