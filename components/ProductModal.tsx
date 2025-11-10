import React, { useState, FormEvent, useRef } from 'react';
import type { Product, Review } from '../types';
import { CloseIcon, StarIcon, ShoppingCartIcon, SwatchIcon, ShareIcon } from './IconComponents';
import StarRating from './StarRating';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onSubmitReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
    onUpdateProduct: (productId: string, updatedFields: Partial<Omit<Product, 'id'>>) => void;
    onAddToCart: (product: Product, options: { size?: string, color?: string, quantity: number }) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSubmitReview, onUpdateProduct, onAddToCart }) => {
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(product.name);
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [editedPrice, setEditedPrice] = useState(product.price || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for customization
    const [selectedSize, setSelectedSize] = useState<string | undefined>(product.customization?.sizes?.[0]);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(product.customization?.colors?.[0]);
    const [quantity, setQuantity] = useState(1);
    
    const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0;

    const handleReviewSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (author && rating > 0 && comment) {
            onSubmitReview(product.id, { author, rating, comment });
            setAuthor('');
            setRating(0);
            setComment('');
        }
    };
    
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

    const handleAddToCartClick = () => {
        onAddToCart(product, {
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
        });
        onClose();
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

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-full md:w-1/2 h-64 md:h-auto relative group cursor-pointer" onClick={handleImageClick}>
                     <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"/>
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
                        <span className="text-white font-semibold text-lg">Change Image</span>
                    </div>
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">{product.category}</span>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onBlur={handleNameSubmit}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit(); }}
                                    className="text-2xl font-bold text-gray-900 mt-1 bg-transparent border-b-2 border-emerald-500 focus:outline-none w-full"
                                    autoFocus
                                />
                            ) : (
                                <h2 
                                    id="product-modal-title"
                                    className="text-2xl font-bold text-gray-900 mt-1 cursor-pointer hover:text-emerald-700 transition-colors"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    {product.name}
                                </h2>
                            )}
                            <div className="flex items-center mt-2">
                                <StarRating rating={averageRating} />
                                <span className="text-sm text-gray-500 ml-2">
                                    {averageRating.toFixed(1)} ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-400 hover:text-emerald-600 rounded-full"
                                title="Share this product"
                                aria-label="Share this product"
                            >
                                <ShareIcon />
                            </button>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800" aria-label="Close modal">
                                <CloseIcon />
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-4">{product.description}</p>
                    
                    {/* Customization Section */}
                    {product.customization && (
                        <div className="mt-6 border-t pt-4">
                            <div className="flex items-center mb-4">
                                <SwatchIcon className="w-6 h-6 mr-2 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Customize Your Order</h3>
                            </div>
                            
                            {product.customization.sizes && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Size</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.customization.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                                                    selectedSize === size
                                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {product.customization.colors && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Color</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {product.customization.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${
                                                    selectedColor === color ? 'border-emerald-600 ring-2 ring-offset-1 ring-emerald-500' : 'border-gray-200'
                                                }`}
                                                style={{ backgroundColor: color }}
                                                aria-label={`Select color ${color}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.customization.allowQuantity && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Quantity</h4>
                                    <div className="flex items-center border border-gray-300 rounded-md w-fit">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-3 py-1.5 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-l-md"
                                            aria-label="Decrease quantity"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                            className="w-12 text-center border-l border-r text-gray-800 focus:outline-none"
                                            aria-label="Product quantity"
                                        />
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="px-3 py-1.5 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-r-md"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    {/* CTA Section */}
                    <div className="mt-6 border-t pt-4">
                        <div className="flex items-baseline gap-x-2 mb-4">
                            {isEditingPrice ? (
                                <input
                                    type="text"
                                    value={editedPrice}
                                    onChange={(e) => setEditedPrice(e.target.value)}
                                    onBlur={handlePriceSubmit}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handlePriceSubmit(); }}
                                    className="text-3xl font-bold tracking-tight text-gray-900 bg-transparent border-b-2 border-emerald-500 focus:outline-none w-full"
                                    autoFocus
                                />
                            ) : (
                                <span 
                                    className="text-3xl font-bold tracking-tight text-gray-900 cursor-pointer hover:text-emerald-700 transition-colors"
                                    onClick={() => {
                                        setEditedPrice(product.price || '');
                                        setIsEditingPrice(true);
                                    }}
                                >
                                    {product.price || '$0.00'}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleAddToCartClick}
                            className="w-full flex items-center justify-center bg-emerald-600 text-white py-3 px-8 rounded-md font-semibold hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            <ShoppingCartIcon className="w-5 h-5 mr-3" />
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-6 border-t pt-4 space-y-4 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
                        {product.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {product.reviews.map(review => (
                                    <div key={review.id} className="border-b pb-3">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{review.author}</p>
                                            <StarRating rating={review.rating} starClassName="w-4 h-4"/>
                                        </div>
                                        <p className="text-gray-600 text-sm italic mt-1">"{review.comment}"</p>
                                        <p className="text-xs text-gray-400 text-right mt-1">{review.date}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                        )}
                    </div>
                    
                    <form onSubmit={handleReviewSubmit} className="mt-6 border-t pt-4">
                         <h3 className="text-lg font-semibold text-gray-800 mb-2">Leave a Review</h3>
                         <div className="space-y-4">
                             <input type="text" placeholder="Your Name" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" required />
                             <div className="flex items-center space-x-1">
                                 <span className="text-sm font-medium text-gray-700 mr-2">Your Rating:</span>
                                 {[...Array(5)].map((_, index) => {
                                     const starValue = index + 1;
                                     return (
                                         <button type="button" key={starValue} onMouseEnter={() => setHoverRating(starValue)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(starValue)} aria-label={`Rate ${starValue} stars`}>
                                             <StarIcon className={`w-6 h-6 cursor-pointer transition-colors ${(hoverRating || rating) >= starValue ? 'text-yellow-400' : 'text-gray-300'}`} />
                                         </button>
                                     );
                                 })}
                             </div>
                             <textarea placeholder="Your Review" value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" required />
                             <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-emerald-600 transition-colors duration-300">Submit Review</button>
                         </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;