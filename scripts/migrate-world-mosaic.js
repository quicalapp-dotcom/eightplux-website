#!/usr/bin/env node

/**
 * Migration script to upload existing World Mosaic images to Cloudinary
 * and populate the Firestore world_mosaic collection
 * 
 * This script should be run after updating the codebase to use dynamic mosaic images
 */

require('dotenv').config({ path: './.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../eightplux-63c05-firebase-adminsdk-fbsvc-52ac3517d5.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Default mosaic images from the WorldMosaic component
const DEFAULT_MOSAIC_IMAGES = [
  { src: '/skirt.jpg', alt: 'World Mosaic 1', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/tops.jpg', alt: 'World Mosaic 2', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/tg.jpg', alt: 'World Mosaic 3', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/mn.jpg', alt: 'World Mosaic 4', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/Model3.jpg', alt: 'World Mosaic 5', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/tp.jpg', alt: 'World Mosaic gap filler 1', className: 'col-span-4 row-span-1', socialLink: '' }, 
  { src: '/wb.jpg', alt: 'World Mosaic gap filler 2', className: 'col-span-4 row-span-1', socialLink: '' }, 
  { src: '/tww.jpg', alt: 'World Mosaic 6', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/tees.jpg', alt: 'World Mosaic 7', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/middle.jpg', alt: 'World Mosaic 8', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/lb.jpg', alt: 'World Mosaic 9', className: 'col-span-4 row-span-2', socialLink: '' },
  { src: '/rb.jpg', alt: 'World Mosaic 10', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/caa.jpg', alt: 'World Mosaic gap filler 3', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/001.jpg', alt: 'World Mosaic 11', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/002.jpg', alt: 'World Mosaic 12', className: 'col-span-6 row-span-2', socialLink: '' },
  { src: '/004.jpg', alt: 'World Mosaic 14', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/005.jpg', alt: 'World Mosaic 15', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/006.jpg', alt: 'World Mosaic 16', className: 'col-span-12 row-span-2', socialLink: '' },
  { src: '/tts.png', alt: 'World Mosaic 20', className: 'col-span-8 row-span-2', socialLink: '' },
  { src: '/beyondimg.png', alt: 'World Mosaic 21', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/downa.png', alt: 'World Mosaic 22', className: 'col-span-4 row-span-1', socialLink: '' },
  { src: '/007.jpg', alt: 'World Mosaic 17', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/008.jpg', alt: 'World Mosaic 18', className: 'col-span-6 row-span-1', socialLink: '' },
  { src: '/009.jpg', alt: 'World Mosaic 19', className: 'col-span-12 row-span-2', socialLink: '' },
];

async function migrateWorldMosaic() {
  console.log('Starting world mosaic migration...');
  
  try {
    // Check if world_mosaic collection exists
    const snapshot = await db.collection('world_mosaic').get();
    
    if (!snapshot.empty) {
      console.log('World mosaic collection already exists with data. Skipping migration.');
      return;
    }
    
    console.log('No existing world mosaic data. Creating new documents...');
    
    // Add default images to world_mosaic collection
    const promises = [];
    for (let i = 0; i < DEFAULT_MOSAIC_IMAGES.length; i++) {
      const image = DEFAULT_MOSAIC_IMAGES[i];
      
      // Create document data
      const docData = {
        ...image,
        sortOrder: i
      };
      
      console.log(`Adding image ${i + 1}: ${image.alt}`);
      promises.push(db.collection('world_mosaic').add(docData));
    }
    
    await Promise.all(promises);
    console.log(`Successfully added ${DEFAULT_MOSAIC_IMAGES.length} images to world_mosaic collection`);
    
  } catch (error) {
    console.error('Error during world mosaic migration:', error);
  }
}

// Run the migration
migrateWorldMosaic().then(() => {
  console.log('Migration complete');
  process.exit(0);
}).catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
