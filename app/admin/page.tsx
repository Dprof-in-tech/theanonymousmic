/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';

interface Post {
  id: number;
  name: string;
  nickname: string | null;
  imageUrl: string;
  uniqueLink: string;
  createdAt: string;
  messageCount?: number;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // In a real app, add authentication check here
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        
        // Fetch message counts for each post
        const postsWithMessageCounts = await Promise.all(
          data.map(async (post: Post) => {
            const messagesResponse = await fetch(`/api/messages?postId=${post.id}`);
            
            if (messagesResponse.ok) {
              const messages = await messagesResponse.json();
              return { ...post, messageCount: messages.length };
            }
            
            return { ...post, messageCount: 0 };
          })
        );
        
        setPosts(postsWithMessageCounts);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <div className="w-full min-h-screen h-full px-4 lg:px-8 py-12 bg-[#efefef]">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
       <div className='flex  gap-4 items-center'>
       <Link
          href="/admin/posts/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Post
        </Link>
        <Link
          href="/admin/events/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Event
        </Link>
       </div>
      </div>
      
      {loading ? (
        <p className="text-center py-8 text-black">Loading posts...</p>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No posts created yet.</p>
          <Link
            href="/admin/posts/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-md overflow-scroll lg:overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white py-4 divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 relative">
                        <img
                          src={post.imageUrl}
                          alt={post.name}
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.nickname || post.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.nickname ? post.name : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {post.messageCount} messages
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        View Messages
                      </Link>
                      <a
                        href={`${window.location.origin}/p/${post.uniqueLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Share Link
                      </a>
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