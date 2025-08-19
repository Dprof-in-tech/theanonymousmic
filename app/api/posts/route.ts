import { NextRequest, NextResponse } from 'next/server';
import { createPost, getAllPosts } from '@/lib/db';
import { randomBytes } from 'crypto';
import { withAuth } from '../middleware';

// Generate a unique link
function generateUniqueLink(): string {
  return randomBytes(8).toString('hex');
}

// GET /api/posts - Get all posts (admin only)
export async function GET() {
  try {
    // In a real app, add authentication check here
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts - Create a new post (admin only)
export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
  try {
    // In a real app, add authentication check here
    const { name, nickname, description, imageUrl } = await req.json();
    
    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: 'Name and image URL are required' },
        { status: 400 }
      );
    }
    
    // Generate a unique link for the post
    const uniqueLink = generateUniqueLink();
    
    const post = await createPost({
      name,
      nickname,
      description,
      imageUrl,
      uniqueLink,
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
  })}