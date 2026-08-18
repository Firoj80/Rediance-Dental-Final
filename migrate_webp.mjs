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
  const blob = await put(relativePath, content, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log(`Uploaded ${relativePath} to ${blob.url}`);
  return blob.url;
}

async function scanAndUploadDir(dir, baseDir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await scanAndUploadDir(fullPath, baseDir);
    } else {
      if (fullPath.endsWith('.webp')) {
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        await uploadToBlob(fullPath, relativePath);
      }
    }
  }
}

async function migrateDatabase() {
  console.log("\nStarting Database Migration...");

  // Update Services
  const services = await prisma.service.findMany();
  for (const service of services) {
    if (service.image && (service.image.endsWith('.jpg') || service.image.endsWith('.jfif') || service.image.endsWith('.png'))) {
      const newUrl = service.image.replace(/\.(jpg|jpeg|png|jfif)$/i, '.webp');
      await prisma.service.update({
        where: { id: service.id },
        data: { image: newUrl }
      });
      console.log(`Updated Service "${service.title}" with new image URL: ${newUrl}`);
    }
  }

  // Update Blogs
  const blogs = await prisma.blogPost.findMany();
  for (const blog of blogs) {
    if (blog.featuredImage && (blog.featuredImage.endsWith('.jpg') || blog.featuredImage.endsWith('.jfif') || blog.featuredImage.endsWith('.png'))) {
      const newUrl = blog.featuredImage.replace(/\.(jpg|jpeg|png|jfif)$/i, '.webp');
      await prisma.blogPost.update({
        where: { id: blog.id },
        data: { featuredImage: newUrl }
      });
      console.log(`Updated BlogPost "${blog.title}" with new image URL: ${newUrl}`);
    }
  }

  // Update Gallery
  const galleryItems = await prisma.galleryImage.findMany();
  for (const item of galleryItems) {
    if (item.image && (item.image.endsWith('.jpg') || item.image.endsWith('.jfif') || item.image.endsWith('.png'))) {
      const newUrl = item.image.replace(/\.(jpg|jpeg|png|jfif)$/i, '.webp');
      await prisma.galleryImage.update({
        where: { id: item.id },
        data: { image: newUrl }
      });
      console.log(`Updated Gallery Image with new image URL: ${newUrl}`);
    }
  }

  console.log("Database Migration Complete!");
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("ERROR: BLOB_READ_WRITE_TOKEN is missing in your .env file!");
    process.exit(1);
  }

  console.log("Uploading .webp files to Vercel Blob...");
  await scanAndUploadDir(UPLOADS_DIR, UPLOADS_DIR);

  await migrateDatabase();

  console.log("\nMigration to WebP finished successfully!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
