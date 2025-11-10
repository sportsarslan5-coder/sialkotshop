
import React from 'react';
import { TwitterIcon, InstagramIcon, FacebookIcon, LinkedInIcon } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">
              Sialkot<span className="text-emerald-500">Shop</span>
            </h3>
            <p className="text-gray-400 mt-1">The Global Hub of Craftsmanship</p>
          </div>
          <div className="flex space-x-6">
            <a href="https://twitter.com/search?q=Sialkot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-300">
              <TwitterIcon />
            </a>
            <a href="https://www.instagram.com/explore/tags/sialkot/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-300">
              <InstagramIcon />
            </a>
            <a href="https://www.facebook.com/search/top/?q=Sialkot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-300">
              <FacebookIcon />
            </a>
            <a href="https://www.linkedin.com/search/results/all/?keywords=Sialkot" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-300">
              <LinkedInIcon />
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SialkotShop. All rights reserved. A conceptual design.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
