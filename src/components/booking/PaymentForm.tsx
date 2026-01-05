import { CreditCard, Lock, Calendar, User } from 'lucide-react';
import { useState } from 'react';

interface PaymentFormProps {
  onPaymentComplete: () => void;
  isProcessing: boolean;
}

function PaymentForm({ onPaymentComplete, isProcessing }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
        <Lock className="w-5 h-5 text-green-400" />
        <span className="text-green-400 text-sm">
          Your payment information is secure and encrypted
        </span>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            className="w-full pl-12 pr-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono"
            placeholder="1234 5678 9012 3456"
            required
          />
          {/* Card Type Icons */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
            <div className="w-8 h-5 bg-dark-card rounded flex items-center justify-center text-[10px] font-bold text-text-muted">
              VISA
            </div>
            <div className="w-8 h-5 bg-dark-card rounded flex items-center justify-center text-[10px] font-bold text-text-muted">
              MC
            </div>
          </div>
        </div>
      </div>

      {/* Card Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Name on Card
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
            className="w-full pl-12 pr-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all uppercase"
            placeholder="JOHN DOE"
            required
          />
        </div>
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Expiry Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
              className="w-full pl-12 pr-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono"
              placeholder="MM/YY"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            CVV
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              className="w-full pl-12 pr-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono"
              placeholder="•••"
              required
            />
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
        <p className="text-warning text-sm">
          <strong>Demo Mode:</strong> This is a simulated payment. No real transaction will occur.
          Use any card details to proceed.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Complete Payment
          </>
        )}
      </button>
    </form>
  );
}

export default PaymentForm;
