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

/**
 * Classifies product fields into:
 * 1. catalogMetadata: Sourced authoritatively from frontend products dataset (updated in force mode).
 * 2. operationalDefaults: Initial defaults set ONLY on document insert ($setOnInsert in force mode).
 */
function classifyProductFields(prod) {
  const productId = prod.id || prod.productId;

  const catalogMetadata = {
    productId,
    slug: prod.slug,
    name: prod.name,
    title: prod.title || prod.name,
    category: prod.category,
    roomType: prod.roomType,
    style: prod.style,
    basePrice: prod.basePrice,
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

  const operationalDefaults = {
    inStock: prod.inStock !== false,
    stockCount: typeof prod.stockCount === 'number' ? prod.stockCount : 10,
    featured: Boolean(prod.featured),
  };

  return { catalogMetadata, operationalDefaults };
}

async function seedProducts() {
  const isForce = process.argv.includes('--force');
  const allowProd = process.argv.includes('--allow-prod');
  const nodeEnv = process.env.NODE_ENV || 'development';

  console.log('====================================================');
  console.log(`  DÉCORA — Product Catalog Seeding Utility ${isForce ? '(--force)' : ''}`);
  console.log('====================================================');

  // Phase 3 — Production Safety Guard
  if (nodeEnv === 'production' && !allowProd) {
    console.error('\n[Safety Error] Seeding execution is blocked in production environment.');
    console.error(`  - Current NODE_ENV: ${nodeEnv}`);
    console.error("  - To authorize production seeding, pass the explicit '--allow-prod' flag:");
    console.error('      node scripts/seedProducts.js --allow-prod [--force]\n');
    process.exit(1);
  }

  try {
    const productsSourcePath = path.resolve(__dirname, '../../client/src/data/products.js');
    const productsUrl = pathToFileURL(productsSourcePath).href;
    const { PRODUCTS } = await import(productsUrl);

    if (!Array.isArray(PRODUCTS) || PRODUCTS.length === 0) {
      throw new Error(`Failed to load PRODUCTS from ${productsSourcePath}`);
    }

    console.log(`[Info] Loaded ${PRODUCTS.length} authoritative products from frontend source.`);

    const conn = await connectDB();
    console.log(`[Environment] Target Environment: ${nodeEnv}`);
    console.log(`[Environment] Target Database: ${conn.connection.name}`);
    console.log(`[Environment] Host: ${conn.connection.host}`);

    let inserted = 0;
    let skipped = 0;
    let updated = 0;
    let failed = 0;

    for (const rawProd of PRODUCTS) {
      try {
        const { catalogMetadata, operationalDefaults } = classifyProductFields(rawProd);

        if (isForce) {
          // Force Mode: Update catalog-managed fields, preserve admin-managed operational values
          await Product.findOneAndUpdate(
            { productId: catalogMetadata.productId },
            {
              $set: catalogMetadata,
              $setOnInsert: operationalDefaults,
            },
            { upsert: true, new: true, runValidators: true }
          );
          updated++;
        } else {
          // Normal Mode: Insert missing products, skip existing without modifying
          const existing = await Product.findOne({ productId: catalogMetadata.productId });
          if (existing) {
            skipped++;
          } else {
            await Product.create({
              ...catalogMetadata,
              ...operationalDefaults,
            });
            inserted++;
          }
        }
      } catch (itemErr) {
        failed++;
        console.error(`[Item Error] Failed to process product "${rawProd.id || rawProd.productId}":`, itemErr.message);
      }
    }

    const totalCount = await Product.countDocuments();

    console.log('\n[Summary] Seeding operation complete:');
    console.log(`  - Total processed: ${PRODUCTS.length}`);
    if (isForce) {
      console.log(`  - Upserted/Updated (catalog metadata): ${updated}`);
    } else {
      console.log(`  - Inserted (new products): ${inserted}`);
      console.log(`  - Skipped (already existed): ${skipped}`);
    }
    console.log(`  - Failed: ${failed}`);
    console.log(`  - Total products now in database: ${totalCount}\n`);

    await disconnectDB();
    process.exit(failed > 0 ? 1 : 0);
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
