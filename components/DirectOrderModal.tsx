import React, { useState } from 'react';
import type { CartItem } from '../types';
import { CloseIcon, LocationMarkerIcon, BanknotesIcon, TruckIcon, DevicePhoneMobileIcon, WhatsappIcon } from './IconComponents';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

type Step = 'location' | 'payment' | 'summary';

const DirectOrderModal: React.FC<DirectOrderModalProps> = ({ isOpen, onClose, cartItems }) => {
  const [step, setStep] = useState<Step>('location');
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Cash on Delivery');

  const subtotal = cartItems.reduce((acc, item) => {
    const priceString = item.product.price?.replace(/[^0-9.]/g, '') || '0';
    const price = parseFloat(priceString);
    return acc + price * item.quantity;
  }, 0).toFixed(2);

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
        setLocation(locationString);
        setIsLocating(false);
      },
      (error) => {
        setLocationError(`Error: ${error.message}. Please ensure location services are enabled.`);
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };
  
  const generateWhatsAppMessage = () => {
    let message = "Hello SialkotShop, I'd like to place an order.\n\n";
    message += "*Order Details:*\n";
    cartItems.forEach(item => {
        message += `- ${item.product.name} (Qty: ${item.quantity}`;
        if (item.selectedSize) message += `, Size: ${item.selectedSize}`;
        if (item.selectedColor) message += `, Color: ${item.selectedColor}`;
        message += `) - ${item.product.price}\n`;
    });
    message += `\n*Subtotal:* $${subtotal}\n`;
    message += `\n*Delivery Location:*\n${location}\n`;
    message += `\n*Payment Method:*\n${selectedPaymentMethod}\n`;
    message += "\nPlease confirm my order and provide the total with shipping. Thank you!";
    return encodeURIComponent(message);
  };
  
  const handleSendOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/923079490721?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'location':
        return (
          <div>
            <div className="text-center">
              <LocationMarkerIcon className="mx-auto w-16 h-16 text-emerald-500" />
              <h3 className="text-2xl font-semibold mt-4">Delivery Location</h3>
              <p className="text-gray-600 mt-2">Please share your location for shipping purposes.</p>
            </div>
            <div className="mt-8 space-y-4">
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center bg-emerald-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-emerald-700 transition-colors duration-300 disabled:bg-gray-400"
              >
                {isLocating ? 'Getting Location...' : 'Use My Current Location'}
              </button>
              {location && (
                 <div className="bg-green-50 text-green-800 p-4 rounded-md text-center">
                    <p className="font-semibold">Location captured:</p>
                    <p>{location}</p>
                 </div>
              )}
              {locationError && (
                 <div className="bg-red-50 text-red-800 p-4 rounded-md text-center">
                    <p>{locationError}</p>
                 </div>
              )}
            </div>
          </div>
        );
      case 'payment':
        const paymentMethods = [
            { name: 'Cash on Delivery', icon: TruckIcon, details: 'Pay with cash when your order is delivered.' },
            { name: 'Bank Transfer', icon: BanknotesIcon, details: 'Bank: MCB Bank\nAccount Title: SialkotShop\nIBAN: PK12 MCBL 1234 5678 9012 3456' },
            { name: 'Jazz Cash', icon: DevicePhoneMobileIcon, details: 'Account Title: Arslan Ali\nAccount Number: 03079490721' },
            { name: 'EasyPaisa', icon: DevicePhoneMobileIcon, details: 'Account Title: Arslan Ali\nAccount Number: 03079490721' },
        ];
        return (
            <div>
              <h3 className="text-2xl font-semibold text-center">Payment Method</h3>
              <p className="text-gray-600 mt-2 text-center">Select your preferred payment method. We will confirm your order and payment details via WhatsApp.</p>
              <div className="mt-6 space-y-4">
                <fieldset>
                    <legend className="sr-only">Payment method</legend>
                    <div className="space-y-2">
                        {paymentMethods.map(({ name, icon: Icon, details }) => (
                            <label key={name} className={`relative block border p-4 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === name ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                                <input type="radio" name="payment-method" value={name} checked={selectedPaymentMethod === name} onChange={() => setSelectedPaymentMethod(name)} className="sr-only" />
                                <div className="flex items-center text-lg font-semibold">
                                    <Icon className="w-6 h-6 mr-3 text-emerald-600" />
                                    {name}
                                </div>
                                <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{details}</p>
                            </label>
                        ))}
                    </div>
                </fieldset>
              </div>
            </div>
        );
      case 'summary':
        return (
            <div>
              <h3 className="text-2xl font-semibold text-center">Order Summary</h3>
              <p className="text-gray-600 mt-2 text-center">Please review your order before sending.</p>
              <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                      <h4 className="font-semibold text-gray-800">Items:</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                          {cartItems.map(item => (
                              <li key={item.id}>{item.product.name} x {item.quantity}</li>
                          ))}
                      </ul>
                  </div>
                  <p><span className="font-semibold">Subtotal:</span> ${subtotal}</p>
                  <p><span className="font-semibold">Location:</span> {location}</p>
                  <p><span className="font-semibold">Payment Via:</span> {selectedPaymentMethod}</p>
              </div>
               <p className="text-xs text-gray-500 mt-4 text-center">Clicking below will open WhatsApp with a pre-filled message to finalize your order.</p>
            </div>
        );
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (step === 'location') setStep('payment');
    if (step === 'payment') setStep('summary');
  };

  const prevStep = () => {
    if (step === 'summary') setStep('payment');
    if (step === 'payment') setStep('location');
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Place Direct Order</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800" aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {/* Stepper */}
          <div className="flex justify-center items-center mb-6">
              <span className={`px-3 py-1 rounded-full text-sm ${step === 'location' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>1. Location</span>
              <div className="flex-grow h-0.5 bg-gray-200 mx-2"></div>
              <span className={`px-3 py-1 rounded-full text-sm ${step === 'payment' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>2. Payment</span>
              <div className="flex-grow h-0.5 bg-gray-200 mx-2"></div>
              <span className={`px-3 py-1 rounded-full text-sm ${step === 'summary' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>3. Summary</span>
          </div>
          {renderStepContent()}
        </div>
        <div className="p-4 bg-gray-50 border-t mt-auto flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 'location'}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          {step === 'summary' ? (
             <button onClick={handleSendOrder} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors flex items-center">
                <WhatsappIcon className="w-5 h-5 mr-2"/>
                Send Order
             </button>
          ) : (
             <button
                onClick={nextStep}
                disabled={step === 'location' && !location}
                className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
                Next
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectOrderModal;