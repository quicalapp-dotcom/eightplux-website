/**
 * Upload files directly to Cloudinary from the client side
 * This bypasses Vercel's payload size limit
 */
export const uploadToCloudinaryDirect = async (
  file: File,
  folder: string = 'eightplux/videos',
  resourceType: 'image' | 'video' = 'video'
): Promise<{ secure_url: string; public_id: string; format: string }> => {
  try {
    // Get signature from our API
    const timestamp = Math.round(Date.now() / 1000);
    
    // For direct client-side upload, we need to use Cloudinary's upload widget or direct unsigned upload
    // Since we have signed credentials, we'll use a serverless approach with streaming
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'eightplux');
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);
    
    // Upload to Cloudinary using their direct upload API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }
    
    const result = await response.json();
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    };
  } catch (error) {
    console.error('Direct Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload a base64 string directly to Cloudinary
 */
export const uploadBase64ToCloudinaryDirect = async (
  base64Data: string,
  folder: string = 'eightplux/videos',
  resourceType: 'image' | 'video' = 'video'
): Promise<{ secure_url: string; public_id: string; format: string }> => {
  try {
    // Create form data with base64
    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'eightplux');
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);
    
    // Upload to Cloudinary using their direct upload API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }
    
    const result = await response.json();
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    };
  } catch (error) {
    console.error('Direct Cloudinary base64 upload error:', error);
    throw error;
  }
};
