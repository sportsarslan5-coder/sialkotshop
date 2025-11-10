
import React, { useState, useCallback } from 'react';
import { generateStoreSlogan, generateProductDescription, generateSocialMediaPost, generateCustomerServiceReply, generateAdCopy } from '../services/geminiService';
import { SparklesIcon, ClipboardDocumentIcon, TwitterIcon, FacebookIcon, LinkedInIcon } from './IconComponents';

type ContentType = 'slogan' | 'productDescription' | 'socialMediaPost' | 'customerServiceReply' | 'adCopy';

const contentTypes: { id: ContentType; label: string; placeholder: string }[] = [
    { id: 'slogan', label: 'Store Slogan', placeholder: 'Click generate for a new store slogan.' },
    { id: 'productDescription', label: 'Product Description', placeholder: 'Enter a product name, e.g., "Hand-Stitched Cricket Bat"' },
    { id: 'socialMediaPost', label: 'Social Media Post', placeholder: 'Enter a topic, e.g., "New leather jacket collection"' },
    { id: 'adCopy', label: 'Ad Copy', placeholder: 'Enter a product for an ad, e.g., "Premium Leather Wallet"' },
    { id: 'customerServiceReply', label: 'Customer Service Reply', placeholder: 'Enter a customer query, e.g., "Where is my order?"' },
];

const AiContentGenerator: React.FC = () => {
    const [activeType, setActiveType] = useState<ContentType>('slogan');
    const [inputValue, setInputValue] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGenerate = useCallback(async () => {
        if (isLoading) return;
        
        const currentType = contentTypes.find(ct => ct.id === activeType);
        if (currentType?.id !== 'slogan' && !inputValue.trim()) {
            setGeneratedContent('Please enter some text in the input field above.');
            return;
        }

        setIsLoading(true);
        setGeneratedContent('');
        setCopySuccess('');

        try {
            let result = '';
            switch (activeType) {
                case 'slogan':
                    result = await generateStoreSlogan();
                    break;
                case 'productDescription':
                    result = await generateProductDescription(inputValue);
                    break;
                case 'socialMediaPost':
                    result = await generateSocialMediaPost(inputValue);
                    break;
                case 'customerServiceReply':
                    result = await generateCustomerServiceReply(inputValue);
                    break;
                case 'adCopy':
                    result = await generateAdCopy(inputValue);
                    break;
            }
            setGeneratedContent(result);
        } catch (error) {
            console.error("Content generation failed:", error);
            setGeneratedContent('Sorry, an error occurred while generating content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [activeType, inputValue, isLoading]);

    const handleCopyToClipboard = () => {
        if (!generatedContent || isLoading) return;
        navigator.clipboard.writeText(generatedContent).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            setCopySuccess('Failed to copy!');
            console.error('Could not copy text: ', err);
        });
    };

    const currentPlaceholder = contentTypes.find(ct => ct.id === activeType)?.placeholder || '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://sialkot.shop';


    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
                <div className="text-center">
                    <SparklesIcon className="mx-auto w-12 h-12 text-emerald-500" />
                    <h2 className="text-3xl font-bold text-gray-900 mt-4">AI Content Studio</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                        Generate marketing copy for your business and share it with the world in one click.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex flex-wrap justify-center gap-x-6" aria-label="Tabs">
                            {contentTypes.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveType(tab.id);
                                        setInputValue('');
                                        setGeneratedContent('');
                                    }}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeType === tab.id
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Left side: Inputs */}
                        <div className="space-y-4">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={currentPlaceholder}
                                disabled={activeType === 'slogan' || isLoading}
                                className="w-full h-32 p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                                aria-label="Input for content generation"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center bg-emerald-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-wait"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                        
                        {/* Right side: Output */}
                        <div className="flex flex-col h-full">
                             <div className="relative min-h-[176px] bg-gray-100 rounded-md p-4 border border-gray-200 flex-grow">
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                    </div>
                                )}
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {generatedContent || 'Your generated content will appear here...'}
                                </p>
                                {generatedContent && !isLoading && (
                                    <div className="absolute top-2 right-2">
                                        <button onClick={handleCopyToClipboard} className="p-1.5 text-gray-500 hover:text-emerald-600 bg-gray-200 hover:bg-emerald-100 rounded-md transition-colors" aria-label="Copy to clipboard">
                                            <ClipboardDocumentIcon className="w-5 h-5" />
                                        </button>
                                        {copySuccess && <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded-md">{copySuccess}</span>}
                                    </div>
                                )}
                            </div>
                            {generatedContent && !isLoading && (
                                <div className="mt-4 flex items-center justify-center gap-x-4">
                                    <span className="text-sm font-medium text-gray-600">Share on:</span>
                                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(generatedContent)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DA1F2] transition-colors" aria-label="Share on Twitter">
                                        <TwitterIcon className="w-5 h-5" />
                                    </a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(generatedContent)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1877F2] transition-colors" aria-label="Share on Facebook">
                                        <FacebookIcon className="w-5 h-5" />
                                    </a>
                                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#0A66C2] transition-colors" aria-label="Share on LinkedIn">
                                        <LinkedInIcon className="w-5 h-5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiContentGenerator;
