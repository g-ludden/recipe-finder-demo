import React from 'react';

const Layout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🍳</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Recipe Finder
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 w-full ${className}`}>
        {children}
      </main>

      {/* Optional Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-orange-100 mt-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
            © 2025 Recipe Finder Demo. All rights reserved.
            Designed and developed by George Ludden
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;