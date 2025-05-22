/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import FileUpload from '@/app/components/FileUpload';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('/placeholder-event.jpg');
  const [hostName, setHostName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch event data on component mount
  useEffect(() => {
    if (!eventId) {
      setError('Event ID is missing');
      setIsLoading(false);
      return;
    }
    
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        
        const data = await response.json();
        
        // Populate form fields with existing event data
        setTitle(data.title || '');
        setDescription(data.description || '');
        setDate(data.date || '');
        setImageUrl(data.imageUrl || '/placeholder-event.jpg');
        setHostName(data.hostName || '');
        setVideoLink(data.videoLink || '');
        
      } catch (err: any) {
        setError(err.message || 'Failed to load event data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);
  
  const handleFileUpload = (fileUrl: string) => {
    setImageUrl(fileUrl);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !hostName) {
      setError('Title, date, and host name are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          date,
          imageUrl,
          hostName,
          videoLink,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update event');
      }
      
      await response.json();
      
      router.push('/admin/events');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#efefef]">
        <div className="text-xl">Loading event data...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-[#efefef] px-4 py-8 ">
      <div className="flex items-center mb-8">
        <Link href="/admin/events" className="text-[#F1EDE5] hover:text-green-800 mr-2">
          &larr; Back to Events
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full lg:w-1/3 text-black">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter event title"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter event description"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="hostName" className="block text-sm font-medium text-gray-700 mb-1">
                Host Name *
              </label>
              <input
                type="text"
                id="hostName"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter host name"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <FileUpload 
              onFileUpload={handleFileUpload} 
              defaultImage={imageUrl}
              label="Event Image *"
            />
            
            <div className="mb-6">
              <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-1">
                Video Link (Optional)
              </label>
              <input
                type="url"
                id="videoLink"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://youtube.com/..."
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#1D3557] hover:bg-[#F1EDE5] hover:text-black text-[#F1EDE5] px-6 py-3 rounded-md transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}