/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPostById, deletePost } from '@/lib/db';
import { withAuth } from '../../middleware';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await getPostById(postId);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async () => {
    try {
      const { id } = await context.params;
      const postId = parseInt(id, 10);
      
      if (isNaN(postId)) {
        return NextResponse.json(
          { error: 'Invalid post ID' },
          { status: 400 }
        );
      }

      await deletePost(postId);
      
      return NextResponse.json(
        { message: 'Post deleted successfully' },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error deleting post:', error);
      
      if (error.message === 'Post not found') {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }
  });
}
