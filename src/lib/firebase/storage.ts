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
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const finalFilename = filename || `${timestamp}-${randomString}.${fileExtension}`;
    
    const storageRef = ref(storage, `${path}/${finalFilename}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
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
