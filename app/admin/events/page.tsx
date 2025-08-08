/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  imageUrl: string;
  hostName: string;
  videoLink: string | null;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // In a real app, add authentication check here
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove the event from the local state
      setEvents(events.filter(event => event.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <div className="w-full px-4 py-8 bg-[#efefef] h-screen">
      <div className="flex flex-col gap-4 lg:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <div className="flex space-x-4 items-center">
          <Link href="/admin" className="text-gray-700 hover:text-green-800">
            &larr; Back to Dashboard
          </Link>
          <Link
            href="/admin/events/new"
            className="bg-[#1D3557] hover:bg-[#F1EDE5] hover:text-black text-[#F1EDE5] px-4 py-2 rounded-md transition-colors"
          >
            Create New Event
          </Link>
        </div>
      </div>
      
      {loading ? (
        <p className="text-center py-8 text-gray-700">Loading events...</p>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-700 mb-4">No events created yet.</p>
          <Link
            href="/admin/events/new"
            className="bg-[#1D3557] hover:bg-[#F1EDE5] hover:text-black text-[#F1EDE5] px-4 py-2 rounded-md transition-colors"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-scroll lg:overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-700 truncate max-w-xs">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(event.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.hostName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link href={`/admin/events/${event.id}`} className="text-gray-700 hover:text-green-900">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="text-red-600 hover:text-red-900 disabled:text-red-300"
                      >
                        {deletingId === event.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}