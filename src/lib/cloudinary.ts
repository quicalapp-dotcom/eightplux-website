import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: '249145777126178',
  api_secret: 'jnkze2LSAXWgjkDCvMIv50R66b4',
  secure: true,
});

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
      fileToUpload = file;
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
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file');
  }
};

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

  let transformation = [];
  
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
