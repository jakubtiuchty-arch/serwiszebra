'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { 
  CheckCircle, 
  Loader2, 
  Package, 
  Truck,
  Mail,
  ArrowRight,
  Download,
  Clock,
  Store
} from 'lucide-react';

interface OrderData {
  order_id: string;
  order_number: string;
  total_brutto: number;
  customer_email: string;
  items_count: number;
}

function OrderSuccessPageContent() {
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
        const response = await fetch(`/api/payments/verify/${sessionId}`);
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
          setError('Płatność nie została potwierdzona');
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
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <Header />
        <div className="pt-32 pb-16 px-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Weryfikacja płatności...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <Header />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-red-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Wystąpił błąd
              </h1>
              <p className="text-gray-700 mb-6">{error}</p>
              <button
                onClick={() => router.push('/sklep')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Wróć do sklepu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
        </div>
      </div>

      <Header />

      <div className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* SUCCESS HERO */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 mb-8 text-center">
            
            {/* Animated checkmark */}
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Płatność zakończona sukcesem!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Dziękujemy za zakupy w serwiszebra.pl
            </p>

            {orderData && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 max-w-md mx-auto mb-6">
                <p className="text-sm text-gray-600 mb-2">Numer zamówienia</p>
                <p className="text-2xl font-black text-gray-900 mb-4 font-mono">
                  {orderData.order_number}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Potwierdzenie wysłano na email</span>
                </div>
              </div>
            )}
          </div>

          {/* TIMELINE - CO DALEJ */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              Co się stanie dalej?
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Płatność potwierdzona
                  </h3>
                  <p className="text-sm text-gray-600">
                    Otrzymaliśmy płatność i potwierdzenie wysłaliśmy na email
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex justify-center">
                  <div className="w-0.5 h-8 bg-gray-200"></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Przygotowanie zamówienia
                  </h3>
                  <p className="text-sm text-gray-600">
                    Kompletujemy produkty i przygotowujemy paczkę (1-2 dni robocze)
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex justify-center">
                  <div className="w-0.5 h-8 bg-gray-200"></div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Wysyłka
                  </h3>
                  <p className="text-sm text-gray-600">
                    Przekazujemy paczkę kurierowi i wysyłamy Ci numer śledzenia
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex justify-center">
                  <div className="w-0.5 h-8 bg-gray-200"></div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Store className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Dostawa
                  </h3>
                  <p className="text-sm text-gray-600">
                    Paczka dotrze do Ciebie w ciągu 1-2 dni roboczych od wysyłki
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/sklep')}
              className="w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              <Store className="w-5 h-5" />
              Wróć do sklepu
            </button>

            {orderData && (
              <button
                onClick={() => router.push(`/konto/zamowienia`)}
                className="w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300"
              >
                Zobacz moje zamówienia
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* HELP */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Masz pytania? Skontaktuj się z nami:{' '}
              <a href="mailto:kontakt@serwiszebra.pl" className="text-blue-600 hover:text-blue-700 font-semibold">
                kontakt@serwiszebra.pl
              </a>
              {' '}lub{' '}
              <a href="tel:+48607778977" className="text-blue-600 hover:text-blue-700 font-semibold">
                +48 607 778 977
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <OrderSuccessPageContent />
    </Suspense>
  );
}