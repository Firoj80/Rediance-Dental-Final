const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function convertToWebp(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await convertToWebp(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.jfif') {
        const newPath = fullPath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
        console.log(`Converting ${fullPath} to ${newPath}`);
        try {
          await sharp(fullPath).webp().toFile(newPath);
          fs.unlinkSync(fullPath); // Delete the old file
          console.log(`Successfully converted and deleted ${fullPath}`);
        } catch (err) {
          console.error(`Error converting ${fullPath}:`, err);
        }
      }
    }
  }
}

convertToWebp(uploadsDir).then(() => {
  console.log('Conversion complete');
}).catch(console.error);
