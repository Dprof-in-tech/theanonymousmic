// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminCredentials, generateAuthToken } from '@/lib/db'; // Adjust import path as needed

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const admin = await verifyAdminCredentials(email, password);
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateAuthToken({
      id: admin.id,
      username: admin.username,
      email: admin.email
    });

    // Set HTTP-only cookie for added security
    (await
          // Set HTTP-only cookie for added security
          cookies()).set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    // Return the token in the response as well (for localStorage)
    return NextResponse.json({ 
      success: true, 
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}