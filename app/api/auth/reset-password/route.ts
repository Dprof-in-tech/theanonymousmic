// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { resetAdminPassword } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;
    
    // In production, this endpoint should be protected!
    // For development only
    
    // Validate input
    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Email and new password are required' },
        { status: 400 }
      );
    }
    
    const result = await resetAdminPassword(email, newPassword);
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      user: result
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}