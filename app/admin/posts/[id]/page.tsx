/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Post {
  id: number;
  name: string;
  nickname: string | null;
  imageUrl: string;
  uniqueLink: string;
  createdAt: string;
}

interface Message {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // In a real app, add authentication check here
  
  useEffect(() => {
    const fetchPostAndMessages = async () => {
      try {
        // Fetch post details
        const postResponse = await fetch(`/api/posts/${postId}`);
        
        if (!postResponse.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const postData = await postResponse.json();
        setPost(postData);
        
        // Set the share URL
        setShareUrl(`${window.location.origin}/p/${postData.uniqueLink}`);
        
        // Fetch messages for this post
        const messagesResponse = await fetch(`/api/messages?postId=${postId}`);
        
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostAndMessages();
  }, [postId]);
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        setError('Failed to copy link');
      }
    );
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center py-8">Loading...</p>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error || 'Post not found'}
        </div>
        <div className="mt-4">
          <Link href="/admin" className="text-green-600 hover:text-green-800">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  const displayName = post.nickname || post.name;
  
  return (
    <div className="w-full min-h-screen h-full px-[64px] py-12 bg-[#efefef]">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="text-green-600 hover:text-green-800 mr-2">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8 text-black">
            <div className="p-6">
              <div className="mb-6 mx-auto relative w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={displayName}
                  className="rounded-full"
                />
              </div>
              
              <h1 className="text-xl font-bold text-center mb-2">{displayName}</h1>
              {post.nickname && (
                <p className="text-gray-500 text-center mb-4">{post.name}</p>
              )}
              
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Share Link</h3>
                    <div className="flex">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-grow p-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                      />
                      <button
                        onClick={copyShareLink}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-r-md transition-colors"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-md transition-colors"
                >
                  View Public Page
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Created on {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {messages.length} messages received
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 text-black">
              <h2 className="text-xl font-semibold mb-6">Anonymous Messages</h2>
              
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No messages received yet.</p>
                  <p className="text-sm text-gray-400">
                    Share the link with people to start receiving anonymous messages.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="bg-gray-50 p-4 rounded-md border border-gray-200"
                    >
                      <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}