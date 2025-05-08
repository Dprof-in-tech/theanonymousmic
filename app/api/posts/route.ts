import { NextRequest, NextResponse } from 'next/server';
import { createPost, getAllPosts, getPostByUniqueLink, getPostById } from '@/lib/db';
import { randomBytes } from 'crypto';

// Generate a unique link
function generateUniqueLink(): string {
  return randomBytes(8).toString('hex');
}

// GET /api/posts - Get all posts (admin only)
export async function GET(req: NextRequest) {
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
  try {
    // In a real app, add authentication check here
    const { name, nickname, imageUrl } = await req.json();
    
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
}

// GET for a specific post by ID
export async function GET_BY_ID({ params }: { params: { id: string } }) {
  try {
    const postId = parseInt(params.id);
    
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    const posts = await getPostById(postId);
    
    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(posts[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// GET for a specific post by unique link
export async function GET_BY_LINK(uniqueLink: string) {
  try {
    const posts = await getPostByUniqueLink(uniqueLink);
    
    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(posts[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}