import { Receipt, Users, DollarSign, Percent } from 'lucide-react';
import type { PriceBreakdown as PriceBreakdownType } from '../../types/booking';

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
  tripName?: string;
}

function PriceBreakdown({ breakdown, tripName }: PriceBreakdownProps) {
  return (
    <div className="bg-dark-elevated border border-dark-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-border">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Receipt className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Price Breakdown</h3>
          {tripName && (
            <p className="text-sm text-text-muted line-clamp-1">{tripName}</p>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3">
        {/* Base Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-text-muted" />
            <span className="text-text-secondary">Base Price</span>
          </div>
          <span className="text-text-primary">${breakdown.basePrice.toLocaleString()}</span>
        </div>

        {/* Travelers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-text-muted" />
            <span className="text-text-secondary">
              {breakdown.travelers} {breakdown.travelers === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </div>
          <span className="text-text-primary">× {breakdown.travelers}</span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-border/50">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary">${breakdown.subtotal.toLocaleString()}</span>
        </div>

        {/* Taxes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-text-muted" />
            <span className="text-text-secondary">Taxes (10%)</span>
          </div>
          <span className="text-text-primary">${breakdown.taxes.toLocaleString()}</span>
        </div>

        {/* Service Fee */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Service Fee (5%)</span>
          <span className="text-text-primary">${breakdown.serviceFee.toLocaleString()}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark-border">
        <span className="text-lg font-semibold text-text-primary">Total</span>
        <span className="text-2xl font-bold text-blue-400">
          ${breakdown.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default PriceBreakdown;
