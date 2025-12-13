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
import { X, Loader2, CheckCircle, AlertCircle, CreditCard, FileText, Building2, Copy, Check } from 'lucide-react';

type PaymentMethod = 'card' | 'proforma';

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
      console.log('❌ Stripe or elements not ready');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔄 Starting payment confirmation for repair:', repairId);
      
      // Najpierw sprawdź submit elementów
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error('❌ Elements submit error:', submitError);
        onError(submitError.message || 'Błąd formularza płatności');
        setIsProcessing(false);
        return;
      }

      console.log('✅ Elements submitted, confirming payment...');
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/panel/naprawa/${repairId}?payment=success`,
        },
        redirect: 'if_required',
      });

      console.log('📦 Payment result:', { 
        error: error ? { type: error.type, message: error.message } : null, 
        paymentIntent: paymentIntent ? { id: paymentIntent.id, status: paymentIntent.status } : null 
      });

      if (error) {
        console.error('❌ Stripe error:', error.type, error.message);
        
        // Jeśli to błąd "requires_action", znaczy że redirect powinien nastąpić
        if (error.type === 'card_error' || error.type === 'validation_error') {
          onError(error.message || 'Płatność nie powiodła się');
        } else {
          onError(error.message || 'Płatność nie powiodła się');
        }
      } else if (paymentIntent) {
        console.log('✅ PaymentIntent received, status:', paymentIntent.status);
        
        // Obsłuż różne statusy płatności
        if (paymentIntent.status === 'succeeded') {
          console.log('🎉 Payment succeeded! Updating repair status...');
          await confirmPaymentInBackend(paymentIntent.id);
          onSuccess();
        } else if (paymentIntent.status === 'processing') {
          console.log('⏳ Payment processing, treating as success...');
          await confirmPaymentInBackend(paymentIntent.id);
          onSuccess();
        } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
          console.log('⏳ Payment requires additional action, waiting...');
          // Stripe powinien automatycznie obsłużyć 3D Secure
        } else if (paymentIntent.status === 'requires_payment_method') {
          console.log('❌ Payment failed, requires new payment method');
          onError('Płatność nie powiodła się. Spróbuj innej metody płatności.');
        } else {
          console.log('⚠️ Unexpected payment status:', paymentIntent.status);
          onError(`Status płatności: ${paymentIntent.status}`);
        }
      } else {
        // Brak błędu i brak paymentIntent - redirect nastąpił
        console.log('🔄 No error, no paymentIntent - redirect happened');
        // Strona się przeładuje po powrocie z redirecta
      }
    } catch (err: any) {
      console.error('❌ Unexpected error:', err);
      onError(err.message || 'Wystąpił błąd podczas przetwarzania płatności');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPaymentInBackend = async (paymentIntentId: string) => {
    try {
      const response = await fetch(`/api/repairs/${repairId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      });

      const result = await response.json();
      console.log('📦 Backend confirm response:', result);

      if (!response.ok) {
        console.error('❌ Backend confirm failed:', result);
      } else {
        console.log('✅ Backend confirm success');
      }
    } catch (err) {
      console.error('❌ Backend confirm error:', err);
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
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            paymentMethodOrder: ['blik', 'p24', 'card', 'klarna'],
            wallets: {
              applePay: 'never',
              googlePay: 'never',
            },
          }}
        />
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [proformaLoading, setProformaLoading] = useState(false);
  const [proformaSuccess, setProformaSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  // Dane do przelewu
  const bankDetails = {
    accountName: 'TAKMA TADEUSZ TIUCHTY',
    accountNumber: 'PL 12 1234 5678 9012 3456 7890 1234', // TODO: Uzupełnić właściwy numer
    bankName: 'mBank',
    title: `Naprawa #${repairId.split('-')[0].toUpperCase()}`,
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  // Auto-zamknij modal po 3 sekundach od sukcesu
  useEffect(() => {
    if (success || proformaSuccess) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, proformaSuccess]);

  // Reset stanu przy otwarciu modalu
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setProformaSuccess(false);
      setError(null);
      setPaymentMethod('card');
    }
  }, [isOpen]);

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
  // Odśwież dane natychmiast po płatności
  if (onPaymentSuccess) {
    onPaymentSuccess();
  }
};

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleProforma = async () => {
    setProformaLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/repairs/${repairId}/proforma`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd generowania pro formy');
      }

      setProformaSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Nie udało się wygenerować pro formy');
    } finally {
      setProformaLoading(false);
    }
  };

const handleClose = () => {
  if (success) {
    // Odśwież stronę i zamknij modal
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
    router.refresh();
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

          {/* Success state - płatność kartą */}
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

          {/* Success state - Pro Forma */}
          {proformaSuccess && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Pro Forma wygenerowana!
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Faktura pro forma została wysłana na Twój email
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 w-full">
                <p className="text-xs text-blue-800 text-center mb-2 font-semibold">
                  Dane do przelewu:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Odbiorca:</span>
                    <span className="font-medium">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nr konta:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{bankDetails.accountNumber}</span>
                      <button 
                        onClick={() => copyToClipboard(bankDetails.accountNumber.replace(/\s/g, ''), 'account')}
                        className="p-1 hover:bg-blue-100 rounded"
                      >
                        {copied === 'account' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Kwota:</span>
                    <span className="font-bold text-blue-700">{totalAmount.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tytuł:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{bankDetails.title}</span>
                      <button 
                        onClick={() => copyToClipboard(bankDetails.title, 'title')}
                        className="p-1 hover:bg-blue-100 rounded"
                      >
                        {copied === 'title' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 w-full">
                <p className="text-xs text-amber-800 text-center">
                  💡 <strong>Tip:</strong> Wyślij potwierdzenie przelewu w czacie z serwisem - przyspieszy to rozpoczęcie naprawy!
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                Przejdź do czatu
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
          {!loading && !success && !proformaSuccess && (
            <>
              {/* Header z kwotą */}
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Opłać naprawę</h2>
                <p className="text-sm text-gray-600">
                  Zgłoszenie <span className="font-semibold">#{shortId}</span> • {deviceModel}
                </p>
                <p className="text-2xl font-black text-gray-900 mt-2">
                  {totalAmount.toFixed(2)} zł
                </p>
              </div>

              {/* Zakładki metody płatności */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Karta / BLIK / P24
                </button>
                <button
                  onClick={() => setPaymentMethod('proforma')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                    paymentMethod === 'proforma'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Pro Forma
                </button>
              </div>

              {/* Karta / Szybki przelew */}
              {paymentMethod === 'card' && clientSecret && (
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

              {/* Pro Forma */}
              {paymentMethod === 'proforma' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 text-sm">Płatność przelewem tradycyjnym</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Wygenerujemy fakturę pro forma i wyślemy na Twój email. 
                          Po zaksięgowaniu wpłaty rozpoczniemy naprawę.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-3 font-semibold">Dane do przelewu:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Odbiorca:</span>
                        <span className="font-medium">{bankDetails.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Nr konta:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">{bankDetails.accountNumber}</span>
                          <button 
                            onClick={() => copyToClipboard(bankDetails.accountNumber.replace(/\s/g, ''), 'account')}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {copied === 'account' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Kwota:</span>
                        <span className="font-bold text-gray-900">{totalAmount.toFixed(2)} zł</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tytuł:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{bankDetails.title}</span>
                          <button 
                            onClick={() => copyToClipboard(bankDetails.title, 'title')}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {copied === 'title' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 text-center">
                      💬 Po wykonaniu przelewu wyślij potwierdzenie w <strong>czacie z serwisem</strong> - przyspiesza to rozpoczęcie naprawy!
                    </p>
                  </div>

                  <button
                    onClick={handleProforma}
                    disabled={proformaLoading}
                    className="w-full py-3 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {proformaLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generowanie...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Wygeneruj Pro Formę
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Pro forma zostanie wysłana na Twój adres email
                  </p>
                </div>
              )}
            </>
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