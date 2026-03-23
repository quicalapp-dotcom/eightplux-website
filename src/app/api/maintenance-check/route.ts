import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getAdminDb();
    const settingsDoc = await db.collection('settings').doc('global').get();
    
    if (settingsDoc.exists) {
      const data = settingsDoc.data();
      return NextResponse.json({
        maintenanceMode: data?.maintenanceMode === true
      });
    }
    
    return NextResponse.json({
      maintenanceMode: false
    });
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    // Default to false if there's an error
    return NextResponse.json({
      maintenanceMode: false
    });
  }
}
