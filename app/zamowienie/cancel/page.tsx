'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function OrderCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
          <XCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Płatność anulowana
          </h1>
          <p className="text-gray-700 mb-6">
            Płatność została anulowana. Twoje zamówienie nadal oczekuje na opłacenie.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/sklep')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Wróć do sklepu
            </button>
            {orderId && (
              <button
                onClick={() => router.push('/koszyk')}
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Spróbuj ponownie
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}