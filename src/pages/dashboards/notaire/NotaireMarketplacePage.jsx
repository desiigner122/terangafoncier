import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Star, ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireMarketplacePage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) loadMarketplaceData();
  }, [user]);

  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      // Load available products
      const productsResult = await NotaireSupabaseService.getMarketplaceProducts();
      if (productsResult.success) {
        setProducts(productsResult.data || []);
      }

      // Load user's purchases
      const purchasesResult = await NotaireSupabaseService.getUserPurchases(user.id);
      if (purchasesResult.success) {
        setUserPurchases(purchasesResult.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement Marketplace:', error);
      setProducts([]);
      setUserPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <ShoppingBag className="text-orange-600" size={32} />
              Marketplace
            </h1>
            <p className="text-slate-600 mt-1">Templates, plugins et services professionnels</p>
          </div>
          <button onClick={() => setShowCart(true)} className="relative bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <ShoppingCart size={20} />
            Panier
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{cart.length}</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
              <ShoppingBag size={48} className="text-white" />
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded">{product.category}</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2 mb-1">{product.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{product.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">({product.sales} ventes)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-800">{product.price.toLocaleString()} FCFA</span>
                <button onClick={() => addToCart(product)} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1">
                  <Plus size={16} />
                  Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Panier */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Votre Panier</h2>
              <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-12"><ShoppingCart size={64} className="text-slate-300 mx-auto mb-4" /><p className="text-slate-600">Votre panier est vide</p></div>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{item.name}</h3>
                        <p className="text-sm text-slate-600">{item.price.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Minus size={16} /></button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Plus size={16} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800"><X size={20} /></button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-slate-800">{total.toLocaleString()} FCFA</span>
                  </div>
                  <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">Procéder au paiement</button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NotaireMarketplacePage;
