'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  XCircle, 
  ArrowLeft,
  CreditCard,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';

function CancelPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  return (
    <>
      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Płatność anulowana
            </h1>
            <p className="text-gray-600 mb-6">
              Płatność została przerwana. Twoje zamówienie nie zostało jeszcze opłacone.
            </p>

            {/* Options */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => router.push('/sklep/koszyk')}
                className="w-full py-3.5 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Spróbuj ponownie
              </button>
              
              <button
                onClick={() => router.push('/sklep')}
                className="w-full py-3.5 px-6 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Wróć do sklepu
              </button>
            </div>

            {/* Info */}
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Potrzebujesz pomocy?
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <a 
                  href="tel:+48607778977" 
                  className="flex items-center gap-2 hover:text-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +48 607 778 977
                </a>
                <a 
                  href="mailto:sklep@takma.com.pl" 
                  className="flex items-center gap-2 hover:text-green-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  sklep@takma.com.pl
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default function ShopCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <CancelPageContent />
    </Suspense>
  );
}
