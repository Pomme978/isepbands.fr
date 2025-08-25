'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, ExternalLink, Clock, Music } from 'lucide-react';
import LangLink from '@/components/common/LangLink';

interface UserEditEventsProps {
  userId: string;
}

interface EventParticipation {
  id: string;
  eventId: string;
  eventName: string;
  eventType: 'concert' | 'jam' | 'rehearsal' | 'showcase' | 'other';
  date: string;
  venue: string;
  role: string;
  status: 'registered' | 'attended' | 'missed' | 'cancelled';
  groupName?: string;
  notes?: string;
}

// Mock data
const MOCK_EVENTS: EventParticipation[] = [
  {
    id: '1',
    eventId: 'event-1',
    eventName: 'Winter Concert 2024',
    eventType: 'concert',
    date: '2024-12-15T19:00:00',
    venue: 'Supersonic',
    role: 'Performer',
    status: 'attended',
    groupName: 'The Rockers',
    notes: 'Great performance!'
  },
  {
    id: '2',
    eventId: 'event-2',
    eventName: 'Weekly Jam Session',
    eventType: 'jam',
    date: '2024-12-10T18:00:00',
    venue: 'ISEP NDC',
    role: 'Participant',
    status: 'attended'
  },
  {
    id: '3',
    eventId: 'event-3',
    eventName: 'The Rockers Rehearsal',
    eventType: 'rehearsal',
    date: '2024-12-08T14:00:00',
    venue: 'ISEP NDC',
    role: 'Lead Guitarist',
    status: 'attended',
    groupName: 'The Rockers'
  },
  {
    id: '4',
    eventId: 'event-4',
    eventName: 'Autumn Showcase',
    eventType: 'showcase',
    date: '2024-11-20T20:00:00',
    venue: 'ISEP NDL',
    role: 'Performer',
    status: 'missed',
    groupName: 'The Rockers',
    notes: 'Sick, could not attend'
  },
  {
    id: '5',
    eventId: 'event-5',
    eventName: 'Spring Concert 2025',
    eventType: 'concert',
    date: '2025-03-15T19:30:00',
    venue: 'Supersonic',
    role: 'Performer',
    status: 'registered',
    groupName: 'The Rockers'
  }
];

export default function UserEditEvents({ userId }: UserEditEventsProps) {
  const [events, setEvents] = useState<EventParticipation[]>(MOCK_EVENTS);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) > now);
  const pastEvents = events.filter(e => new Date(e.date) <= now);

  const filteredEvents = (() => {
    let filtered = events;
    
    if (filter === 'upcoming') filtered = upcomingEvents;
    if (filter === 'past') filtered = pastEvents;
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.eventType === typeFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'concert':
        return <Music className="w-4 h-4" />;
      case 'jam':
        return <Users className="w-4 h-4" />;
      case 'rehearsal':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'concert':
        return 'bg-purple-100 text-purple-800';
      case 'jam':
        return 'bg-blue-100 text-blue-800';
      case 'rehearsal':
        return 'bg-green-100 text-green-800';
      case 'showcase':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attended':
        return 'bg-green-100 text-green-800';
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const EventCard = ({ event }: { event: EventParticipation }) => {
    const isUpcoming = new Date(event.date) > now;
    
    return (
      <div className={`p-4 border-2 rounded-lg transition-colors ${
        isUpcoming 
          ? 'border-blue-200 bg-blue-50' 
          : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
              {getEventTypeIcon(event.eventType)}
              <span className="ml-1 capitalize">{event.eventType}</span>
            </span>
            <h4 className="font-semibold text-gray-900">{event.eventName}</h4>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            <LangLink
              href={`/admin/events/${event.eventId}`}
              className="text-primary hover:text-primary/80 transition-colors"
              title="View event admin page"
            >
              <ExternalLink className="w-4 h-4" />
            </LangLink>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-2" />
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {event.venue}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Role:</span>
            <span className="font-medium text-gray-900">{event.role}</span>
          </div>

          {event.groupName && (
            <div className="flex justify-between">
              <span>Group:</span>
              <span className="font-medium text-gray-900">{event.groupName}</span>
            </div>
          )}

          {event.notes && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
              <strong>Notes:</strong> {event.notes}
            </div>
          )}
        </div>

        {/* Event Actions */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {isUpcoming ? (
              <div className="flex space-x-2">
                <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                  Remove Registration
                </button>
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  Edit Role
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                {event.status === 'registered' && (
                  <>
                    <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                      Mark Attended
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                      Mark Missed
                    </button>
                  </>
                )}
                <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                  Add Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="all">All Types</option>
              <option value="concert">Concerts</option>
              <option value="jam">Jam Sessions</option>
              <option value="rehearsal">Rehearsals</option>
              <option value="showcase">Showcases</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Participation ({filteredEvents.length} events)
        </h3>
        
        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No events found</p>
            <p className="text-sm">Try adjusting the filters above</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{events.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.status === 'attended').length}
            </div>
            <div className="text-sm text-gray-600">Attended</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.status === 'missed').length}
            </div>
            <div className="text-sm text-gray-600">Missed</div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-900">Attendance Rate:</span>
            <span className="text-xl font-bold text-blue-600">
              {pastEvents.length > 0 
                ? Math.round((pastEvents.filter(e => e.status === 'attended').length / pastEvents.length) * 100)
                : 0}%
            </span>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ 
                width: pastEvents.length > 0 
                  ? `${(pastEvents.filter(e => e.status === 'attended').length / pastEvents.length) * 100}%`
                  : '0%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Event Management Guidelines */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Management Guidelines</h3>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Event attendance can be updated manually if needed</li>
            <li>• Notes can be added to track special circumstances</li>
            <li>• Removing registrations should be done with care for upcoming events</li>
            <li>• Role changes should be coordinated with event organizers</li>
            <li>• Past event data is preserved for statistics and historical records</li>
          </ul>
        </div>
      </div>
    </div>
  );
}