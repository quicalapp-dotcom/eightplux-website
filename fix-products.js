/**
 * Script to analyze and fix product data in Firestore
 * - Shows products missing slugs or subCollectionId
 * - Helps assign subCollectionId to products
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Find the service account file - check parent directory first
let serviceAccountPath = path.join(__dirname, '..', 'eightplux-ed137-firebase-adminsdk-fbsvc-47307a71c1.json');

if (!fs.existsSync(serviceAccountPath)) {
  serviceAccountPath = path.join(__dirname, 'eightplux-ed137-firebase-adminsdk-fbsvc-47307a71c1.json');
}

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account file not found:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fixProducts() {
  console.log('=== Fetching data from Firestore ===\n');
  
  // Fetch all collections
  const collectionsSnapshot = await db.collection('collections').get();
  const collections = [];
  collectionsSnapshot.forEach(doc => {
    collections.push({ id: doc.id, ...doc.data() });
  });
  
  // Fetch all sub-collections
  const subCollectionsSnapshot = await db.collection('subCollections').get();
  const subCollections = [];
  subCollectionsSnapshot.forEach(doc => {
    subCollections.push({ id: doc.id, ...doc.data() });
  });
  
  // Fetch all products
  const productsSnapshot = await db.collection('products').get();
  const products = [];
  productsSnapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });
  
  console.log(`Collections: ${collections.length}`);
  console.log(`Sub-Collections: ${subCollections.length}`);
  console.log(`Products: ${products.length}`);
  
  console.log('\n=== Collections (Super Collections) ===\n');
  collections.forEach(col => {
    console.log(`- ${col.name} (${col.superCollection})`);
    console.log(`  ID: ${col.id}`);
    console.log('');
  });
  
  console.log('=== Sub-Collections ===\n');
  subCollections.forEach(sc => {
    const parentCol = collections.find(c => c.id === sc.collectionId);
    console.log(`- ${sc.name}`);
    console.log(`  ID: ${sc.id}`);
    console.log(`  Parent Collection: ${parentCol?.name || 'UNKNOWN'} (${parentCol?.superCollection || 'UNKNOWN'})`);
    console.log('');
  });
  
  console.log('=== Products Analysis ===\n');
  
  let missingSlug = 0;
  let missingSubCollection = 0;
  const productsBySubCollection = {};
  
  products.forEach(product => {
    const hasSlug = !!product.slug;
    const hasSubCollection = !!product.subCollectionId;
    
    if (!hasSlug) missingSlug++;
    if (!hasSubCollection) missingSubCollection++;
    
    if (hasSubCollection) {
      productsBySubCollection[product.subCollectionId] = (productsBySubCollection[product.subCollectionId] || 0) + 1;
    }
    
    console.log(`- ${product.name}`);
    console.log(`  ID: ${product.id}`);
    console.log(`  Slug: ${product.slug || 'MISSING'}`);
    console.log(`  subCollectionId: ${product.subCollectionId || 'MISSING'}`);
    console.log(`  Category: ${product.category}`);
    console.log('');
  });
  
  console.log('\n=== Summary ===\n');
  console.log(`Total products: ${products.length}`);
  console.log(`Missing slug: ${missingSlug}`);
  console.log(`Missing subCollectionId: ${missingSubCollection}`);
  console.log('\nProducts by Sub-Collection:');
  Object.entries(productsBySubCollection).forEach(([subColId, count]) => {
    const subCol = subCollections.find(sc => sc.id === subColId);
    const parentCol = collections.find(c => c.id === subCol?.collectionId);
    console.log(`  ${subCol?.name || subColId} (${parentCol?.superCollection || 'unknown'}): ${count} products`);
  });
  
  // Update products missing slugs
  if (missingSlug > 0) {
    console.log(`\n=== Updating ${missingSlug} products with missing slugs ===\n`);
    
    const updates = products
      .filter(p => !p.slug)
      .map(p => {
        const slug = generateSlug(p.name);
        console.log(`Updating product "${p.id}" with slug: ${slug}`);
        return db.collection('products').doc(p.id).update({ slug });
      });
    
    await Promise.all(updates);
    console.log('\nDone updating slugs!');
  }
  
  console.log('\n=== Instructions for assigning subCollectionId ===\n');
  console.log('Your products need subCollectionId to work with the superCollection filter.');
  console.log('');
  console.log('Option 1: Use the Firebase Console');
  console.log('  1. Go to Firestore Database');
  console.log('  2. Find each product document');
  console.log('  3. Add a "subCollectionId" field with the ID of the sub-collection');
  console.log('');
  console.log('Option 2: Use the admin panel in your app');
  console.log('  - Edit products and assign them to sub-collections');
  console.log('');
  console.log('Available Sub-Collection IDs:');
  subCollections.forEach(sc => {
    const parentCol = collections.find(c => c.id === sc.collectionId);
    console.log(`  - ${sc.id} (${sc.name}) -> ${parentCol?.superCollection || 'unknown'}`);
  });
  
  process.exit(0);
}

fixProducts().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
