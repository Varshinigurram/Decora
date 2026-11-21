import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function transformProduct(prod) {
  const productId = prod.id || prod.productId;
  return {
    productId,
    slug: prod.slug,
    name: prod.name,
    title: prod.title || prod.name,
    category: prod.category,
    roomType: prod.roomType,
    style: prod.style,
    basePrice: prod.basePrice,
    inStock: prod.inStock !== false,
    stockCount: typeof prod.stockCount === 'number' ? prod.stockCount : 10,
    dimensions: {
      width: prod.dimensions?.width,
      depth: prod.dimensions?.depth,
      height: prod.dimensions?.height,
      formatted: prod.dimensions?.formatted,
    },
    weightKg: prod.weightKg,
    materials: prod.materials || [],
    primaryMaterial: prod.primaryMaterial,
    description: prod.description,
    editorialNote: prod.editorialNote,
    image: prod.image,
    gallery: prod.gallery || [],
    fallback: prod.fallback || '/assets/placeholders/placeholder-product.svg',
    tag: prod.tag,
    featured: Boolean(prod.featured),
    customizable: Boolean(prod.customizable),
    customizationOptions: prod.customizationOptions
      ? {
          fabrics: prod.customizationOptions.fabrics || [],
          finishes: prod.customizationOptions.finishes || [],
          sizes: prod.customizationOptions.sizes || [],
        }
      : { fabrics: [], finishes: [], sizes: [] },
    specifications: prod.specifications || {},
    relatedProductIds: prod.relatedProductIds || [],
    prompt: prod.prompt,
  };
}

async function seedProducts() {
  const isForce = process.argv.includes('--force');

  console.log('====================================================');
  console.log(`  DÉCORA — Product Catalog Seeding Utility ${isForce ? '(--force)' : ''}`);
  console.log('====================================================');

  try {
    const productsSourcePath = path.resolve(__dirname, '../../client/src/data/products.js');
    const productsUrl = pathToFileURL(productsSourcePath).href;
    const { PRODUCTS } = await import(productsUrl);

    if (!Array.isArray(PRODUCTS) || PRODUCTS.length === 0) {
      throw new Error(`Failed to load PRODUCTS from ${productsSourcePath}`);
    }

    console.log(`[Info] Loaded ${PRODUCTS.length} authoritative products from frontend source.`);

    await connectDB();

    let inserted = 0;
    let skipped = 0;
    let updated = 0;

    for (const rawProd of PRODUCTS) {
      const doc = transformProduct(rawProd);
      const existing = await Product.findOne({ productId: doc.productId });

      if (isForce) {
        await Product.findOneAndUpdate(
          { productId: doc.productId },
          { $set: doc },
          { upsert: true, new: true, runValidators: true }
        );
        updated++;
      } else {
        if (existing) {
          skipped++;
        } else {
          await Product.create(doc);
          inserted++;
        }
      }
    }

    const totalCount = await Product.countDocuments();

    console.log('\n[Summary] Seeding operation complete:');
    if (isForce) {
      console.log(`  - Total processed: ${PRODUCTS.length}`);
      console.log(`  - Upserted/Updated: ${updated}`);
    } else {
      console.log(`  - Total processed: ${PRODUCTS.length}`);
      console.log(`  - Inserted: ${inserted}`);
      console.log(`  - Skipped (already existed): ${skipped}`);
    }
    console.log(`  - Total products now in database: ${totalCount}\n`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('\n[Fatal Error] Seeding failed:', error.message);
    try {
      await disconnectDB();
    } catch {
      // Ignore
    }
    process.exit(1);
  }
}

seedProducts();
