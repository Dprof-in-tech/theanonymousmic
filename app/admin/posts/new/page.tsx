/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUpload from '@/app/components/FileUpload';

export default function CreatePostPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/placeholder-profile.jpg'); // Default placeholder
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // In a real app, add authentication check here
  
  const handleFileUpload = (fileUrl: string) => {
    setImageUrl(fileUrl);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      setError('Name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          nickname: nickname || null,
          description: description || null,
          imageUrl,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }
     
      router.push(`/admin`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-[#efefef] px-4 py-8 ">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="text-[#F1EDE5] hover:text-green-800 mr-2">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter person's full name"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                Nickname (optional)
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter person's display name (if different)"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-gray-700">
                If provided, this name will be displayed publicly instead of their full name.
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                placeholder="Enter a brief description about this person"
                disabled={isSubmitting}
                rows={4}
              />
              <p className="mt-1 text-sm text-gray-700">
                This description will be shown publicly alongside the person&apos;s profile.
              </p>
            </div>
            
            {/* Replace the imageUrl input with our FileUpload component */}
            <FileUpload 
              onFileUpload={handleFileUpload} 
              defaultImage={imageUrl}
              label="Profile Image *"
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#1D3557] hover:bg-[#F1EDE5] hover:text-black text-[#F1EDE5] px-6 py-3 rounded-md transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}