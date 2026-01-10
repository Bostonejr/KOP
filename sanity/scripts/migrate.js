/**
 * Migration Script - Import Portfolio Data and Images to Sanity
 *
 * This script:
 * 1. Reads the Portfolio.csv file
 * 2. Maps each project to its image folder
 * 3. Uploads all images to Sanity
 * 4. Creates project documents with the uploaded images
 *
 * Usage:
 * 1. First, create a Sanity project at sanity.io and get your project ID
 * 2. Set environment variables:
 *    - SANITY_PROJECT_ID: Your Sanity project ID
 *    - SANITY_TOKEN: A write token from sanity.io/manage (Settings > API > Tokens)
 * 3. Run: node scripts/migrate.js
 *
 * IMPORTANT: You need a write token with Editor or higher permissions
 * to upload images and create documents.
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { createReadStream, readFileSync, existsSync, readdirSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===========================================
// CONFIGURATION
// ===========================================

// Sanity client configuration
// Get these from your Sanity dashboard at sanity.io/manage
const config = {
  projectId: process.env.SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN, // Required for uploads!
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for mutations
};

// Paths
const ASSETS_PATH = path.join(__dirname, '..', '..', 'assets');
const CSV_PATH = path.join(ASSETS_PATH, 'cms sample', 'Portfolio.csv');
const PICTURES_PATH = path.join(ASSETS_PATH, 'pictures');

// ===========================================
// FOLDER MAPPING
// ===========================================

/**
 * Map CSV project names to folder names
 *
 * The folder names don't exactly match the CSV names, so we need
 * this mapping to find the correct images for each project.
 */
const folderMapping = {
  "Nana Peprah's Residence": "Nana Peprah's Residence",
  "Ga Traditional Council Durbar Grounds": "Ga Traditional Council",
  "Madjie's Residence": "Madjie's Residence",
  "Gloria's Residence": "Gloria's Residence",
  "Maame Sika's Residence": "Maame Sika's Residence",
  "Ekyem Presby": "Religious",
  " Pres_Summer Hut": "Recreational", // Note: has leading space in CSV
  "Pres_Summer Hut": "Recreational",
  "Prabon Greenfields Model_E": null, // No local images
  "Mr and Mrs Ababio's Residence ": "MR AND MRS ABABIO's Residence", // Note: trailing space in CSV
  "Mr and Mrs Ababio's Residence": "MR AND MRS ABABIO's Residence",
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Create Sanity client
 */
function createSanityClient() {
  if (!config.token) {
    console.error('❌ SANITY_TOKEN is required for uploading images and creating documents.');
    console.error('   Get a token from: sanity.io/manage > Your Project > Settings > API > Tokens');
    console.error('   Then run: SANITY_TOKEN=your-token node scripts/migrate.js');
    process.exit(1);
  }

  if (config.projectId === 'YOUR_PROJECT_ID') {
    console.error('❌ SANITY_PROJECT_ID is required.');
    console.error('   Set it: SANITY_PROJECT_ID=your-project-id SANITY_TOKEN=your-token node scripts/migrate.js');
    process.exit(1);
  }

  return createClient(config);
}

/**
 * Parse the CSV file
 */
function parseCSV() {
  console.log('📄 Reading CSV file...');

  if (!existsSync(CSV_PATH)) {
    console.error(`❌ CSV file not found: ${CSV_PATH}`);
    process.exit(1);
  }

  const csvContent = readFileSync(CSV_PATH, 'utf-8');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true, // Handle UTF-8 BOM
  });

  console.log(`   Found ${records.length} projects in CSV`);
  return records;
}

/**
 * Get images from a folder
 */
function getImagesFromFolder(folderName) {
  if (!folderName) return [];

  const folderPath = path.join(PICTURES_PATH, folderName);

  if (!existsSync(folderPath)) {
    console.warn(`   ⚠️  Folder not found: ${folderName}`);
    return [];
  }

  const files = readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => path.join(folderPath, file));

  return files;
}

/**
 * Upload an image to Sanity
 */
async function uploadImage(client, imagePath, altText = '') {
  const fileName = path.basename(imagePath);
  console.log(`   📷 Uploading: ${fileName}`);

  try {
    const imageAsset = await client.assets.upload('image', createReadStream(imagePath), {
      filename: fileName,
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
      alt: altText || fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    };
  } catch (error) {
    console.error(`   ❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

/**
 * Create a slug from project name
 */
function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')  // Remove apostrophes
    .replace(/\s+/g, '-')   // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters
    .replace(/--+/g, '-')   // Replace multiple hyphens with single
    .replace(/^-+/, '')     // Remove leading hyphens
    .replace(/-+$/, '');    // Remove trailing hyphens
}

/**
 * Parse category from CSV (it's stored as JSON array)
 */
function parseCategory(categoryStr) {
  try {
    // Category is stored as ["Residential"] in CSV
    const parsed = JSON.parse(categoryStr);
    return Array.isArray(parsed) ? parsed[0] : categoryStr;
  } catch {
    return categoryStr;
  }
}

/**
 * Parse status from CSV
 */
function parseStatus(statusStr) {
  try {
    const parsed = JSON.parse(statusStr);
    return Array.isArray(parsed) ? parsed[0] : statusStr;
  } catch {
    return statusStr || 'Design';
  }
}

// ===========================================
// MAIN MIGRATION FUNCTION
// ===========================================

async function migrate() {
  console.log('🚀 Starting migration...\n');

  // Create Sanity client
  const client = createSanityClient();
  console.log(`✅ Connected to Sanity project: ${config.projectId}\n`);

  // Parse CSV
  const projects = parseCSV();
  console.log('');

  // Process each project
  for (let i = 0; i < projects.length; i++) {
    const csvProject = projects[i];
    const projectName = csvProject['Project Name'].trim();

    console.log(`\n📦 Processing (${i + 1}/${projects.length}): ${projectName}`);
    console.log('─'.repeat(50));

    // Find the folder for this project
    const folderName = folderMapping[projectName] || folderMapping[csvProject['Project Name']];

    // Get local images
    const localImages = getImagesFromFolder(folderName);
    console.log(`   Found ${localImages.length} local images`);

    // Upload main image (first image in folder, or skip if none)
    let mainImage = null;
    let galleryImages = [];

    if (localImages.length > 0) {
      // Upload main image (use first image)
      mainImage = await uploadImage(client, localImages[0], `${projectName} - Main`);

      // Upload remaining images as gallery
      if (localImages.length > 1) {
        console.log(`   Uploading ${localImages.length - 1} gallery images...`);
        for (let j = 1; j < localImages.length; j++) {
          const galleryImage = await uploadImage(
            client,
            localImages[j],
            `${projectName} - ${j + 1}`
          );
          if (galleryImage) {
            galleryImages.push(galleryImage);
          }
        }
      }
    } else {
      console.log('   ⚠️  No local images found, skipping image upload');
    }

    // Parse CSV data
    const category = parseCategory(csvProject['Category']);
    const status = parseStatus(csvProject['Status']);
    const sortingNumber = parseInt(csvProject['Sorting Number']) || 99;
    const featured = csvProject['Featured'] === 'true';

    // Create the project document
    const projectDoc = {
      _type: 'project',
      name: projectName,
      slug: {
        _type: 'slug',
        current: createSlug(projectName),
      },
      description: csvProject['Project Description'] || '',
      category: category,
      status: status,
      location: csvProject['Location'] || 'Ghana',
      period: csvProject['Period'] || new Date().getFullYear().toString(),
      featured: featured,
      sortingNumber: sortingNumber,
    };

    // Add images if uploaded
    if (mainImage) {
      projectDoc.mainImage = mainImage;
    }

    if (galleryImages.length > 0) {
      projectDoc.projectImages = galleryImages;
    }

    // Create the document in Sanity
    try {
      const result = await client.create(projectDoc);
      console.log(`   ✅ Created project: ${result._id}`);
    } catch (error) {
      console.error(`   ❌ Failed to create project:`, error.message);
    }
  }

  // Create site settings document
  console.log('\n📝 Creating site settings...');
  try {
    const siteSettings = {
      _type: 'siteSettings',
      _id: 'siteSettings', // Singleton pattern
      siteName: 'Kwabena Oppong-Peprah',
      siteDescription: 'Architectural portfolio of Kwabena Oppong-Peprah, featuring residential, social, recreational, and religious projects in Ghana.',
      copyrightText: 'Kwabena Oppong-Peprah',
      phone: '+233 244695644',
      email: 'kwabena.oppong.peprah@gmail.com',
    };

    await client.createOrReplace(siteSettings);
    console.log('   ✅ Site settings created');
  } catch (error) {
    console.error('   ❌ Failed to create site settings:', error.message);
  }

  console.log('\n🎉 Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run dev" in the sanity folder to open Sanity Studio');
  console.log('2. Review and edit your projects in the Studio');
  console.log('3. Update the main app .env.local with your Sanity project ID');
}

// ===========================================
// RUN MIGRATION
// ===========================================

migrate().catch(console.error);
