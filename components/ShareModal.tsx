import React, { useState } from 'react';
import { CloseIcon, ClipboardDocumentIcon, WhatsappIcon, TwitterIcon, FacebookIcon, YouTubeIcon, TikTokIcon } from './IconComponents';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const shopUrl = 'https://sialkot.shop';
    const shareText = `Check out SialkotShop - The Global Hub of Craftsmanship: ${shopUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shopUrl).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed!');
        });
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
                className="bg-white rounded-lg shadow-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Share the Craftsmanship</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800" aria-label="Close modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-600 mb-4">Spread the word about the quality goods from Sialkot!</p>
                    
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700">Shop Link</label>
                        <div className="flex items-center mt-1">
                            <input
                                type="text"
                                value={shopUrl}
                                readOnly
                                className="w-full p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md focus:outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-r-md hover:bg-gray-300 transition-colors"
                            >
                                <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                                {copySuccess || 'Copy'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700 text-center">Share directly on:</p>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center bg-[#25D366] text-white py-3 px-4 rounded-md font-semibold hover:bg-[#128C7E] transition-colors duration-300"
                        >
                            <WhatsappIcon className="w-5 h-5 mr-3" />
                            Share on WhatsApp
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center bg-[#1DA1F2] text-white py-3 px-4 rounded-md font-semibold hover:bg-[#0c85d0] transition-colors duration-300"
                        >
                            <TwitterIcon className="w-5 h-5 mr-3" />
                            Share on Twitter
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopUrl)}&quote=${encodeURIComponent(shareText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center bg-[#1877F2] text-white py-3 px-4 rounded-md font-semibold hover:bg-[#0f5bbf] transition-colors duration-300"
                        >
                            <FacebookIcon className="w-5 h-5 mr-3" />
                            Share on Facebook
                        </a>
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                        <p>Copy the link above to share on other platforms like:</p>
                        <div className="flex justify-center items-center gap-4 mt-2">
                             <div className="flex items-center text-red-600"><YouTubeIcon className="w-5 h-5 mr-1"/> YouTube</div>
                             <div className="flex items-center text-black"><TikTokIcon className="w-5 h-5 mr-1"/> TikTok</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
