import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image (JPEG, PNG, GIF, WEBP).' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }
    
    // Get file extension
    const fileExtension = file.name.split('.').pop() || '';
    
    // Generate a unique filename
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    
    try {
      // Upload to Vercel Blob Storage
      const blob = await put(uniqueFilename, file, {
        access: 'public',
      });
      
      return NextResponse.json({ 
        success: true, 
        fileUrl: blob.url
      });
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      return NextResponse.json(
        { error: 'Failed to upload file to cloud storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
