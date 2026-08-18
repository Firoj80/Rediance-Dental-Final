import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

async function uploadToBlob(filePath, relativePath) {
  const content = fs.readFileSync(filePath);
  // Upload to Vercel Blob
  const blob = await put(relativePath, content, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN, // Requires token in .env
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log(`Uploaded ${relativePath} to ${blob.url}`);
  return blob.url;
}

async function scanAndUploadDir(dir, baseDir) {
  const files = fs.readdirSync(dir);
  const uploadedMap = {}; // { originalPath: newBlobUrl }

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const nested = await scanAndUploadDir(fullPath, baseDir);
      Object.assign(uploadedMap, nested);
    } else {
      // relativePath like "hero-image.webp" or "service/img.jpg"
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const blobUrl = await uploadToBlob(fullPath, relativePath);
      
      // key by the old URL format e.g., "/uploads/hero-image.webp"
      uploadedMap[`/uploads/${relativePath}`] = blobUrl;
    }
  }
  
  return uploadedMap;
}

async function migrateDatabase(uploadedMap) {
  console.log("\nStarting Database Migration...");

  // Update Services
  const services = await prisma.service.findMany();
  for (const service of services) {
    if (service.image && uploadedMap[service.image]) {
      await prisma.service.update({
        where: { id: service.id },
        data: { image: uploadedMap[service.image] }
      });
      console.log(`Updated Service "${service.title}" with new image URL.`);
    }
  }

  // Update Blogs
  const blogs = await prisma.blogPost.findMany();
  for (const blog of blogs) {
    if (blog.featuredImage && uploadedMap[blog.featuredImage]) {
      await prisma.blogPost.update({
        where: { id: blog.id },
        data: { featuredImage: uploadedMap[blog.featuredImage] }
      });
      console.log(`Updated BlogPost "${blog.title}" with new image URL.`);
    }
  }

  // Update Gallery
  const galleryItems = await prisma.galleryImage.findMany();
  for (const item of galleryItems) {
    if (item.image && uploadedMap[item.image]) {
      await prisma.galleryImage.update({
        where: { id: item.id },
        data: { image: uploadedMap[item.image] }
      });
      console.log(`Updated Gallery Image with new image URL.`);
    }
  }

  console.log("Database Migration Complete!");
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("ERROR: BLOB_READ_WRITE_TOKEN is missing in your .env file!");
    process.exit(1);
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error(`ERROR: Uploads directory not found at ${UPLOADS_DIR}`);
    process.exit(1);
  }

  console.log("Starting Migration to Vercel Blob...");
  const uploadedMap = await scanAndUploadDir(UPLOADS_DIR, UPLOADS_DIR);
  
  console.log("\nFiles successfully uploaded:");
  console.log(JSON.stringify(uploadedMap, null, 2));

  // Run the database migration with the mapped URLs
  await migrateDatabase(uploadedMap);

  console.log("\nMigration to Vercel Blob finished successfully!");
  console.log("NOTE: You will need to manually update any hardcoded paths in your frontend files (like shared.tsx).");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
