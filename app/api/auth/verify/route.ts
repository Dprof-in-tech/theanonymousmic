/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/db'; // Adjust import path as needed

export async function GET(request: NextRequest) {
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
        { message: 'Authentication token is missing' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await verifyAuthToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if the user has admin role
    if ((decoded as any).role === 'admin') {
      return NextResponse.json({
        verified: true,
        user: {
          id: (decoded as any).userId,
          username: (decoded as any).username,
          email: (decoded as any).email,
          role: (decoded as any).role
        }
      });
    } else {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}