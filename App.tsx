
import React, { useState, useCallback, useRef, useMemo } from 'react';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartSidePanel from './components/CartSidePanel';
import DirectOrderModal from './components/DirectOrderModal';
import ShareModal from './components/ShareModal';
import AiContentGenerator from './components/AiContentGenerator';
import type { Category, Product, Review, CartItem } from './types';
import { getSialkotHeritageInfo, generateProductDescription, generateStoreSlogan } from './services/geminiService';
import { WhatsappIcon, EmailIcon, GlobeAltIcon, ShieldCheckIcon, TruckIcon, PlusIcon } from './components/IconComponents';

const categories: Category[] = [
  { name: 'Sports Goods', imageUrl: 'https://picsum.photos/seed/sports/600/400' },
  { name: 'Leather Products', imageUrl: 'https://picsum.photos/seed/leather/600/400' },
  { name: 'Surgical Instruments', imageUrl: 'https://picsum.photos/seed/surgical/600/400' },
  { name: 'Apparel', imageUrl: 'https://picsum.photos/seed/apparel/600/400' },
];

const initialProducts: Product[] = [
  { 
    id: 'prod-1', 
    name: 'Professional Soccer Ball', 
    category: 'Sports Goods', 
    description: 'FIFA quality standard, hand-stitched for superior durability and performance.', 
    imageUrl: 'https://picsum.photos/seed/soccer/500/350', 
    price: '$45.00',
    reviews: [
      { id: 'rev-1-1', author: 'Alex Johnson', rating: 5, comment: 'Incredible quality. The best ball I have ever used. Worth every penny!', date: '2023-10-22' },
      { id: 'rev-1-2', author: 'Maria Garcia', rating: 4, comment: 'Great feel and durability, though it took a day to break in properly.', date: '2023-10-20' },
    ]
  },
  { 
    id: 'prod-2', 
    name: 'Classic Leather Jacket', 
    category: 'Leather Products', 
    description: 'Made from 100% genuine Sialkot leather, offering timeless style and comfort.', 
    imageUrl: 'https://picsum.photos/seed/jacket/500/350', 
    price: '$149.99',
    reviews: [
      { id: 'rev-2-1', author: 'David Smith', rating: 5, comment: 'The craftsmanship is outstanding. Fits perfectly and looks amazing.', date: '2023-11-05' },
    ]
  },
  { 
    id: 'prod-3', 
    name: 'Precision Scalpel Set', 
    category: 'Surgical Instruments', 
    description: 'High-grade stainless steel for surgical precision. Autoclavable and rust-free.', 
    imageUrl: 'https://picsum.photos/seed/scalpel/500/350',
    price: '$79.50',
    reviews: [] 
  },
  { 
    id: 'prod-4', 
    name: '"Retro Tour \'89" Oversized Graphic Tee', 
    category: 'Apparel', 
    description: 'Feel the nostalgia with this perfectly faded, oversized graphic tee. Made from heavyweight cotton for a premium feel and a relaxed, lived-in look. A true concert classic reborn.', 
    imageUrl: 'https://picsum.photos/seed/band-tee/500/350', 
    price: '$45.00',
    reviews: [
      { id: 'rev-4-1', author: 'Jenna Ortega', rating: 5, comment: 'Literally live in this shirt. It has the perfect vintage vibe and is so comfy.', date: '2023-11-18' },
      { id: 'rev-4-2', author: 'Mark R.', rating: 5, comment: 'Great quality print and fabric. Feels like a real vintage find.', date: '2023-11-16' },
    ],
    customization: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#262626', '#F5F5F4'], // Washed Black, Cream
      allowQuantity: true,
    },
  },
  { 
    id: 'prod-5', 
    name: '"Malibu" Casual T-Shirt Dress', 
    category: 'Apparel', 
    description: 'Effortless style meets ultimate comfort. This soft-brushed t-shirt dress is your new go-to for beach days, brunch, or a casual night out. Dress it up or down with sneakers or sandals.', 
    imageUrl: 'https://picsum.photos/seed/tshirt-dress/500/350', 
    price: '$55.00',
    reviews: [
      { id: 'rev-5-1', author: 'Hailey B.', rating: 5, comment: 'So versatile and chic. The fabric is incredibly soft. I bought it in two colors!', date: '2023-11-20' },
    ],
    customization: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['#000000', '#6B7280', '#8FBC8F'], // Black, Heather Grey, Dark Sea Green
      allowQuantity: true,
    },
  },
  { 
    id: 'prod-6', 
    name: '"Venice" Cropped Baby Tee', 
    category: 'Apparel', 
    description: 'The perfect crop. This fitted baby tee is made from a soft, ribbed cotton blend with just the right amount of stretch. A Y2K staple for your modern wardrobe.', 
    imageUrl: 'https://picsum.photos/seed/baby-tee/500/350',
    price: '$28.00',
    reviews: [
      { id: 'rev-6-1', author: 'Olivia R.', rating: 5, comment: 'Obsessed! It fits so well and is super flattering. Great with high-waisted jeans.', date: '2023-11-19' }
    ],
    customization: {
        sizes: ['XXS', 'XS', 'S', 'M'],
        colors: ['#FFFFFF', '#F8C8DC', '#ADD8E6'], // White, Baby Pink, Light Blue
        allowQuantity: true,
    }
  },
  { 
    id: 'prod-7', 
    name: '"Beverly Hills" Embroidered Linen Tee', 
    category: 'Apparel', 
    description: 'Elevate your basics with this lightweight linen-blend tee. Features delicate floral embroidery for a touch of sophistication. Breathable, soft, and effortlessly chic.', 
    imageUrl: 'https://picsum.photos/seed/linen-tee/500/350', 
    price: '$48.50',
    reviews: [
      { id: 'rev-7-1', author: 'Sofia Richie', rating: 5, comment: 'The embroidery detail is beautiful. Looks so much more expensive than it is. Perfect for a quiet luxury look.', date: '2023-11-21' }
    ],
    customization: {
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#F5F5DC', '#E6E6FA'], // Beige, Lavender
      allowQuantity: true,
    },
  },
  { 
    id: 'prod-8', 
    name: '"Runyon Canyon" Performance Tee', 
    category: 'Apparel', 
    description: 'Engineered for your active lifestyle. This moisture-wicking performance tee is buttery-soft, breathable, and features a flattering athletic cut. From hiking trails to coffee runs.', 
    imageUrl: 'https://picsum.photos/seed/athletic-tee/500/350', 
    price: '$39.99',
    reviews: [
      { id: 'rev-8-1', author: 'Chris H.', rating: 5, comment: 'Favorite workout shirt. Dries super fast and doesn\'t cling. Highly recommend.', date: '2023-11-15' }
    ],
    customization: {
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#36454F', '#008080', '#800000'], // Charcoal, Teal, Maroon
      allowQuantity: true,
    },
  },
  { 
    id: 'prod-9', 
    name: '"The Bel-Air" Modern Fit Polo', 
    category: 'Apparel', 
    description: 'A timeless classic, redefined. Our polo is crafted from premium piqué cotton with a modern, tailored fit. The perfect blend of casual comfort and polished style for any occasion.', 
    imageUrl: 'https://picsum.photos/seed/polo-shirt/500/350', 
    price: '$65.00',
    reviews: [
        { id: 'rev-9-1', author: 'Jacob Elordi', rating: 5, comment: 'Excellent fit and quality material. The collar sits perfectly. A true staple.', date: '2023-11-17' }
    ],
    customization: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#000080', '#FFFFFF', '#F0E68C'], // Navy, White, Khaki
      allowQuantity: true,
    },
  }
];

const Checkmark = () => (
    <svg className="flex-shrink-0 h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);


const App: React.FC = () => {
    const [heritageInfo, setHeritageInfo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const addProductInputRef = useRef<HTMLInputElement>(null);
    
    // E-commerce state
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [subtitle, setSubtitle] = useState<string>('The Global Hub of Craftsmanship');
    const [isGeneratingSlogan, setIsGeneratingSlogan] = useState(false);
    const [isDirectOrderModalOpen, setIsDirectOrderModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
    const handleDiscoverClick = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      setHeritageInfo('');
      try {
        const info = await getSialkotHeritageInfo();
        setHeritageInfo(info);
      } catch (e) {
        setError('An unexpected error occurred. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const handleTitleClick = useCallback(async () => {
        if (isGeneratingSlogan) return;
        setIsGeneratingSlogan(true);
        const oldSubtitle = subtitle;
        try {
          setSubtitle('Generating...');
          const newSlogan = await generateStoreSlogan();
          setSubtitle(newSlogan);
        } catch (e) {
          console.error("Failed to generate slogan:", e);
          setSubtitle(oldSubtitle); // Revert on failure
        } finally {
          setIsGeneratingSlogan(false);
        }
      }, [isGeneratingSlogan, subtitle]);

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const handleAddReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = {
            ...review,
            id: `rev-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
        };

        const updatedProducts = products.map(p => {
            if (p.id === productId) {
                return { ...p, reviews: [newReview, ...p.reviews] };
            }
            return p;
        });
        setProducts(updatedProducts);
        
        const updatedSelectedProduct = updatedProducts.find(p => p.id === productId) || null;
        setSelectedProduct(updatedSelectedProduct);
    };
    
    const handleUpdateProduct = (productId: string, updatedFields: Partial<Omit<Product, 'id'>>) => {
        const updatedProducts = products.map(p => {
            if (p.id === productId) {
                return { ...p, ...updatedFields };
            }
            return p;
        });
        setProducts(updatedProducts);
    
        if (selectedProduct && selectedProduct.id === productId) {
            setSelectedProduct(prev => prev ? { ...prev, ...updatedFields } : null);
        }
    };

    const handleAddNewProduct = (imageUrl: string) => {
        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            name: 'New Product Title',
            category: 'Apparel',
            description: 'Enter a description for your new product.',
            imageUrl,
            price: '$0.00',
            reviews: [],
            customization: {
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['#FFFFFF', '#000000', '#FF0000', '#0000FF'],
                allowQuantity: true,
            },
        };
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        // Open the modal for the new product immediately for editing
        setSelectedProduct(newProduct);
    };

    const handleAddProductClick = () => {
        addProductInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                handleAddNewProduct(imageUrl);
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };
    
    const handleGenerateDescription = useCallback(async (productId: string, productName: string) => {
        try {
            const description = await generateProductDescription(productName);
            handleUpdateProduct(productId, { description });
        } catch (error) {
            console.error("Failed to generate description:", error);
            // Optionally set an error state to show in the UI
        }
    }, []);

    // Cart Handlers
    const handleAddToCart = (product: Product, options: { size?: string, color?: string, quantity: number } = { quantity: 1 }) => {
        const cartItemId = `${product.id}-${options.size || 'default'}-${options.color || 'default'}`;
        
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === cartItemId);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === cartItemId ? { ...item, quantity: item.quantity + options.quantity } : item
                );
            } else {
                return [...prevCart, {
                    id: cartItemId,
                    product,
                    quantity: options.quantity,
                    selectedSize: options.size,
                    selectedColor: options.color
                }];
            }
        });
        setIsCartOpen(true);
    };

    const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const handleRemoveFromCart = (cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    };

    const handlePlaceOrder = () => {
        setIsCartOpen(false);
        setIsDirectOrderModalOpen(true);
    };

    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);


  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        onShareClick={() => setIsShareModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        subtitle={subtitle}
        onTitleClick={handleTitleClick}
      />
      <CartSidePanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrder}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative h-[60vh] md:h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/workshop/1600/900)' }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">The Art of Craftsmanship</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">Shipping premium quality goods from the heart of Sialkot to your doorstep, worldwide.</p>
            <a href="#featured" className="mt-8 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Products
            </a>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Our Categories</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">From the sports field to the operating room, Sialkot's craftsmanship is world-renowned.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map(cat => <CategoryCard key={cat.name} category={cat} />)}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                    <p className="text-gray-600 max-w-2xl">A selection of our finest products, embodying the quality and skill of Sialkot's artisans.</p>
                </div>
                 <button
                    onClick={handleAddProductClick}
                    className="flex-shrink-0 flex items-center justify-center bg-emerald-600 text-white py-2.5 px-6 rounded-md font-semibold hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add New Product
                </button>
                <input
                    type="file"
                    ref={addProductInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            {/* Filter Controls */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-grow w-full sm:w-auto">
                    <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {filteredProducts.map(prod => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    onViewDetails={() => handleSelectProduct(prod)} 
                    onUpdateProduct={handleUpdateProduct}
                    onAddToCart={handleAddToCart}
                    onGenerateDescription={handleGenerateDescription}
                  />
              ))}
            </div>
          </div>
        </section>

        {/* Global Features Section */}
        <section id="global-features" className="py-16 lg:py-24 bg-gray-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <GlobeAltIcon className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Worldwide Shipping</h3>
                <p className="text-gray-400 max-w-xs">We ship our masterfully crafted products to the USA, Europe, and countries across the globe.</p>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheckIcon className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
                <p className="text-gray-400 max-w-xs">Your security is our priority. We ensure secure payment processing for all international orders.</p>
              </div>
              <div className="flex flex-col items-center">
                <TruckIcon className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Reliable Delivery</h3>
                <p className="text-gray-400 max-w-xs">Partnering with trusted carriers to ensure your order arrives safely and on time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Content Studio Section */}
        <section id="ai-studio" className="py-16 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AiContentGenerator />
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Custom Orders & Inquiries</h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                        As professional manufacturers and exporters, we offer fully customized solutions to meet your needs. We trade globally and are ready to bring your designs to life.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side: Features */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Customization Capabilities</h3>
                        <p className="text-gray-600 mb-6">
                            We specialize in American football uniforms and a wide range of other sportswear. Get your products with custom designs and colors, tailored precisely to your demand.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Checkmark />
                                <span className="ml-3 text-gray-700">Customized designs and logos</span>
                            </li>
                            <li className="flex items-start">
                                <Checkmark />
                                <span className="ml-3 text-gray-700">All sizes and colors available</span>
                            </li>
                            <li className="flex items-start">
                                <Checkmark />
                                <span className="ml-3 text-gray-700">Advanced printing options: Screen, 3D, Silicone, Heat Transfer, Sublimation, and Embroidery</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right side: Contact Card */}
                    <div className="bg-gray-800 rounded-lg p-8 text-white shadow-xl">
                        <h3 className="text-2xl font-bold text-emerald-400 mb-6">Get in Touch</h3>
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <WhatsappIcon className="w-8 h-8 text-emerald-400"/>
                                <div className="ml-4">
                                    <p className="font-semibold text-lg">WhatsApp</p>
                                    <a href="https://wa.me/923079490721" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">+92 03079490721</a>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <EmailIcon className="w-8 h-8 text-emerald-400"/>
                                <div className="ml-4">
                                    <p className="font-semibold text-lg">Email</p>
                                    <a href="mailto:arslanali110011@gmail.com" className="text-gray-300 hover:text-white transition-colors">arslanali110011@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Discover Sialkot Section */}
        <section id="discover" className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Sialkot's Heritage</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Sialkot is more than just a city; it's a legacy of industrial excellence and masterful artistry. Click the button below to learn more about its unique story, powered by Gemini.
            </p>
            <button
                onClick={handleDiscoverClick}
                disabled={isLoading}
                className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-full hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Discovering...' : 'Uncover the Legacy'}
            </button>

            {isLoading && <div className="mt-8 text-emerald-600">Loading heritage information...</div>}
            {error && <div className="mt-8 text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}
            {heritageInfo && (
              <div className="mt-8 max-w-3xl mx-auto text-left bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed">{heritageInfo}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {selectedProduct && (
        <ProductModal 
            product={selectedProduct}
            onClose={handleCloseModal}
            onSubmitReview={handleAddReview}
            onUpdateProduct={handleUpdateProduct}
            onAddToCart={handleAddToCart}
        />
      )}
      {isDirectOrderModalOpen && (
        <DirectOrderModal
            isOpen={isDirectOrderModalOpen}
            onClose={() => setIsDirectOrderModalOpen(false)}
            cartItems={cart}
        />
      )}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};

export default App;
