import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard, BatchStatus } from './components/ProductCard';
import { QuoteModal } from './components/QuoteModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ChatAssistant } from './components/ChatAssistant';
import { AddProductModal } from './components/AddProductModal';
import { ComparisonModal } from './components/ComparisonModal';
import { Dashboard } from './components/Dashboard';
import { PRODUCTS_DB, calculateFinalPrice } from './constants';
import { Product, CartItem } from './types';
import { Search, Sparkles, Loader2, XCircle, Scale, Layers, Image as ImageIcon, X } from 'lucide-react';
import { searchProducts, generateProductImage } from './services/gemini';

function App() {
  // State with LocalStorage Persistence
  const [userProducts, setUserProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('obra_userProducts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load user products", e);
      return [];
    }
  });

  // Removed imageOverrides state as image updates are now handled directly on the product object.
  // const [imageOverrides, setImageOverrides] = useState<Record<string, string>>(() => {
  //   try {
  //     const saved = localStorage.getItem('obra_imageOverrides');
  //     return saved ? JSON.parse(saved) : {};
  //   } catch (e) {
  //     return {};
  //   }
  // });

  const [productOverrides, setProductOverrides] = useState<Record<string, Product>>(() => {
    try {
      const saved = localStorage.getItem('obra_productOverrides');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('obra_userProducts', JSON.stringify(userProducts));
  }, [userProducts]);

  // Removed useEffect for imageOverrides
  // useEffect(() => {
  //   localStorage.setItem('obra_imageOverrides', JSON.stringify(imageOverrides));
  // }, [imageOverrides]);

  useEffect(() => {
    localStorage.setItem('obra_productOverrides', JSON.stringify(productOverrides));
  }, [productOverrides]);

  // Standard State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // AI Search State
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiMatches, setAiMatches] = useState<string[] | null>(null);

  // Comparison State
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Batch Image Generation State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string>>(new Set());
  const [batchStatuses, setBatchStatuses] = useState<Record<string, BatchStatus>>({});
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Combine static DB with user-added products
  // Applies full product overrides and image overrides
  const allProducts = useMemo(() => {
    // Process DB Products: Apply product overrides
    const dbProducts = PRODUCTS_DB.map(p => {
      const overriddenProduct = productOverrides[p.id] || p;
      return {
        ...overriddenProduct,
        // Image is now part of the productOverrides, no separate imageOverrides map
        image: overriddenProduct.image 
      };
    });
    
    // User Products are state-managed, so they don't need 'overrides' map logic 
    // (they are updated directly in setUserProducts)
    return [...userProducts, ...dbProducts];
  }, [userProducts, productOverrides]); // Removed imageOverrides from dependency array

  // Derived Data
  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(allProducts.map(p => p.category)))],
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    // 1. If AI Search is active, filter by matching IDs
    if (aiMatches !== null) {
      return allProducts.filter(p => aiMatches.includes(p.id));
    }

    // 2. Standard Keyword Search
    const term = searchTerm.toLowerCase().trim();
    
    // If no search term, just filter by category
    if (!term) {
      return selectedCategory === 'All' 
        ? allProducts 
        : allProducts.filter(p => p.category === selectedCategory);
    }

    // Split search term into tokens for "fuzzy-like" keyword matching
    const searchTokens = term.split(/\s+/).filter(t => t.length > 0);

    return allProducts.filter(product => {
      // Filter by Category first
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Construct Searchable Text
      const searchableText = `
        ${product.name} 
        ${product.description} 
        ${product.category} 
        ${product.id}
        ${product.sku || ''}
      `.toLowerCase();

      // Check if ALL tokens are present in the product text
      return searchTokens.every(token => searchableText.includes(token));
    });
  }, [searchTerm, selectedCategory, allProducts, aiMatches]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // If user types, reset AI results to fall back to standard instant filtering
    if (aiMatches !== null) {
      setAiMatches(null);
    }
  };

  const handleAISearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsAISearching(true);
    setAiMatches(null); // Clear previous results

    try {
      const matches = await searchProducts(searchTerm, allProducts);
      setAiMatches(matches);
    } catch (error) {
      console.error("AI Search Failed", error);
    } finally {
      setIsAISearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setAiMatches(null);
    setSelectedCategory('All');
  };

  // Cart Actions
  const addToCart = (product: Product, quantity: number = 1, selectedVariants?: Record<string, string>, priceOverride?: number) => {
    setCart(prev => {
      // Use stringified variant object as part of the unique key
      const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : '';
      
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedVariants || {}) === (variantKey || '{}')
      );

      const basePrice = priceOverride !== undefined ? priceOverride : product.price;

      if (existingIndex > -1) {
        // Item exists with exact same variants, update quantity
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        // Update price just in case it changed (though unlikely for same variant key)
        newCart[existingIndex].finalPrice = calculateFinalPrice(basePrice);
        return newCart;
      }
      
      // New item combination
      return [...prev, { 
        ...product, 
        quantity: quantity, 
        finalPrice: calculateFinalPrice(basePrice),
        selectedVariants
      }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Comparison Actions
  const toggleComparison = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      // Limit comparison to 4 items max for UI sanity
      if (prev.length >= 4) {
        alert("You can compare up to 4 items at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  const handleProductClick = (product: Product) => {
    if (!isBatchMode) {
        setSelectedProduct(product);
    }
  };

  // Product Management (Add/Edit)
  const handleSaveProduct = (product: Product) => {
    const isUserProduct = userProducts.some(p => p.id === product.id);
    
    if (isUserProduct) {
        // Update user product
        setUserProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
        // Check if it's a DB product
        const isDbProduct = PRODUCTS_DB.some(p => p.id === product.id);
        
        if (isDbProduct) {
            // Update via overrides
            setProductOverrides(prev => ({ ...prev, [product.id]: product }));
        } else {
            // New Product
            setUserProducts(prev => [product, ...prev]);
        }
    }

    // Removed CRITICAL FIX: If we perform a full save, remove any "Quick Edit" image override
    // as imageOverrides state is removed. The image is now part of the product object itself.

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddProductModalOpen(true);
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setIsAddProductModalOpen(true);
  };

  // Centralized function to update product image in state
  const updateProductImageInState = (id: string, newUrl: string) => {
    // 1. Check User Products
    if (userProducts.some(p => p.id === id)) {
        setUserProducts(prev => prev.map(p => p.id === id ? { ...p, image: newUrl } : p));
        return;
    }
    // 2. Check Product Overrides (DB product that was edited)
    if (productOverrides[id]) {
        setProductOverrides(prev => ({
            ...prev,
            [id]: { ...prev[id], image: newUrl }
        }));
        return;
    }
    // 3. If it's a DB product not yet overridden, create an override for its image
    const dbProduct = PRODUCTS_DB.find(p => p.id === id);
    if (dbProduct) {
        setProductOverrides(prev => ({
            ...prev,
            [id]: { ...dbProduct, image: newUrl }
        }));
    }
  };

  // Removed handleUpdateProductImage as its functionality is now in updateProductImageInState

  // --- Batch Mode Handlers ---

  const toggleBatchMode = () => {
    setIsBatchMode(prev => !prev);
    setSelectedBatchIds(new Set()); // Clear selection when toggling
    setBatchStatuses({}); // Clear statuses
  };

  const handleToggleBatchSelect = (id: string) => {
    setSelectedBatchIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const handleSelectAllMissingImages = () => {
    const missingImageIds = allProducts
        .filter(p => p.image.includes('placehold.co'))
        .map(p => p.id);
    
    setSelectedBatchIds(new Set(missingImageIds));
  };

  const handleBatchGenerate = async () => {
    if (selectedBatchIds.size === 0) return;
    
    setIsBatchGenerating(true);
    
    // Initialize statuses to 'generating'
    const initialStatuses: Record<string, BatchStatus> = {};
    selectedBatchIds.forEach(id => {
        initialStatuses[id] = 'generating';
    });
    setBatchStatuses(initialStatuses);

    const promises = Array.from(selectedBatchIds).map(async (id: string) => {
        const product = allProducts.find(p => p.id === id);
        if (!product) return;

        try {
            const newUrl = await generateProductImage(product.name, product.description, product.category);
            if (newUrl) {
                updateProductImageInState(id, newUrl); // Use the new centralized function
                setBatchStatuses(prev => ({ ...prev, [id]: 'success' }));
            } else {
                setBatchStatuses(prev => ({ ...prev, [id]: 'error' }));
            }
        } catch (error) {
            console.error(`Error generating image for ${id}:`, error);
            setBatchStatuses(prev => ({ ...prev, [id]: 'error' }));
        }
    });

    await Promise.all(promises);
    setIsBatchGenerating(false);
    
    // Clear success statuses after a delay
    setTimeout(() => {
        setBatchStatuses(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(key => {
                if (next[key] === 'success') delete next[key];
            });
            return next;
        });
        setSelectedBatchIds(new Set()); // Clear selection after success
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onCartClick={() => setIsQuoteModalOpen(true)}
        onAddProductClick={handleAddProductClick}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden pb-32">
        
        {/* Hero / Header */}
        <div className="mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
            <p className="mt-2 text-slate-500">
              Browse our premium collection of office and home furniture.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
             {aiMatches !== null && (
               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Search Active
               </span>
             )}
             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                {filteredProducts.length} Items Found
             </span>
          </div>
        </div>

        {/* Dashboard Overview (Inventory Stats) */}
        {!isBatchMode && !searchTerm && selectedCategory === 'All' && (
            <Dashboard products={allProducts} />
        )}

        {/* Search Bar & Batch Toggle */}
        <div className="mb-8">
          <div className="flex gap-3 max-w-4xl mx-auto sm:mx-0">
            <div className="relative flex-grow group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                type="text"
                className="block w-full pl-11 pr-32 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm hover:shadow-md transition-all duration-200 text-base"
                placeholder="Ask AI: 'office tables under 15k with drawers'..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                />
                
                <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                {searchTerm && (
                    <button
                    onClick={clearSearch}
                    className="p-2 text-slate-300 hover:text-slate-500 transition-colors"
                    title="Clear Search"
                    >
                    <XCircle className="w-5 h-5" />
                    </button>
                )}
                
                <button
                    onClick={handleAISearch}
                    disabled={isAISearching || !searchTerm.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isAISearching 
                        ? 'bg-slate-100 text-slate-400 cursor-wait' 
                        : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-md active:scale-95'
                    }`}
                    title="Use AI to find products based on intent"
                >
                    {isAISearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                    <Sparkles className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">AI Search</span>
                </button>
                </div>
            </div>

            <button
                onClick={toggleBatchMode}
                className={`flex items-center justify-center p-4 rounded-2xl border transition-all duration-200 shadow-sm ${
                    isBatchMode 
                    ? 'bg-teal-50 border-teal-500 text-teal-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
                title="Batch Image Generation Mode"
            >
                <Layers className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex space-x-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={addToCart} 
                onClick={handleProductClick}
                onCompare={toggleComparison}
                onEdit={handleEditProduct}
                onUpdateImageInState={updateProductImageInState} {/* Pass the new centralized function */}
                isComparing={compareList.some(p => p.id === product.id)}
                // Batch Props
                isBatchMode={isBatchMode}
                isSelected={selectedBatchIds.has(product.id)}
                onToggleSelect={handleToggleBatchSelect}
                batchStatus={batchStatuses[product.id]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
               <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 text-lg font-medium">No products found.</p>
            <p className="text-slate-400 text-sm mt-1">Try searching for something else or adjusting filters.</p>
            <button 
              onClick={clearSearch}
              className="mt-6 text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all"
            >
              View All Products
            </button>
          </div>
        )}
      </main>

      {/* Batch Actions Toolbar */}
      {isBatchMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 animate-in slide-in-from-bottom-full duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800 whitespace-nowrap">
                        {selectedBatchIds.size} Selected
                    </span>
                    <button
                        onClick={handleSelectAllMissingImages}
                        className="text-sm text-teal-600 font-semibold hover:underline flex items-center gap-1"
                    >
                        <ImageIcon className="w-4 h-4" /> Select All Missing Images
                    </button>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={toggleBatchMode}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        disabled={isBatchGenerating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBatchGenerate}
                        disabled={selectedBatchIds.size === 0 || isBatchGenerating}
                        className="flex-1 sm:flex-none px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isBatchGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Images
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-12 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} OBRA Furniture. All rights reserved.</p>
          <p className="mt-1">Quality Furniture Solutions</p>
        </div>
      </footer>

      {/* Floating Compare Button */}
      {compareList.length > 0 && !isBatchMode && (
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 animate-in slide-in-from-bottom-10"
        >
          <Scale className="w-5 h-5" />
          <span className="font-bold">Compare ({compareList.length})</span>
        </button>
      )}

      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        cart={cart}
        updateQty={updateCartQty}
        remove={removeFromCart}
      />

      <ProductDetailsModal 
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />

      <AddProductModal 
        isOpen={isAddProductModalOpen}
        onClose={() => {
            setIsAddProductModalOpen(false);
            setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={compareList}
        onRemove={removeFromComparison}
        onAddToCart={addToCart}
      />

      <ChatAssistant products={allProducts} />
    </div>
  );
}

export default App;