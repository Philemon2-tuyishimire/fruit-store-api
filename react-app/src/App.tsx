import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingBag, SlidersHorizontal, ArrowRight, Sparkles, ShieldAlert, User, Trash2, Plus, Minus, X, LogOut } from 'lucide-react';
import { mockFruits, Fruit } from './data/mockFruits';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { useFruits } from './hooks/useFruitsQuery';

export interface CartItem extends Fruit {
  quantity: number;
}

export function App() {
  // Fetch fruits from backend using TanStack React Query (falls back to mock fruits if backend is offline)
  const { data: serverFruits } = useFruits();
  const fruits = serverFruits || mockFruits;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Track user name, email, and explicit role ('customer' | 'seller' | 'admin')
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: 'customer' | 'seller' | 'admin' } | null>(null);
  
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Tree Fruits', 'Tropical', 'Citrus', 'Berries'] as const;

  // Local state for mutations/fallback management
  const [localFruits, setLocalFruits] = useState<Fruit[]>([]);

  // Check localStorage on initial page load so authentication state persists safely
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as 'customer' | 'seller' | 'admin' | null;
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    if (token && role) {
      setCurrentUser({
        name: name || email?.split('@')[0] || 'User',
        email: email || '',
        role: role,
      });
    }
  }, []);

  // Handle successful login/registration
  const handleLoginSuccess = (user: { name: string; email: string; role: 'customer' | 'seller' | 'admin' }) => {
    setCurrentUser(user);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('role', user.role);
  };

  // Handle User Logout & Clear Local Storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setCurrentUser(null);
    setIsAdminOpen(false);
    alert('You have been logged out successfully.');
  };

  // CRUD Handlers for Admin Dashboard (Restricted to Sellers/Admins)
  const handleAddFruit = (newFruitData: Omit<Fruit, '_id' | 'createdAt'>) => {
    const newFruit: Fruit = {
      ...newFruitData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLocalFruits([newFruit, ...localFruits]);
  };

  const handleUpdateFruit = (updatedFruit: Fruit) => {
    setLocalFruits(localFruits.map((f) => (f._id === updatedFruit._id ? updatedFruit : f)));
  };

  const handleDeleteFruit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fruit from the catalog?')) {
      setLocalFruits(localFruits.filter((f) => f._id !== id));
    }
  };

  // Cart Management Handlers (Primary action for Buyers)
  const handleAddToCart = (fruit: Fruit) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === fruit._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === fruit._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...fruit, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPriceRWF = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Filter fruits based on search query across all items
  const combinedFruits = [...localFruits, ...fruits];
  const filteredFruits = useMemo(() => {
    return combinedFruits.filter((fruit) => {
      const matchesSearch =
        fruit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fruit.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [combinedFruits, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 flex flex-wrap items-center justify-between gap-4 py-3 sm:h-20 sm:flex-nowrap sm:py-0">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => { setActiveTab('Home'); setSearchQuery(''); }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 block leading-none">FRUIT<span className="text-emerald-600">STORE</span></span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Fresh bites delivered fast</span>
            </div>
          </div>

          {/* Central Search Bar (Desktop) */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search fruits across categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-14 py-3 bg-slate-100/80 border border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Action Navigation */}
          <div className="ml-auto flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('Home')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'Home' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              Shop
            </button>
            <button 
              onClick={() => setActiveTab('About')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'About' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              About
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            
            {/* Cart Trigger Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Dashboard Button: Only visible if logged in as a Seller or Admin */}
            {currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin') && (
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{currentUser.role === 'admin' ? 'Admin Portal' : 'Seller Dashboard'}</span>
              </button>
            )}

            {/* Account / Auth / Logout Section */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-800">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{currentUser.name} <span className="text-xs font-normal text-slate-500">({currentUser.role})</span></span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-emerald-200" />
                <span>Account</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Search Bar View */}
      <div className="md:hidden bg-white px-4 py-3 border-b border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fruits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Main Content Router */}
      {activeTab === 'Home' ? (
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-emerald-900 text-white overflow-hidden mb-12 p-8 sm:p-12 shadow-xl">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-emerald-700/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Organic & Farm Fresh</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                Fresh Fruit Marketplace, Delivered Fast.
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base mb-6 font-medium leading-relaxed">
                Explore all categories below with horizontal scrolling. Sourced directly from top growers for rapid delivery straight to your door.
              </p>
            </div>
          </div>

          {/* Categories Rendered with Horizontal Scrollbars */}
          <div id="catalog-section" className="space-y-12 mb-12">
            {categories.map((category) => {
              const categoryFruits = filteredFruits.filter((fruit) => fruit.category === category);

              if (categoryFruits.length === 0) return null;

              return (
                <section key={category} className="space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                      <span>{category}</span>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full ml-2">
                        {categoryFruits.length} items
                      </span>
                    </h2>
                    <span className="text-xs font-semibold text-slate-400">Scroll horizontally →</span>
                  </div>

                  <div className="flex gap-6 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent [-webkit-overflow-scrolling:touch]">
                    {categoryFruits.map((fruit) => (
                      <div
                        key={fruit._id}
                        className="min-w-[280px] max-w-[280px] bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group flex-shrink-0"
                      >
                        <div className="h-52 bg-slate-100 relative overflow-hidden">
                          <img
                            src={fruit.imageUrl}
                            alt={fruit.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60';
                            }}
                          />
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs tracking-wide">
                            {fruit.category}
                          </span>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <h4 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-emerald-700 transition-colors truncate">
                            {fruit.name}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-6 flex-grow">
                            {fruit.description}
                          </p>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Unit Price</span>
                              <span className="text-base font-black text-slate-900">
                                {fruit.price.toLocaleString()} RWF
                              </span>
                            </div>

                            <button 
                              onClick={() => handleAddToCart(fruit)}
                              className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </section>
              );
            })}
          </div>

       </main>
      ) : (
        <div className="flex-grow flex items-center justify-center p-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-black text-slate-900 mb-2">About FruitStore</h2>
            <p className="text-slate-500 text-sm mb-6">
              A dedicated premium fruit marketplace bringing the freshest farm-harvested organic fruits straight to your table with reliability and speed.
            </p>
            <button
              onClick={() => setActiveTab('Home')}
              className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all w-full cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Your Shopping Cart</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-white border rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h4>
                  <p className="text-slate-500 text-xs">Add fresh fruits from the catalog to get started!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-xl border" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                      <p className="text-emerald-700 font-black text-xs mt-0.5">{item.price.toLocaleString()} RWF</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, -1)}
                          className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, 1)}
                          className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Subtotal</span>
                  <span className="text-xl font-black text-slate-900">{totalPriceRWF.toLocaleString()} RWF</span>
                </div>
                <button 
                  onClick={() => {
                    alert(`Order placed successfully for ${totalPriceRWF.toLocaleString()} RWF! Thank you for shopping with FruitStore.`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      {isAdminOpen && currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin') && (
        <AdminDashboard
          fruits={combinedFruits}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-semibold text-slate-400">
          © 2026 FruitStore Marketplace. All rights reserved. Built with Vite, React & Tailwind CSS.
        </div>
      </footer>

    </div>
  );
}

export default App;