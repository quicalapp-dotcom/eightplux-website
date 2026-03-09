// Firebase Storage utilities for image uploads
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

/**
 * Upload an image to Firebase Storage and return the download URL
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'collections', 'products', 'world')
 * @param filename - Optional custom filename
 * @returns The download URL of the uploaded file
 */
export const uploadAdminImage = async (
  file: File,
  path: string,
  filename?: string
): Promise<string> => {
  try {
    console.log('Starting image upload:', file.name);
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const finalFilename = filename || `${timestamp}-${randomString}.${fileExtension}`;
    
    const storageRef = ref(storage, `${path}/${finalFilename}`);
    console.log('Storage reference created:', storageRef.fullPath);
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        size: file.size.toString()
      }
    };
    
    const uploadResult = await uploadBytes(storageRef, file, metadata);
    console.log('Upload completed:', uploadResult.metadata.fullPath);
    
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Retry once if it's a timeout or network error
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as any).code;
      console.log('Error code:', errorCode);
      
      if (errorCode === 'storage/retry-limit-exceeded' || errorCode === 'storage/unavailable') {
        console.log('Retrying upload...');
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return await uploadAdminImage(file, path, filename);
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw new Error('Failed to upload image (retry failed)');
        }
      }
    }
    
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images to Firebase Storage
 * @param files - Array of files to upload
 * @param path - The storage path
 * @returns Array of download URLs
 */
export const uploadAdminImages = async (
  files: File[],
  path: string
): Promise<string[]> => {
  const urls = await Promise.all(
    files.map(file => uploadAdminImage(file, path))
  );
  return urls;
};
