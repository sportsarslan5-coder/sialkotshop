
import React, { useState } from 'react';
import { SearchIcon, MenuIcon, ShoppingCartIcon, UserIcon, ShareIcon } from './IconComponents';

interface HeaderProps {
    cartItemCount: number;
    onCartClick: () => void;
    onShareClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    subtitle: string;
    onTitleClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onShareClick, searchQuery, onSearchChange, subtitle, onTitleClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
             <div onClick={onTitleClick} className="cursor-pointer group" title="Click to generate a new slogan">
                <a href="#" className="text-2xl font-bold text-gray-900" onClick={(e) => e.preventDefault()}>
                  Sialkot<span className="text-emerald-600">Shop</span>
                </a>
                <p className="text-xs text-gray-500 tracking-tight group-hover:text-emerald-600 transition-colors h-4">
                    {subtitle}
                </p>
             </div>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center px-8 lg:px-16">
            <div className="relative w-full max-w-lg">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400"/>
                </div>
            </div>
          </div>
          <div className="hidden md:block">
            <nav className="flex items-center space-x-4">
              <a href="#home" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">Home</a>
              <a href="#categories" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">Categories</a>
              <a href="#featured" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">Featured</a>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onShareClick} className="p-2 text-gray-500 hover:text-emerald-600 rounded-full transition-colors duration-300" aria-label="Share this shop">
              <ShareIcon className="w-6 h-6" />
            </button>
            <button className="p-2 text-gray-500 hover:text-emerald-600 rounded-full transition-colors duration-300">
              <UserIcon className="w-6 h-6" />
            </button>
            <button 
                onClick={onCartClick}
                className="relative p-2 text-gray-500 hover:text-emerald-600 rounded-full transition-colors duration-300"
                aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                    {cartItemCount}
                </span>
              )}
            </button>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-500 hover:text-emerald-600 rounded-md transition-colors duration-300"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="px-3 py-2">
                 <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
            <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-emerald-600 transition-colors duration-300">Home</a>
            <a href="#categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-emerald-600 transition-colors duration-300">Categories</a>
            <a href="#featured" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-emerald-600 transition-colors duration-300">Featured</a>
            <a href="#discover" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-emerald-600 transition-colors duration-300">About</a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-emerald-600 transition-colors duration-300">Contact</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;