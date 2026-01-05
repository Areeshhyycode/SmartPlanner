import { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, Minus, Plus, Compass, Trash2 } from 'lucide-react';
import type { ApiTrip, SelectedActivity } from '../../api';

interface EditableActivity extends SelectedActivity {
  activityName: string;
}

interface EditTripModalProps {
  trip: ApiTrip;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    tripId: string,
    startDate: string,
    durationDays: number,
    activities: EditableActivity[]
  ) => Promise<void>;
}

function EditTripModal({ trip, isOpen, onClose, onSave }: EditTripModalProps) {
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [activities, setActivities] = useState<EditableActivity[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form values when trip changes or modal opens
  useEffect(() => {
    if (isOpen && trip) {
      setStartDate(trip.startDate);
      setDurationDays(trip.durationDays);

      // Initialize activities with current values
      const editableActivities: EditableActivity[] = trip.selectedActivities.map((activity) => ({
        activityId: activity.activityId,
        activityName: activity.activityName,
        durationType: activity.durationType as 'HOURS' | 'DAYS',
        durationValue: activity.durationValue,
        quantity: activity.quantity,
        unitPrice: activity.unitPrice,
        totalPrice: activity.subtotal,
      }));

      setActivities(editableActivities);
      setError(null);
    }
  }, [isOpen, trip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    console.log('📝 [EditTripModal] Form submitted');
    console.log('📝 [EditTripModal] Trip ID:', trip.id);
    console.log('📝 [EditTripModal] Start Date:', startDate);
    console.log('📝 [EditTripModal] Duration Days:', durationDays);
    console.log('📝 [EditTripModal] Activities:', activities);
    console.log('📝 [EditTripModal] Activities count:', activities.length);

    try {
      console.log('📝 [EditTripModal] Calling onSave...');
      await onSave(trip.id, startDate, durationDays, activities);
      console.log('✅ [EditTripModal] onSave completed successfully');
      onClose();
    } catch (err) {
      console.error('❌ [EditTripModal] Failed to update trip:', err);
      if (err instanceof Error) {
        console.error('❌ [EditTripModal] Error message:', err.message);
        console.error('❌ [EditTripModal] Error stack:', err.stack);
      }
      setError('Failed to update trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const updateActivity = (index: number, updates: Partial<EditableActivity>) => {
    console.log('🔄 [EditTripModal] updateActivity called:', { index, updates });
    setActivities((prev) =>
      prev.map((activity, i) => {
        if (i !== index) return activity;

        const updated = { ...activity, ...updates };
        console.log('🔄 [EditTripModal] Activity before update:', activity);
        console.log('🔄 [EditTripModal] Updates applied:', updates);
        console.log('🔄 [EditTripModal] Activity after update:', updated);

        // Recalculate total price based on updates
        const price = updated.unitPrice || 0;
        const duration = updated.durationValue || 1;
        const quantity = updated.quantity || 1;
        updated.totalPrice = price * duration * quantity;
        
        console.log('🔄 [EditTripModal] Recalculated totalPrice:', {
          unitPrice: price,
          durationValue: duration,
          quantity: quantity,
          totalPrice: updated.totalPrice,
          durationType: updated.durationType,
        });

        return updated;
      })
    );
  };

  const removeActivity = (index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return activities.reduce((sum, activity) => sum + (activity.totalPrice || 0), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl shadow-blue-500/10 animate-scale-in my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border sticky top-0 bg-dark-card rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Edit Trip</h2>
            <p className="text-sm text-text-muted mt-1">{trip.cityName}, {trip.country}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-elevated rounded-lg text-text-muted hover:text-text-primary transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Number of Days
            </label>
            <div className="flex items-center justify-between bg-dark-elevated rounded-xl p-4">
              <button
                type="button"
                onClick={() => setDurationDays(Math.max(1, durationDays - 1))}
                disabled={durationDays <= 1 || isSaving}
                className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-3xl font-bold text-text-primary">{durationDays}</span>
                <span className="text-text-muted ml-2">days</span>
              </div>
              <button
                type="button"
                onClick={() => setDurationDays(Math.min(30, durationDays + 1))}
                disabled={durationDays >= 30 || isSaving}
                className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trip Dates Section */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-11 pr-4 py-3 bg-dark-elevated border border-dark-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                required
                disabled={isSaving}
              />
            </div>
            {/* Trip Dates Preview */}
            {startDate && (
              <div className="mt-3 p-4 bg-dark-elevated rounded-xl">
                <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Trip Dates</span>
                </div>
                <p className="text-text-primary font-medium">
                  {formatDate(startDate)} -{' '}
                  {(() => {
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + durationDays - 1);
                    return endDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Activities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                Activities
              </h3>
              <span className="text-sm text-text-muted">
                {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
              </span>
            </div>

            {activities.length === 0 ? (
              <div className="p-8 text-center bg-dark-elevated/50 border border-dark-border/50 rounded-xl">
                <p className="text-text-muted">No activities added to this trip</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={`${activity.activityId}-${index}`}
                    className="p-5 bg-dark-elevated border border-dark-border rounded-xl space-y-4"
                  >
                    {/* Activity Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                          <Compass className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary text-base mb-1 truncate">
                            {activity.activityName}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-blue-400 font-semibold">
                              ${activity.unitPrice?.toFixed(2)}
                            </span>
                            <span className="text-xs text-text-muted">per</span>
                            <span className="text-sm text-text-muted capitalize">
                              {activity.durationType === 'HOURS' ? 'hour' : 'day'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="ml-3 p-2 hover:bg-red-500/20 border border-transparent hover:border-red-500/40 rounded-lg text-text-muted hover:text-red-400 transition-all flex-shrink-0"
                        disabled={isSaving}
                        title="Remove activity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Activity Controls */}
                    <div className="pt-4 border-t border-dark-border space-y-4">
                      {/* Duration Type */}
                      <div className="flex items-center gap-4">
                        <span className="text-text-secondary text-sm w-24 flex-shrink-0">Pricing:</span>
                        <div className="flex gap-2 flex-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateActivity(index, {
                                durationType: 'HOURS',
                              })
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              activity.durationType === 'HOURS'
                                ? 'bg-blue-500 text-white'
                                : 'bg-dark-card border border-dark-border text-text-muted hover:text-text-primary hover:border-blue-500/50'
                            }`}
                            disabled={isSaving}
                          >
                            Per Hour
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateActivity(index, {
                                durationType: 'DAYS',
                              })
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              activity.durationType === 'DAYS'
                                ? 'bg-blue-500 text-white'
                                : 'bg-dark-card border border-dark-border text-text-muted hover:text-text-primary hover:border-blue-500/50'
                            }`}
                            disabled={isSaving}
                          >
                            Per Day
                          </button>
                        </div>
                      </div>

                      {/* Duration Value */}
                      <div className="flex items-center gap-4">
                        <span className="text-text-secondary text-sm w-24 flex-shrink-0">
                          {activity.durationType === 'HOURS' ? 'Hours:' : 'Days:'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateActivity(index, {
                                durationValue: Math.max(1, activity.durationValue - 1),
                              })
                            }
                            className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving || activity.durationValue <= 1}
                          >
                            <Minus className="w-4 h-4 text-text-primary" />
                          </button>
                          <span className="w-16 text-center text-text-primary font-semibold text-lg">
                            {activity.durationValue}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateActivity(index, {
                                durationValue: activity.durationValue + 1,
                              })
                            }
                            className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors disabled:opacity-50"
                            disabled={isSaving}
                          >
                            <Plus className="w-4 h-4 text-text-primary" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-4">
                        <span className="text-text-secondary text-sm w-24 flex-shrink-0">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateActivity(index, {
                                quantity: Math.max(1, activity.quantity - 1),
                              })
                            }
                            className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving || activity.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-text-primary" />
                          </button>
                          <span className="w-16 text-center text-text-primary font-semibold text-lg">
                            {activity.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateActivity(index, {
                                quantity: activity.quantity + 1,
                              })
                            }
                            className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-blue-500/50 transition-colors disabled:opacity-50"
                            disabled={isSaving}
                          >
                            <Plus className="w-4 h-4 text-text-primary" />
                          </button>
                        </div>
                      </div>

                      {/* Activity Total */}
                      <div className="flex items-center justify-between pt-3 border-t border-dark-border/50">
                        <span className="text-text-secondary text-sm">Activity Total:</span>
                        <span className="text-xl font-bold text-blue-400">
                          ${(activity.totalPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Cost */}
            <div className="space-y-3 pt-4 border-t border-dark-border">
              <div className="flex justify-between pt-3">
                <span className="text-lg font-semibold text-text-primary">Total Trip Cost</span>
                <span className="text-2xl font-bold text-blue-400">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-dark-border sticky bottom-0 bg-dark-card pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-elevated hover:bg-dark-elevated/80 border border-dark-border rounded-xl text-text-primary font-medium transition-all disabled:opacity-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] disabled:from-blue-500/50 disabled:to-blue-600/50 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 text-white" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTripModal;