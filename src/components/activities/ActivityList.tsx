import { Clock } from 'lucide-react';
import { ActivityCard, type ActivitySelection } from './ActivityCard';
import type { ApiActivity } from '../../api';

interface ActivityListProps {
  activities: ApiActivity[];
  cityName: string;
  selectedActivities: Map<string, ActivitySelection>;
  onToggleActivity: (activityId: string) => void;
  onUpdateSelection: (activityId: string, updates: Partial<ActivitySelection>) => void;
  getActivityPrice: (activityId: string) => number;
  onShowOnMap?: (activityId: string) => void;
  highlightedActivityId?: string | null;
}

export const ActivityList = ({
  activities,
  cityName,
  selectedActivities,
  onToggleActivity,
  onUpdateSelection,
  getActivityPrice,
  onShowOnMap,
  highlightedActivityId,
}: ActivityListProps) => {
  const availableActivities = activities.filter(
    (a) => a.pricePerHour > 0 || a.pricePerDay > 0
  );

  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold text-text-primary mb-6">
        Activities in {cityName}
      </h2>
      <p className="text-text-secondary mb-6">
        Select the activities you want to add to your trip and customize duration
      </p>

      {availableActivities.length > 0 ? (
        <div className="space-y-4">
          {availableActivities.map((activity) => {
            const isSelected = selectedActivities.has(activity.id);
            const selection = selectedActivities.get(activity.id);

            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isSelected={isSelected}
                selection={selection}
                activityPrice={getActivityPrice(activity.id)}
                onToggle={onToggleActivity}
                onUpdateSelection={onUpdateSelection}
                onShowOnMap={onShowOnMap}
                isHighlighted={highlightedActivityId === activity.id}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl">
          <Clock className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No activities available
          </h3>
          <p className="text-text-secondary">
            No activities have been added to this city yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
