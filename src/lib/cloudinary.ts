import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary - support both CLOUDINARY_URL and individual variables
// The Cloudinary SDK automatically reads CLOUDINARY_URL if set
// If not, we need to provide individual credentials
if (!process.env.CLOUDINARY_URL) {
  // Only set config if CLOUDINARY_URL is not available
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Validate configuration on module load
const validateConfig = () => {
  if (process.env.CLOUDINARY_URL) {
    console.log('Cloudinary: Using CLOUDINARY_URL');
    return;
  }
  
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!cloudName) {
    console.error('Cloudinary ERROR: CLOUDINARY_CLOUD_NAME is not set');
  }
  if (!apiKey) {
    console.error('Cloudinary ERROR: CLOUDINARY_API_KEY is not set');
  }
  if (!apiSecret) {
    console.error('Cloudinary ERROR: CLOUDINARY_API_SECRET is not set');
  }
  
  if (cloudName && apiKey && apiSecret) {
    console.log('Cloudinary: Configured with individual variables');
  }
};

// Run validation in non-edge environments
if (typeof window === 'undefined') {
  validateConfig();
}

export interface UploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  resource_type: 'image' | 'video';
  bytes: number;
  width: number;
  height: number;
}

/**
 * Upload a file to Cloudinary
 * @param file File to upload (base64 string or File object)
 * @param folder Target folder in Cloudinary
 * @param resourceType Type of resource (image or video)
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  file: string | File,
  folder: string = 'eightplux/images',
  resourceType: 'image' | 'video' = 'image'
): Promise<UploadResult> => {
  try {
    let fileToUpload: string;

    if (typeof file === 'string') {
      // Validate and clean the base64 string
      fileToUpload = validateAndCleanBase64(file);
    } else {
      // Convert File object to base64
      const reader = new FileReader();
      fileToUpload = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      resource_type: resourceType,
      public_id: undefined, // Auto-generate public id
      overwrite: false,
      unique_filename: true,
    });

    return {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type as 'image' | 'video',
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error: unknown) {
    console.error('Error uploading to Cloudinary:', error);
    
    // Extract more detailed error information
    if (error && typeof error === 'object' && 'message' in error) {
      const cloudinaryError = error as { message: string; http_code?: number };
      if (cloudinaryError.http_code === 400) {
        throw new Error('Invalid image file. Please ensure the file is a valid image format (JPEG, PNG, GIF, WebP, etc.) and try again.');
      }
      throw new Error(`Cloudinary upload failed: ${cloudinaryError.message}`);
    }
    
    throw new Error('Failed to upload file');
  }
};

/**
 * Validate and clean a base64 string to ensure it's properly formatted for Cloudinary
 * @param base64String The base64 string to validate
 * @returns Cleaned base64 string
 */
function validateAndCleanBase64(base64String: string): string {
  // Check if it's a data URI
  if (base64String.startsWith('data:')) {
    // Validate the data URI format
    const dataUriRegex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/;
    const match = base64String.match(dataUriRegex);
    
    if (!match) {
      throw new Error('Invalid data URI format. Expected format: data:image/png;base64,...');
    }
    
    // Check if the base64 content is valid
    const base64Content = base64String.split(',')[1];
    if (!base64Content) {
      throw new Error('Invalid base64 content: missing comma separator');
    }
    
    // Validate base64 characters
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Content)) {
      throw new Error('Invalid base64 content: contains invalid characters');
    }
    
    // Check if base64 padding is correct (optional but helpful)
    const paddingNeeded = (4 - (base64Content.length % 4)) % 4;
    if (paddingNeeded > 0 && !base64String.endsWith('='.repeat(paddingNeeded))) {
      // Cloudinary can handle missing padding, but we log a warning
      console.warn('Base64 string may be missing padding');
    }
    
    return base64String;
  }
  
  // If it's not a data URI, wrap it as a data URI (assuming it's raw base64)
  throw new Error('Base64 string must be a data URI format (data:image/...;base64,...)');
}

/**
 * Delete a file from Cloudinary
 * @param publicId Public ID of the file to delete
 * @param resourceType Type of resource (image or video)
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Generate Cloudinary URL with transformations
 * @param publicId Public ID of the file
 * @param options Transformation options
 * @returns Transformed Cloudinary URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  } = {}
): string => {
  const { width, height, crop = 'fill', quality = 80, format = 'auto' } = options;

  const transformation = [];
  
  if (width || height) {
    transformation.push({
      width,
      height,
      crop,
    });
  }

  transformation.push({
    quality,
    format,
  });

  return cloudinary.url(publicId, {
    transformation,
  });
};

export default cloudinary;
