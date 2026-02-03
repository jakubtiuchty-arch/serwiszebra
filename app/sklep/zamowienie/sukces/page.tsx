'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  CheckCircle, 
  Loader2, 
  Package, 
  Truck,
  Mail,
  ArrowRight,
  Clock,
  Store,
  ShoppingBag
} from 'lucide-react';

interface OrderData {
  order_id: string;
  order_number: string;
  total_brutto: number;
  customer_email: string;
  items_count: number;
}

function ShopSuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Brak identyfikatora sesji');
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        // Używamy endpoint dla shop_orders
        const response = await fetch(`/api/shop/verify/${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setOrderData({
            order_id: data.order_id,
            order_number: data.order_number,
            total_brutto: data.total_brutto || 0,
            customer_email: data.customer_email || '',
            items_count: data.items_count || 1
          });
        } else {
          setError('Płatność nie została jeszcze potwierdzona. Odśwież stronę za chwilę.');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Wystąpił błąd podczas weryfikacji płatności');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Header currentPage="other" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Weryfikacja płatności...</p>
            <p className="text-sm text-gray-500 mt-2">To może potrwać kilka sekund</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header currentPage="other" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Weryfikacja w toku
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Odśwież stronę
              </button>
              <button
                onClick={() => router.push('/sklep')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Wróć do sklepu
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          
          {/* SUCCESS HERO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 mb-6 text-center">
            
            {/* Animated checkmark */}
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Płatność zakończona sukcesem!
            </h1>
            <p className="text-gray-600 mb-6">
              Dziękujemy za zakupy w naszym sklepie
            </p>

            {orderData && (
              <div className="bg-gray-50 rounded-xl p-5 max-w-sm mx-auto">
                <p className="text-sm text-gray-500 mb-1">Numer zamówienia</p>
                <p className="text-xl font-bold text-gray-900 font-mono mb-3">
                  {orderData.order_number}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Potwierdzenie wysłano na {orderData.customer_email}</span>
                </div>
                {orderData.total_brutto > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Kwota zapłacona</p>
                    <p className="text-lg font-bold text-green-600">
                      {orderData.total_brutto.toFixed(2).replace('.', ',')} zł
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TIMELINE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Co dalej?
            </h2>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900">Płatność potwierdzona</h3>
                  <p className="text-sm text-gray-500">Potwierdzenie wysłaliśmy na email</p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex justify-center w-10">
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900">Kompletowanie zamówienia</h3>
                  <p className="text-sm text-gray-500">1-2 dni robocze</p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex justify-center w-10">
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900">Wysyłka kurierem</h3>
                  <p className="text-sm text-gray-500">Otrzymasz numer śledzenia przesyłki</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/sklep')}
              className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800"
            >
              <ShoppingBag className="w-5 h-5" />
              Kontynuuj zakupy
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Strona główna
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* HELP */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Masz pytania? Napisz do nas:{' '}
              <a href="mailto:sklep@takma.com.pl" className="text-green-600 hover:underline font-medium">
                sklep@takma.com.pl
              </a>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default function ShopSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <ShopSuccessPageContent />
    </Suspense>
  );
}
