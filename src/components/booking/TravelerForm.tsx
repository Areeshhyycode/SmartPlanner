import { User, Mail, Phone, Users, Minus, Plus } from 'lucide-react';
import type { TravelerInfo } from '../../types/booking';

interface TravelerFormProps {
  travelerInfo: TravelerInfo;
  travelers: number;
  maxTravelers: number;
  onTravelerInfoChange: (info: TravelerInfo) => void;
  onTravelersChange: (count: number) => void;
}

function TravelerForm({
  travelerInfo,
  travelers,
  maxTravelers,
  onTravelerInfoChange,
  onTravelersChange,
}: TravelerFormProps) {
  const handleInputChange = (field: keyof TravelerInfo, value: string) => {
    onTravelerInfoChange({
      ...travelerInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Number of Travelers */}
      <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-text-primary font-medium">Number of Travelers</p>
              <p className="text-text-muted text-sm">Max {maxTravelers} travelers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTravelersChange(Math.max(1, travelers - 1))}
              disabled={travelers <= 1}
              className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-xl font-semibold text-text-primary">
              {travelers}
            </span>
            <button
              onClick={() => onTravelersChange(Math.min(maxTravelers, travelers + 1))}
              disabled={travelers >= maxTravelers}
              className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lead Traveler Info */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Lead Traveler Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                value={travelerInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="John"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                value={travelerInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="email"
                value={travelerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="tel"
                value={travelerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelerForm;
