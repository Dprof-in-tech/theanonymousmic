/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Fallback to cookie if no Authorization header
      const tokenCookie = (await cookies()).get('admin_token');
      if (tokenCookie) {
        token = tokenCookie.value;
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if the user has admin role
    if (decoded && (decoded as any).role === 'admin') {
      // Call the handler with the authenticated user info
      return await handler(request, decoded);
    } else {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
  } catch (error) {
    // Token verification failed
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.error('Authentication error:', error);
    return NextResponse.json(
      { message: 'Authentication error' },
      { status: 500 }
    );
  }
}