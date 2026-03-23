import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file, folder = 'eightplux/images', resource_type = 'image' } = body;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file is a string
    if (typeof file !== 'string') {
      return NextResponse.json(
        { success: false, error: 'File must be a string' },
        { status: 400 }
      );
    }

    // Validate file is base64 data URI
    if (!file.startsWith('data:')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format: must be a data URI (data:image/...;base64,...)' },
        { status: 400 }
      );
    }

    // Validate data URI format
    const dataUriMatch = file.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!dataUriMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid data URI format. Expected: data:image/png;base64,...' },
        { status: 400 }
      );
    }

    const mimeType = dataUriMatch[1];
    const base64Data = dataUriMatch[2];

    // Validate it's an allowed image/video type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    
    // Auto-detect if the file is a video based on MIME type
    const isVideoMimeType = allowedVideoTypes.includes(mimeType);
    const isImageMimeType = allowedImageTypes.includes(mimeType);
    
    // Use detected type or fall back to resource_type parameter
    const effectiveResourceType = isVideoMimeType ? 'video' : (isImageMimeType ? 'image' : resource_type);
    
    if (!isImageMimeType && !isVideoMimeType) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${mimeType}. Allowed types: ${allowedImageTypes.join(', ')}, ${allowedVideoTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate base64 content is not empty
    if (!base64Data || base64Data.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid base64 content: file appears to be empty or too small' },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(file, folder, effectiveResourceType as 'image' | 'video');

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    let errorMessage = 'Upload failed';
    if (error instanceof Error) {
      // Pass through validation errors from cloudinary.ts
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}
