import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsLoading(true);

    try {
      console.log('Starting checkout process...');
      console.log('Cart items:', cartItems);
      console.log('Selected language:', language);
      
      // Call Supabase Edge Function to create Stripe checkout session
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/create-checkout`;
      console.log('Calling URL:', url);
      console.log('Project ID:', projectId);
      console.log('Public Anon Key:', publicAnonKey ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.image,
          })),
          locale: language === 'el' ? 'el' : 'en', // Pass language preference to backend
        }),
      });

      console.log('Response received');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Checkout error:', data.error);
        alert(`Failed to create checkout session: ${data.error || 'Unknown error'}`);
        return;
      }

      if (data.url) {
        console.log('Redirecting to Stripe:', data.url);
        // Clear cart before redirect
        clearCart();
        // Redirect to Stripe checkout - use window.top for iframe compatibility
        try {
          window.top.location.href = data.url;
        } catch (e) {
          // Fallback if top access is blocked
          window.location.href = data.url;
        }
      } else {
        console.error('No URL in response');
        alert('Failed to get checkout URL. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(`An error occurred: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="pt-24 pb-16 px-5 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-[#6a6562] rounded-lg shadow-2xl p-12 text-center">
          <ShoppingBag size={64} className="text-white/50 mx-auto mb-6" />
          <h2 className="text-white mb-4">{t('cart.empty')}</h2>
          <p className="text-white/70 mb-6">
            Add some products to your cart to get started!
          </p>
          <Link to="/">
            <button className="bg-black hover:bg-[#444] text-white px-8 py-3 rounded-lg transition-colors">
              {t('cart.continueShopping')}
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-5 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#6a6562] rounded-lg shadow-2xl p-6 md:p-8">
          <h1 className="text-white mb-6">{t('cart.title')}</h1>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-[#56514f] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-white mb-2">{item.name}</h3>
                  <p className="text-white/80">
                    {item.price}€ each
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    {t('cart.size')}: {item.size}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="bg-[#444] hover:bg-[#555] text-white w-8 h-8 rounded flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-white min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="bg-[#444] hover:bg-[#555] text-white w-8 h-8 rounded flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-white min-w-[80px] text-center md:text-right">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/20 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white">{t('cart.total')}:</h2>
              <h2 className="text-white">{getCartTotal().toFixed(2)}€</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <button className="w-full bg-[#444] hover:bg-[#555] text-white px-6 py-4 rounded-lg transition-colors">
                  {t('cart.continueShopping')}
                </button>
              </Link>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="flex-1 bg-black hover:bg-[#333] text-white px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('cart.processing') : t('cart.continuePurchase')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}