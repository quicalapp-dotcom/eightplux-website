/**
 * Script to fix product slugs in Firestore (Client SDK version)
 * Run this from the browser console on the admin page or use with Firebase emulators
 * 
 * To use: Copy this code and paste it in the browser console when on the admin products page
 */

// Generate clean slug from product name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace any non-alphanumeric chars with hyphen
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
};

async function fixProductSlugs() {
  try {
    const { db } = await import('@/lib/firebase/config');
    const { collection, getDocs, updateDoc, doc } = await import('firebase/firestore');
    
    console.log('Fetching all products...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    
    console.log(`Found ${productsSnapshot.size} products`);
    
    let updatedCount = 0;
    let failedCount = 0;
    
    for (const productDoc of productsSnapshot.docs) {
      const product = productDoc.data();
      const currentSlug = product.slug;
      const newName = product.name;
      
      if (!newName) {
        console.log(`Skipping product "${productDoc.id}" - no name`);
        continue;
      }
      
      const newSlug = generateSlug(newName);
      
      // Only update if slug is different
      if (currentSlug !== newSlug) {
        console.log(`Updating product "${newName}":`);
        console.log(`  Old slug: "${currentSlug}"`);
        console.log(`  New slug: "${newSlug}"`);
        
        try {
          await updateDoc(doc(db, 'products', productDoc.id), {
            slug: newSlug
          });
          updatedCount++;
        } catch (error) {
          console.error(`  Error updating: ${error.message}`);
          failedCount++;
        }
      } else {
        console.log(`Product "${newName}" slug is already clean: "${currentSlug}"`);
      }
    }
    
    console.log('\n=== Summary ===');
    console.log(`Total products: ${productsSnapshot.size}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Failed: ${failedCount}`);
    console.log(`No changes needed: ${productsSnapshot.size - updatedCount - failedCount}`);
    
  } catch (error) {
    console.error('Error fixing product slugs:', error);
  }
}

// Run the function
fixProductSlugs();
