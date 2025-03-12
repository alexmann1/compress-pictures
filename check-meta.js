import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract metadata from HTML
function extractMetadata(htmlContent) {
  const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'No title found';
  
  const metaTags = [];
  const metaRegex = /<meta[^>]*name=["']([^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi;
  let match;
  
  while ((match = metaRegex.exec(htmlContent)) !== null) {
    metaTags.push({ name: match[1], content: match[2] });
  }
  
  // Also check for og: meta tags
  const ogRegex = /<meta[^>]*property=["'](og:[^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi;
  while ((match = ogRegex.exec(htmlContent)) !== null) {
    metaTags.push({ name: match[1], content: match[2] });
  }
  
  return { title, metaTags };
}

// Function to get all HTML files recursively
function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      // Add HTML files to results
      results.push(filePath);
    }
  });
  
  return results;
}

// Check all HTML files in the dist directory and its subdirectories
const distDir = path.join(__dirname, 'dist');
const htmlFiles = getAllHtmlFiles(distDir);

htmlFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const metadata = extractMetadata(content);
  const relativePath = path.relative(distDir, filePath);
  
  console.log(`\n=== Metadata for ${relativePath} ===`);
  console.log(`Title: ${metadata.title}`);
  console.log('Meta tags:');
  metadata.metaTags.forEach(tag => {
    console.log(`  ${tag.name}: ${tag.content}`);
  });
});
