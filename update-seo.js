// Script to update SEO metadata in built HTML files
import fs from 'fs';
import path from 'path';

// Define the metadata for each route
const routeMetadata = {
  '/': {
    title: 'Free Online Image Resizer/Compression - High-Quality & Fast',
    description: 'Instantly reduce your image file size, effortlessly adapt them for any social media platform, and quickly convert between image formats.',
    keywords: 'image optimizer, image compression, image converter, compress jpeg, compress png, compress webp, compress gif, compress svg, free image tool, online image compression'
  },
  '/privacy': {
    title: 'Privacy Policy - CompressPictures.com',
    description: 'Privacy Policy for CompressPictures.com - Learn how we handle your data and protect your privacy.',
    keywords: 'privacy policy, data protection, image optimizer privacy, user data, cookies policy'
  },
  '/terms': {
    title: 'Terms of Service - CompressPictures.com',
    description: 'Terms of Service for CompressPictures.com - Understand the rules and conditions for using our image optimization services.',
    keywords: 'terms of service, terms and conditions, user agreement, service terms, legal terms'
  },
  '/faq': {
    title: 'FAQ - CompressPictures.com',
    description: 'Frequently Asked Questions about our image optimization services.',
    keywords: 'image optimizer faq, compress pictures help, image compression questions, frequently asked questions'
  },
  '/features': {
    title: 'Features - CompressPictures.com',
    description: 'Explore the features of our free image optimization service.',
    keywords: 'image optimizer features, compress pictures features, image compression options, free image tools'
  }
};

console.log('[SEO] Updating metadata in static HTML files...');

// Process each HTML file and update its metadata
const processHtmlFile = (filePath, route) => {
  // Get metadata for the route
  const meta = routeMetadata[route] || routeMetadata['/'];
  
  try {
    // Read the HTML file
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Replace title
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${meta.title}</title>`
    );
    
    // Replace meta description
    html = html.replace(
      /<meta name="description" content=".*?"/,
      `<meta name="description" content="${meta.description}"`
    );
    
    // Replace meta keywords
    html = html.replace(
      /<meta name="keywords" content=".*?"/,
      `<meta name="keywords" content="${meta.keywords}"`
    );
    
    // Add author meta tag if it doesn't exist
    if (!html.includes('<meta name="author"')) {
      html = html.replace(
        '</head>',
        `  <meta name="author" content="CompressPictures.com">\n  </head>`
      );
    }
    
    // Write the updated HTML back to the file
    fs.writeFileSync(filePath, html);
    
    console.log(`[SEO] Updated metadata for ${route}`);
  } catch (error) {
    console.error(`[SEO] Error processing ${filePath}:`, error);
  }
};

// Map of file paths to routes - Updated to match Vite SSG file structure
const routeMap = {
  'dist/index.html': '/',
  'dist/privacy.html': '/privacy',
  'dist/terms.html': '/terms',
  'dist/faq.html': '/faq',
  'dist/features.html': '/features'
};

// Process each HTML file
for (const [filePath, route] of Object.entries(routeMap)) {
  if (fs.existsSync(filePath)) {
    processHtmlFile(filePath, route);
  } else {
    console.log(`[SEO] File not found: ${filePath}`);
  }
}

// Improve regex patterns
const improveRegexPatterns = () => {
  // Check all HTML files in dist folder
  const files = fs.readdirSync('dist');
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  
  console.log(`[SEO] Found ${htmlFiles.length} HTML files in dist folder`);
  
  // List files that weren't processed by the routeMap
  const processedFiles = Object.keys(routeMap).map(path => path.replace('dist/', ''));
  const unprocessedFiles = htmlFiles.filter(file => !processedFiles.includes(file));
  
  if (unprocessedFiles.length > 0) {
    console.log(`[SEO] Warning: The following HTML files were not processed: ${unprocessedFiles.join(', ')}`);
  }
};

improveRegexPatterns();

console.log('[SEO] Metadata update complete!');
