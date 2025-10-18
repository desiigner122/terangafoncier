import React, { useMemo } from 'react';
import {
  Phone,
  Mail,
  Users,
  FileText,
  CheckCircle,
  Loader2,
} from 'lucide-react';

const ActivityTimeline = ({
  activities = [],
  contacts = {},
  isLoading = false,
  filter = 'all', // 'all', 'contact', 'deal'
  filterId = null,
}) => {
  const activityIcons = {
    call: <Phone size={18} className="text-blue-600" />,
    email: <Mail size={18} className="text-blue-500" />,
    meeting: <Users size={18} className="text-purple-600" />,
    note: <FileText size={18} className="text-gray-600" />,
    task: <CheckCircle size={18} className="text-green-600" />,
  };

  const activityColors = {
    call: 'bg-blue-50 border-l-4 border-blue-500',
    email: 'bg-blue-50 border-l-4 border-blue-400',
    meeting: 'bg-purple-50 border-l-4 border-purple-500',
    note: 'bg-gray-50 border-l-4 border-gray-500',
    task: 'bg-green-50 border-l-4 border-green-500',
  };

  const activityLabels = {
    call: 'Phone Call',
    email: 'Email',
    meeting: 'Meeting',
    note: 'Note',
    task: 'Task',
  };

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    if (filter === 'contact' && filterId) {
      filtered = filtered.filter((a) => a.contact_id === filterId);
    } else if (filter === 'deal' && filterId) {
      filtered = filtered.filter((a) => a.deal_id === filterId);
    }

    // Sort by created_at descending (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );
  }, [activities, filter, filterId]);

  const getContactName = (contactId) => {
    return contacts[contactId]?.name || 'Unknown Contact';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOutcomeColor = (outcome) => {
    if (!outcome) return 'text-gray-600';

    const outcomeLower = outcome.toLowerCase();

    if (
      outcomeLower.includes('positive') ||
      outcomeLower.includes('success') ||
      outcomeLower.includes('completed')
    ) {
      return 'text-green-600';
    }

    if (
      outcomeLower.includes('negative') ||
      outcomeLower.includes('cancelled') ||
      outcomeLower.includes('failed')
    ) {
      return 'text-red-600';
    }

    if (
      outcomeLower.includes('neutral') ||
      outcomeLower.includes('pending') ||
      outcomeLower.includes('scheduled')
    ) {
      return 'text-yellow-600';
    }

    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Activity Timeline</h2>
        <p className="text-sm text-gray-600 mt-1">
          {filteredActivities.length} activities
        </p>
      </div>

      {/* Timeline Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading activities...</span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-lg">
              {filter === 'all'
                ? 'No activities yet'
                : 'No activities for this item'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline Connector */}
                {index < filteredActivities.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-200" />
                )}

                {/* Activity Item */}
                <div className={`${activityColors[activity.type]} p-4 rounded-lg flex gap-4`}>
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    {activityIcons[activity.type] || activityIcons.note}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {activityLabels[activity.type]}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getContactName(activity.contact_id)}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    {activity.title && (
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.title}
                      </p>
                    )}

                    {/* Description */}
                    {activity.description && (
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                        {activity.description}
                      </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                      {/* Duration */}
                      {activity.duration_minutes && (
                        <span>⏱️ {activity.duration_minutes} min</span>
                      )}

                      {/* Outcome */}
                      {activity.outcome && (
                        <span className={getOutcomeColor(activity.outcome)}>
                          ✓ {activity.outcome}
                        </span>
                      )}

                      {/* Participants */}
                      {activity.participants && activity.participants.length > 0 && (
                        <span>👥 {activity.participants.length} participant(s)</span>
                      )}

                      {/* Attachments */}
                      {activity.attachments && activity.attachments.length > 0 && (
                        <span>📎 {activity.attachments.length} file(s)</span>
                      )}
                    </div>

                    {/* Participants List */}
                    {activity.participants && activity.participants.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                          Participants:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {activity.participants.map((participant, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded"
                            >
                              {participant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scheduled Date for Future Activities */}
                    {activity.type === 'task' &&
                      activity.scheduled_date &&
                      new Date(activity.scheduled_date) > new Date() && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-blue-600 font-medium">
                            📅 Scheduled for:{' '}
                            {new Date(activity.scheduled_date).toLocaleDateString(
                              'fr-FR'
                            )}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
