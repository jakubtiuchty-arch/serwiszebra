'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PaymentElement, 
  Elements,
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Załaduj Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Inner component z Payment Element
function CheckoutForm({ 
  repairId,
  deviceModel,
  totalAmount,
  onSuccess,
  onError 
}: { 
  repairId: string;
  deviceModel: string;
  totalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/panel/zgloszenie/${repairId}?payment=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Płatność nie powiodła się');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Aktualizuj status naprawy w bazie po udanej płatności
        console.log('✅ Payment succeeded, updating repair status...');
        try {
          const response = await fetch(`/api/repairs/${repairId}/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
          });

          if (!response.ok) {
            console.error('❌ Failed to update repair status after payment');
          } else {
            console.log('✅ Repair status updated successfully');
          }
        } catch (updateError) {
          console.error('❌ Error updating repair status:', updateError);
        }

        onSuccess();
      }
    } catch (err) {
      onError('Wystąpił błąd podczas przetwarzania płatności');
    } finally {
      setIsProcessing(false);
    }
  };

  const shortId = repairId.split('-')[0].toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Repair info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Zgłoszenie:</span>
          <span className="font-bold text-gray-900">#{shortId}</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Urządzenie:</span>
          <span className="font-semibold text-gray-900">{deviceModel}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-gray-200">
          <span className="text-gray-600">Do zapłaty:</span>
          <span className="text-xl font-black text-gray-900">
            {totalAmount.toFixed(2)} zł
          </span>
        </div>
      </div>

      {/* Payment Element */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <PaymentElement />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Przetwarzanie płatności...
          </>
        ) : (
          <>
            Zapłać {totalAmount.toFixed(2)} zł
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Płatność jest bezpieczna i szyfrowana przez Stripe
      </p>
    </form>
  );
}

// Main modal component
export default function RepairPaymentModal({
  isOpen,
  onClose,
  repairId,
  deviceModel,
  totalAmount,
  onPaymentSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  repairId: string;
  deviceModel: string;
  totalAmount: number;
  onPaymentSuccess?: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Auto-zamknij modal po 3 sekundach od sukcesu
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (!isOpen || !repairId) return;

    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/repairs/${repairId}/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'Nie udało się zainicjować płatności');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [isOpen, repairId]);

const handleSuccess = () => {
  setSuccess(true);
  // NIE wywołuj onPaymentSuccess od razu - pozwól pokazać animację
  // onPaymentSuccess zostanie wywołany w handleClose po 3 sekundach
};

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

const handleClose = () => {
  if (success) {
    // Czekaj 3 sekundy, potem odśwież i zamknij
    setTimeout(() => {
      if (onPaymentSuccess) {
        onPaymentSuccess(); // Odśwież dane
      }
      router.refresh();
      onClose();
    }, 3000);
    return;
  }
  onClose();
};

  if (!isOpen) return null;

  const shortId = repairId.split('-')[0].toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!success ? handleClose : undefined}
      />

      {/* Modal - KOMPAKTOWY */}
      <div className="flex min-h-full items-center justify-center p-3">
        <div className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transition-transform duration-700 ${
          success ? 'animate-flip' : 'animate-fadeIn'
        }`}>

          {/* Close button */}
          {!success && !loading && (
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Loading state - KOMPAKTOWY */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
              <p className="text-sm text-gray-600">Przygotowywanie płatności...</p>
            </div>
          )}

          {/* Success state - KOMPAKTOWY */}
          {success && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Płatność zakończona!
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Naprawa <span className="font-bold text-gray-900">#{shortId}</span> została opłacona
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 w-full">
                <p className="text-xs text-green-800 text-center">
                  ✉️ Potwierdzenie wysłaliśmy na Twój email
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                Zamknij
              </button>
            </div>
          )}

          {/* Error state */}
          {error && !success && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Błąd płatności</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment form */}
          {!loading && clientSecret && !success && (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2563eb',
                    borderRadius: '12px',
                  },
                },
                locale: 'pl',
              }}
            >
              <CheckoutForm
                repairId={repairId}
                deviceModel={deviceModel}
                totalAmount={totalAmount}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Elements>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes successFlip {
          0% { 
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
          50% { 
            opacity: 0;
            transform: scale(0.8) rotateY(90deg);
          }
          100% { 
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-flip {
          animation: successFlip 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}