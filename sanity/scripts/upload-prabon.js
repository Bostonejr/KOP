/**
 * Upload Prabon Greenfields Model_E images to Sanity
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { createReadStream, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '8oeu02kt',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const PRABON_FOLDER = path.join(__dirname, '..', '..', 'assets', 'pictures', 'Prabon Greenfields Model_E');

async function uploadImage(imagePath, altText = '') {
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

async function main() {
  console.log('🚀 Uploading Prabon Greenfields Model_E images...\n');

  // Get all images from the folder
  const files = readdirSync(PRABON_FOLDER)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => path.join(PRABON_FOLDER, file));

  console.log(`Found ${files.length} images`);

  // Find the main image
  const mainImagePath = files.find(f => f.toLowerCase().includes('main image'));
  const otherImages = files.filter(f => !f.toLowerCase().includes('main image'));

  // Upload main image
  let mainImage = null;
  if (mainImagePath) {
    console.log('\nUploading main image...');
    mainImage = await uploadImage(mainImagePath, 'Prabon Greenfields Model_E - Main');
  }

  // Upload gallery images
  const galleryImages = [];
  console.log('\nUploading gallery images...');
  for (let i = 0; i < otherImages.length; i++) {
    const img = await uploadImage(otherImages[i], `Prabon Greenfields Model_E - ${i + 1}`);
    if (img) galleryImages.push(img);
  }

  // Find the existing Prabon project
  console.log('\nFinding Prabon Greenfields project...');
  const project = await client.fetch(
    `*[_type == "project" && name match "Prabon*"][0]`
  );

  if (!project) {
    console.error('❌ Prabon Greenfields project not found in Sanity');
    return;
  }

  console.log(`Found project: ${project.name} (${project._id})`);

  // Update the project with images
  const updates = {};
  if (mainImage) {
    updates.mainImage = mainImage;
  }
  if (galleryImages.length > 0) {
    updates.projectImages = galleryImages;
  }

  if (Object.keys(updates).length > 0) {
    await client.patch(project._id).set(updates).commit();
    console.log('\n✅ Project updated with images!');
  }

  console.log('\n🎉 Done!');
}

main().catch(console.error);
