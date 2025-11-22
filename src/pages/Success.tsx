import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <main className="pt-24 pb-16 px-5 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-[#6a6562] rounded-lg shadow-2xl p-12 text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-white mb-4">Payment Successful!</h1>
        <p className="text-white/70 mb-2">
          Thank you for your purchase!
        </p>
        <p className="text-white/70 mb-8">
          You will receive a confirmation email shortly.
        </p>
        {sessionId && (
          <p className="text-white/50 text-sm mb-8">
            Order ID: {sessionId.slice(0, 20)}...
          </p>
        )}
        <Link to="/">
          <button className="bg-black hover:bg-[#444] text-white px-8 py-3 rounded-lg transition-colors">
            Continue Shopping
          </button>
        </Link>
      </div>
    </main>
  );
}
