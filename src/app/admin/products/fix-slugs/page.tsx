/**
 * Admin utility page to fix product slugs
 * Access this at: /admin/products/fix-slugs
 */

'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function FixProductSlugsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace any non-alphanumeric chars with hyphen
      .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
  };

  const handleFixSlugs = async () => {
    setLoading(true);
    setResults([]);
    setCompleted(false);

    try {
      const log = (message: string) => {
        setResults(prev => [...prev, message]);
      };

      log('Fetching all products...');
      const productsSnapshot = await getDocs(collection(db, 'products'));

      log(`Found ${productsSnapshot.size} products`);

      let updatedCount = 0;
      let failedCount = 0;

      // First pass: collect all slugs and find duplicates
      const slugCounts = new Map<string, string[]>(); // slug -> [docIds]
      
      for (const productDoc of productsSnapshot.docs) {
        const product = productDoc.data();
        const slug = product.slug;
        
        if (slug) {
          if (!slugCounts.has(slug)) {
            slugCounts.set(slug, []);
          }
          slugCounts.set(slug, [...slugCounts.get(slug)!, productDoc.id]);
        }
      }

      // Find duplicate slugs
      const duplicateSlugs = new Map<string, string[]>();
      for (const [slug, ids] of slugCounts) {
        if (ids.length > 1) {
          duplicateSlugs.set(slug, ids);
        }
      }

      if (duplicateSlugs.size > 0) {
        log(`\n⚠ Found ${duplicateSlugs.size} duplicate slug(s):`);
        for (const [slug, ids] of duplicateSlugs) {
          log(`  Slug "${slug}" is used by ${ids.length} products:`);
          for (const id of ids) {
            const product = productsSnapshot.docs.find(d => d.id === id)?.data();
            log(`    - ID: ${id}, Name: "${product?.name}"`);
          }
        }

        // Fix duplicates by adding numeric suffixes
        log('\n🔧 Fixing duplicate slugs...');
        for (const [slug, ids] of duplicateSlugs) {
          // Keep the first product's slug as-is, add suffix to the rest
          for (let i = 1; i < ids.length; i++) {
            const docId = ids[i];
            const productDoc = productsSnapshot.docs.find(d => d.id === docId);
            const product = productDoc?.data();
            
            let counter = 1;
            let newSlug = `${slug}-${counter}`;
            
            // Make sure the new slug is also unique from all existing slugs
            while (slugCounts.has(newSlug) || duplicateSlugs.has(newSlug)) {
              counter++;
              newSlug = `${slug}-${counter}`;
            }

            log(`  Updating "${product?.name}": "${slug}" -> "${newSlug}"`);
            
            try {
              await updateDoc(doc(db, 'products', docId), {
                slug: newSlug
              });
              slugCounts.set(newSlug, [docId]);
              updatedCount++;
            } catch (error) {
              log(`  Error updating "${product?.name}": ${(error as Error).message}`);
              failedCount++;
            }
          }
        }
      } else {
        log('✅ No duplicate slugs found!');
      }

      // Second pass: clean up slugs (replace special chars, etc.)
      log('\n🔧 Cleaning up all slugs...');
      for (const productDoc of productsSnapshot.docs) {
        const product = productDoc.data();
        const currentSlug = product.slug;
        const newName = product.name;

        if (!newName) {
          log(`Skipping product "${productDoc.id}" - no name`);
          continue;
        }

        const newSlug = generateSlug(newName);

        // Only update if slug is different and not already updated
        if (currentSlug !== newSlug && !slugCounts.has(newSlug)) {
          log(`Cleaning product "${newName}":`);
          log(`  Old slug: "${currentSlug}"`);
          log(`  New slug: "${newSlug}"`);

          try {
            await updateDoc(doc(db, 'products', productDoc.id), {
              slug: newSlug
            });
            updatedCount++;
          } catch (error) {
            log(`  Error updating: ${(error as Error).message}`);
            failedCount++;
          }
        }
      }

      log('\n=== Summary ===');
      log(`Total products: ${productsSnapshot.size}`);
      log(`Updated: ${updatedCount}`);
      log(`Failed: ${failedCount}`);
      log(`No changes needed: ${productsSnapshot.size - updatedCount - failedCount}`);
      setCompleted(true);

    } catch (error) {
      setResults(prev => [...prev, 'Error fixing product slugs: ' + (error as Error).message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 bg-white text-black min-h-screen pt-[81px]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-black">Fix Product Slugs</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">What this does</h2>
          <p className="text-sm text-gray-600">
            This utility detects and fixes duplicate product slugs that cause the wrong product to display.
            It also regenerates all product slugs to ensure they only contain lowercase alphanumeric characters and hyphens.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
            <h3 className="text-sm font-bold mb-2 text-yellow-800">⚠ This fixes:</h3>
            <ul className="text-sm space-y-1 text-yellow-700">
              <li>• Products with identical slugs (e.g., two "Power Puff Crop Top" products)</li>
              <li>• Slugs with special characters (e.g., en-dashes, quotes)</li>
              <li>• Slugs that don't match the product name</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-bold mb-2">Examples:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li><code className="bg-gray-200 px-1">"Zodiac Party Rave T‑Shirt"</code> → <code className="bg-gray-200 px-1">"zodiac-party-rave-t-shirt"</code></li>
              <li><code className="bg-gray-200 px-1">"The "Void" Trench"</code> → <code className="bg-gray-200 px-1">"the-void-trench"</code></li>
              <li><code className="bg-gray-200 px-1">"Casual Friday (Men)"</code> → <code className="bg-gray-200 px-1">"casual-friday-men"</code></li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleFixSlugs}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Fixing Slugs...' : 'Fix All Product Slugs'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold mb-2">Results:</h3>
            <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto font-mono text-xs space-y-1">
              {results.map((line, i) => (
                <div key={i} className={line.startsWith('Error') ? 'text-red-600' : ''}>{line}</div>
              ))}
            </div>
          </div>
        )}

        {completed && (
          <div className="border-t pt-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <p className="text-sm font-bold text-green-800">✓ Slug fixing completed!</p>
              <p className="text-sm text-green-600 mt-1">You can now test the product pages to verify they load correctly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
