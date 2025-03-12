// Post-build script to ensure SEO metadata is correctly applied to each HTML file
import fs from 'fs';
import path from 'path';

console.log('[Post-Build] Starting SEO metadata update process...');
console.log('[Post-Build] Node.js version:', process.version);
console.log('[Post-Build] Current directory:', process.cwd());

// Warn about older Node.js versions
const nodeVersion = process.version.substring(1).split('.').map(Number);
if (nodeVersion[0] < 14) {
  console.warn('[Post-Build] Warning: You are using an older version of Node.js which may not support all the features used in this script.');
}

// Define metadata for each page
const pagesMetadata = {
  'index.html': {
    title: 'Free Online Image Resizer/Compression - High-Quality & Fast',
    description: 'Instantly reduce your image file size, effortlessly adapt them for any social media platform, and quickly convert between image formats.',
    keywords: 'image optimizer, image compression, image converter, compress jpeg, compress png, compress webp, compress gif, compress svg, free image tool, online image compression',
    canonical: 'https://compresspictures.com',
    ogImage: 'https://compresspictures.com/logo.png'
  },
  'privacy.html': {
    title: 'Privacy Policy - CompressPictures.com',
    description: 'Privacy Policy for CompressPictures.com - Learn how we handle your data and protect your privacy.',
    keywords: 'privacy policy, data protection, image optimizer privacy, user data, cookies policy',
    canonical: 'https://compresspictures.com/privacy',
    ogImage: 'https://compresspictures.com/logo.png'
  },
  'terms.html': {
    title: 'Terms of Service - CompressPictures.com',
    description: 'Terms of Service for CompressPictures.com - Understand the rules and conditions for using our image optimization services.',
    keywords: 'terms of service, terms and conditions, user agreement, service terms, legal terms',
    canonical: 'https://compresspictures.com/terms',
    ogImage: 'https://compresspictures.com/logo.png'
  },
  'faq.html': {
    title: 'FAQ - CompressPictures.com',
    description: 'Frequently Asked Questions about our image optimization services.',
    keywords: 'image optimizer faq, compress pictures help, image compression questions, frequently asked questions',
    canonical: 'https://compresspictures.com/faq',
    ogImage: 'https://compresspictures.com/logo.png'
  },
  'features.html': {
    title: 'Features - CompressPictures.com',
    description: 'Explore the features of our free image optimization service.',
    keywords: 'image optimizer features, compress pictures features, image compression options, free image tools',
    canonical: 'https://compresspictures.com/features',
    ogImage: 'https://compresspictures.com/logo.png'
  }
};

// Make sure dist directory exists
const distDir = path.resolve('./dist');
if (!fs.existsSync(distDir)) {
  console.error(`[Post-Build] Error: The dist directory does not exist at: ${distDir}`);
  process.exit(1);
}

// List all files in the dist directory
console.log('[Post-Build] Files in dist directory:');
try {
  const files = fs.readdirSync(distDir);
  files.forEach(file => console.log(`  - ${file}`));
} catch (error) {
  console.error('[Post-Build] Error listing files:', error);
}

// Process each HTML file
const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));

// Log the HTML files we found
console.log(`[Post-Build] Found ${htmlFiles.length} HTML files for processing: ${htmlFiles.join(', ')}`);

// Function to safely update file content
function updateFileContent(filePath, metadata) {
  try {
    console.log(`[Post-Build] Updating metadata for file: ${filePath}`);
    
    // Read the HTML file
    let html = fs.readFileSync(filePath, 'utf8');
    console.log(`[Post-Build] Successfully read file, size: ${html.length} bytes`);
    
    // Make a backup of the original file
    const backupPath = `${filePath}.bak`;
    fs.writeFileSync(backupPath, html, 'utf8');
    console.log(`[Post-Build] Created backup at: ${backupPath}`);
    
    // For very simple HTML pages, use a more direct approach
    // Create a new HTML file from scratch with the correct metadata
    const [docType, ...rest] = html.split('<head>');
    if (!rest || rest.length === 0) {
      console.error(`[Post-Build] Error: Could not find <head> tag in ${filePath}`);
      return false;
    }
    
    const [_, ...bodyAndRest] = rest[0].split('</head>');
    if (!bodyAndRest || bodyAndRest.length === 0) {
      console.error(`[Post-Build] Error: Could not find closing </head> tag in ${filePath}`);
      return false;
    }
    
    // Essential tags to preserve from the original head
    const preservedTags = [];
    
    // Extract the Google Analytics/Tag Manager script if present
    const googleTagMatch = html.match(/<script async="" src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"><\/script><script>[^<]+<\/script>/);
    if (googleTagMatch) {
      preservedTags.push(googleTagMatch[0]);
    }
    
    // Extract charset tag
    const charsetMatch = html.match(/<meta charset="[^"]+">/);
    if (charsetMatch) {
      preservedTags.push(charsetMatch[0]);
    }
    
    // Extract favicon
    const faviconMatch = html.match(/<link rel="icon"[^>]+>/);
    if (faviconMatch) {
      preservedTags.push(faviconMatch[0]);
    }
    
    // Extract viewport tag
    const viewportMatch = html.match(/<meta name="viewport"[^>]+>/);
    if (viewportMatch) {
      preservedTags.push(viewportMatch[0]);
    }
    
    // Our SEO meta tags
    const seoTags = `
<title>${metadata.title}</title>
<meta name="description" content="${metadata.description}">
<meta name="keywords" content="${metadata.keywords}">
<meta name="author" content="CompressPictures.com">
<meta property="og:title" content="${metadata.title}">
<meta property="og:description" content="${metadata.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${metadata.canonical}">
<meta property="og:image" content="${metadata.ogImage}">
<meta property="og:site_name" content="CompressPictures.com">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${metadata.title}">
<meta name="twitter:description" content="${metadata.description}">
<meta name="twitter:image" content="${metadata.ogImage}">
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow">
<link rel="canonical" href="${metadata.canonical}">`;
    
    // Construct the head section with preserved tags and our SEO tags
    const newHead = '<head>' + preservedTags.join('') + seoTags;
    
    // Extract the CSS/JS links
    const cssJsMatches = html.match(/<link rel="(stylesheet|modulepreload)"[^>]+>|<script type="module"[^>]+><\/script>/g) || [];
    const cssJsTags = cssJsMatches.join('');
    
    // Complete the head section with CSS/JS links
    const completeHead = newHead + cssJsTags + '</head>';
    
    // Construct the final HTML
    const newHtml = docType + completeHead + bodyAndRest.join('</head>');
    
    // Write the new HTML to the file
    fs.writeFileSync(filePath, newHtml, 'utf8');
    console.log(`[Post-Build] Successfully generated new HTML file for ${filePath}`);
    
    // Double check that the update worked
    const updatedContent = fs.readFileSync(filePath, 'utf8');
    const titleCheck = updatedContent.includes(`<title>${metadata.title}</title>`);
    const descriptionCheck = updatedContent.includes(`<meta name="description" content="${metadata.description}">`);
    
    if (titleCheck && descriptionCheck) {
      console.log(`[Post-Build] Verified title and description updates for ${filePath}`);
      return true;
    } else {
      console.error(`[Post-Build] Verification failed for ${filePath}`);
      console.error(`  - Title check: ${titleCheck}`);
      console.error(`  - Description check: ${descriptionCheck}`);
      
      // Alternative method as fallback
      console.log(`[Post-Build] Trying alternative approach...`);
      
      // Create a simple regex replacement for the title
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${metadata.title}</title>`);
      
      // Add meta description right after title if it doesn't exist
      if (!html.includes('<meta name="description"')) {
        html = html.replace(/<\/title>/, `</title>\n<meta name="description" content="${metadata.description}">`);
      } else {
        html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${metadata.description}">`);
      }
      
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`[Post-Build] Applied fallback method for ${filePath}`);
      
      // Check if the fallback worked
      const fallbackContent = fs.readFileSync(filePath, 'utf8');
      return fallbackContent.includes(`<title>${metadata.title}</title>`);
    }
  } catch (error) {
    console.error(`[Post-Build] Error processing ${filePath}:`, error);
    console.error(`[Post-Build] Detailed error: ${error.stack}`);
    return false;
  }
}

// Process each HTML file
let successCount = 0;
let failCount = 0;

for (const htmlFile of htmlFiles) {
  const metadata = pagesMetadata[htmlFile];
  
  if (!metadata) {
    console.log(`[Post-Build] No metadata defined for ${htmlFile}, skipping...`);
    continue;
  }
  
  const filePath = path.join(distDir, htmlFile);
  const success = updateFileContent(filePath, metadata);
  
  if (success) {
    successCount++;
  } else {
    failCount++;
  }
}

// Create clean URL directories for key pages and copy the HTML files
console.log('[Post-Build] Creating clean URL structure for SEO-friendly URLs...');

// Mapping of HTML files to directory names (for clean URLs)
const cleanUrlMap = {
  'privacy.html': 'privacy',
  'terms.html': 'terms',
  'features.html': 'features'
};

// Create clean URL directories and copy HTML files
for (const [htmlFile, dirName] of Object.entries(cleanUrlMap)) {
  try {
    const sourceFile = path.join(distDir, htmlFile);
    if (!fs.existsSync(sourceFile)) {
      console.warn(`[Post-Build] Source file ${sourceFile} does not exist, skipping clean URL creation.`);
      continue;
    }
    
    // Create directory if it doesn't exist
    const targetDir = path.join(distDir, dirName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy the HTML file to the directory as index.html
    const targetFile = path.join(targetDir, 'index.html');
    fs.copyFileSync(sourceFile, targetFile);
    
    console.log(`[Post-Build] Created clean URL: /${dirName}/ -> copied ${htmlFile} to ${targetFile}`);
    
    // Update metadata for the new index.html file
    const newFilePath = path.join(targetDir, 'index.html');
    const newMetadata = pagesMetadata[htmlFile];
    const newSuccess = updateFileContent(newFilePath, newMetadata);
    
    if (newSuccess) {
      successCount++;
    } else {
      failCount++;
    }
  } catch (error) {
    console.error(`[Post-Build] Error creating clean URL for ${htmlFile}:`, error);
  }
}

console.log(`[Post-Build] SEO metadata update complete! Success: ${successCount}, Failed: ${failCount}`);

// If any updates failed, exit with an error code
if (failCount > 0) {
  console.error(`[Post-Build] Warning: ${failCount} file(s) failed to update properly.`);
  process.exit(1);
}
