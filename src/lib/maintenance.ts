import { getAdminDb } from './firebase/admin';

/**
 * Check if the store is in maintenance mode
 * @returns Promise<boolean> - true if maintenance mode is enabled
 */
export async function isMaintenanceMode(): Promise<boolean> {
  try {
    const db = getAdminDb();
    const settingsDoc = await db.collection('settings').doc('global').get();
    
    if (settingsDoc.exists) {
      const data = settingsDoc.data();
      console.log('Maintenance mode check:', data?.maintenanceMode);
      return data?.maintenanceMode === true;
    }
    
    console.log('No settings found, maintenance mode defaulting to false');
    return false;
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    // Default to false if there's an error (don't block access)
    return false;
  }
}

/**
 * Paths that should be accessible during maintenance mode
 */
export const maintenanceExemptPaths = [
  '/admin',
  '/api',
  '/_next',
  '/login',
  '/favicon.ico',
  '/maintenance',
];

/**
 * Check if a path is exempt from maintenance mode
 * @param path - The request path
 * @returns boolean - true if the path should be accessible during maintenance
 */
export function isMaintenanceExempt(path: string): boolean {
  // Always allow admin paths
  if (path.startsWith('/admin')) {
    return true;
  }
  
  // Always allow API routes
  if (path.startsWith('/api')) {
    return true;
  }
  
  // Allow Next.js internals
  if (path.startsWith('/_next') || path.startsWith('/favicon')) {
    return true;
  }
  
  // Allow login page
  if (path === '/login' || path === '/signup') {
    return true;
  }
  
  // Allow maintenance page itself
  if (path === '/maintenance') {
    return true;
  }
  
  return false;
}
