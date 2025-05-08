import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';

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
    
    // Get file extension
    const fileExtension = file.name.split('.').pop() || '';
    
    // Generate a unique filename
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    
    // Define the upload directory path
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Create uploads directory if it doesn't exist
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
        console.log('Created uploads directory');
      }
    } catch (error) {
      console.error('Error creating uploads directory:', error);
      return NextResponse.json(
        { error: 'Failed to create uploads directory' },
        { status: 500 }
      );
    }
    
    // Convert the file to an ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write the file to the uploads directory
    try {
      const filePath = join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);
      
      // Return the path to the file
      const fileUrl = `/uploads/${uniqueFilename}`;
      
      return NextResponse.json({ 
        success: true, 
        fileUrl: fileUrl
      });
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json(
        { error: 'Failed to write file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}