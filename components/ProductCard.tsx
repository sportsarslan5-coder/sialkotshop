import React, { useState, useRef } from 'react';
import type { Product } from '../types';
import StarRating from './StarRating';
import { SparklesIcon, ShareIcon } from './IconComponents';

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
  onUpdateProduct: (productId: string, updatedFields: Partial<Omit<Product, 'id'>>) => void;
  onAddToCart: (product: Product) => void;
  onGenerateDescription: (productId: string, productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onUpdateProduct, onAddToCart, onGenerateDescription }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(product.name);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState(product.price || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onUpdateProduct(product.id, { imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSubmit = () => {
    if (editedName.trim() && editedName !== product.name) {
      onUpdateProduct(product.id, { name: editedName });
    }
    setIsEditingName(false);
  };
  
  const handlePriceSubmit = () => {
    if (editedPrice !== product.price) {
        onUpdateProduct(product.id, { price: editedPrice });
    }
    setIsEditingPrice(false);
  };

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    await onGenerateDescription(product.id, product.name);
    setIsGenerating(false);
  };

  const handleShare = async () => {
    const shareUrl = `https://sialkot.shop/product/${product.id}`;
    const shareData = {
        title: product.name,
        text: `Check out this amazing product from SialkotShop: ${product.name}`,
        url: shareUrl,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
  };

  const isPlaceholderDescription = product.description === 'Enter a description for your new product.';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
      <div className="relative overflow-hidden cursor-pointer" onClick={handleImageClick}>
        <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
            <span className="text-white font-semibold text-lg">Change Image</span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">{product.category}</span>
            {product.customization && (
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    Customizable
                </span>
            )}
        </div>
        {isEditingName ? (
            <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit(); }}
                className="text-lg font-bold text-gray-900 mt-2 mb-2 bg-transparent border-b-2 border-emerald-500 focus:outline-none"
                autoFocus
            />
        ) : (
            <h3 
                className="text-lg font-bold text-gray-900 mt-2 mb-2 cursor-pointer hover:text-emerald-700 transition-colors"
                onClick={() => setIsEditingName(true)}
            >
                {product.name}
            </h3>
        )}
        
        <div className="flex items-center mb-2">
            {product.reviews.length > 0 ? (
                <>
                    <StarRating rating={averageRating} />
                    <span className="text-xs text-gray-500 ml-2">
                        ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                    </span>
                </>
            ) : (
                <span className="text-xs text-gray-500">No reviews yet</span>
            )}
        </div>
        
        <p className="text-gray-600 text-sm flex-grow mb-4">{product.description}</p>
        
        {isPlaceholderDescription && (
            <button
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="w-full flex items-center justify-center text-sm bg-blue-100 text-blue-700 py-2 px-3 rounded-md font-semibold hover:bg-blue-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-wait mb-3"
            >
                <SparklesIcon className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Description'}
            </button>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100">
             <div className="flex items-center justify-between mb-4">
                 {isEditingPrice ? (
                    <input
                        type="text"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        onBlur={handlePriceSubmit}
                        onKeyDown={(e) => { if (e.key === 'Enter') handlePriceSubmit(); }}
                        className="text-xl font-bold text-gray-800 bg-transparent border-b-2 border-emerald-500 focus:outline-none w-2/3"
                        autoFocus
                    />
                 ) : (
                    <p 
                        className="text-xl font-bold text-gray-800 cursor-pointer hover:text-emerald-700 transition-colors"
                        onClick={() => {
                            setEditedPrice(product.price || '');
                            setIsEditingPrice(true);
                        }}
                    >
                        {product.price || '$0.00'}
                    </p>
                 )}
                 <div className="flex items-center space-x-2">
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-400 hover:text-emerald-600 rounded-full transition-colors"
                        title="Share this product"
                    >
                        <ShareIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={onViewDetails}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
                        View Details
                    </button>
                 </div>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="w-full flex items-center justify-center bg-emerald-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;