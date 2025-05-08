import { NextRequest, NextResponse } from 'next/server';
import { createMessage, getMessagesByPostId, getPostByUniqueLink } from '@/lib/db';

// GET /api/messages?postId=123 - Get messages for a post (admin only)
export async function GET(req: NextRequest) {
  try {
    // In a real app, add authentication check here
    const url = new URL(req.url);
    const postId = url.searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const messages = await getMessagesByPostId(parseInt(postId));
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create a new message (public)
export async function POST(req: NextRequest) {
  try {
    const { postUniqueLink, content } = await req.json();
    
    if (!postUniqueLink || !content) {
      return NextResponse.json(
        { error: 'Post unique link and content are required' },
        { status: 400 }
      );
    }
    
    // Find the post by unique link
    const posts = await getPostByUniqueLink(postUniqueLink);
    
    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const post = posts[0];
    
    // Create message
    const message = await createMessage({
      postId: post.id,
      content,
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}