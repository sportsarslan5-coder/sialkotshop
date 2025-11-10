import React from 'react';
import type { CartItem } from '../types';
import { CloseIcon, TrashIcon, WhatsappIcon } from './IconComponents';

interface CartSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onPlaceOrder: () => void;
}

const CartSidePanel: React.FC<CartSidePanelProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onPlaceOrder }) => {
  const subtotal = cartItems.reduce((acc, item) => {
    const priceString = item.product.price?.replace(/[^0-9.]/g, '') || '0';
    const price = parseFloat(priceString);
    return acc + price * item.quantity;
  }, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      ></div>
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 id="cart-heading" className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Close cart">
              <CloseIcon />
            </button>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">Your cart is empty</h3>
              <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6">
                <ul className="space-y-6">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex items-start space-x-4">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                        {item.selectedSize && <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>}
                        {item.selectedColor && (
                           <div className="flex items-center text-sm text-gray-500">
                                Color: <span className="ml-1.5 w-4 h-4 rounded-full border" style={{ backgroundColor: item.selectedColor }}></span>
                           </div>
                        )}
                        <p className="font-bold text-gray-900 mt-1">{item.product.price}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-l-md" aria-label="Decrease quantity">-</button>
                            <span className="w-10 text-center text-gray-800">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-r-md" aria-label="Increase quantity">+</button>
                          </div>
                          <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-600" aria-label="Remove item">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-700">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={onPlaceOrder}
                  className="w-full flex items-center justify-center bg-emerald-600 text-white py-3 px-8 rounded-md font-semibold hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <WhatsappIcon className="w-5 h-5 mr-3" />
                  Place Order via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidePanel;