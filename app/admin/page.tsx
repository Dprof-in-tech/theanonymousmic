/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  name: string;
  nickname: string | null;
  imageUrl: string;
  uniqueLink: string;
  createdAt: string;
  messageCount?: number;
}

interface AdminCredentials {
  email: string;
  password: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState<AdminCredentials>({
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Check if user is already authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's an auth token in localStorage or sessionStorage
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        
        if (token) {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setIsAuthenticated(true);
            fetchPosts();
          } else {
            // If token is invalid, clear it
            localStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminToken');
            setIsAuthenticated(false);
            setLoading(false);
          }
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('error', err)
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }
      
      const data = await response.json();
      
      // Store token in localStorage/sessionStorage
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchPosts();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setPosts([]);
  };
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      
      // Fetch message counts for each post
      const postsWithMessageCounts = await Promise.all(
        data.map(async (post: Post) => {
          const messagesResponse = await fetch(`/api/messages?postId=${post.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
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
  
  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#efefef]">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-[#1D3557]">Admin Login</h1>
          
          {authError && (
            <div className="bg-red-50 p-3 rounded-md text-red-700 mb-4">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
            
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-[#1D3557] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
            >
              {isAuthLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // Render dashboard when authenticated
  return (
    <div className="w-full min-h-screen h-full px-4 lg:px-8 py-12 bg-[#efefef]">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
        <div className='flex gap-4 items-center'>
          <Link
            href="/admin/posts/new"
            className="bg-[#1D3557] hover:bg-[#F1EDE5] hover:text-black text-[#F1EDE5] px-4 py-2 rounded-md transition-colors"
          >
            Create New Post
          </Link>
          <Link
            href="/admin/events/new"
            className="bg-[#1D3557] hover:bg-[#F1EDE5] hover:text-black text-[#F1EDE5] px-4 py-2 rounded-md transition-colors"
          >
            Create New Event
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            Logout
          </button>
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
          <p className="text-gray-700 mb-4">No posts created yet.</p>
          <Link
            href="/admin/posts/new"
            className="bg-[#1D3557] hover:bg-[#F1EDE5] hover:text-black text-[#F1EDE5] px-4 py-2 rounded-md transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-md overflow-scroll lg:overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
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
                        <div className="text-sm text-gray-700">
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
                    <div className="text-sm text-gray-700">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-gray-700 hover:text-green-900"
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