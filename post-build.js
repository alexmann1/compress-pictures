// Post-build script to ensure SEO metadata is correctly applied to each HTML file
import fs from 'fs';
import path from 'path';

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

// Script execution starts here
console.log('[Post-Build] Updating SEO metadata in HTML files...');

const distDir = path.resolve('./dist');
const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));

for (const htmlFile of htmlFiles) {
  const metadata = pagesMetadata[htmlFile];
  
  if (!metadata) {
    console.log(`[Post-Build] No metadata defined for ${htmlFile}, skipping...`);
    continue;
  }
  
  const filePath = path.join(distDir, htmlFile);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Replace title tag
  html = html.replace(/<title>.*?<\/title>/, `<title>${metadata.title}</title>`);
  
  // Replace or add meta description
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${metadata.description}"`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${metadata.description}">\n  </head>`);
  }
  
  // Replace or add meta keywords
  if (html.includes('<meta name="keywords"')) {
    html = html.replace(/<meta name="keywords" content=".*?"/, `<meta name="keywords" content="${metadata.keywords}"`);
  } else {
    html = html.replace('</head>', `  <meta name="keywords" content="${metadata.keywords}">\n  </head>`);
  }
  
  // Replace or add meta author
  if (html.includes('<meta name="author"')) {
    html = html.replace(/<meta name="author" content=".*?"/, `<meta name="author" content="CompressPictures.com"`);
  } else {
    html = html.replace('</head>', `  <meta name="author" content="CompressPictures.com">\n  </head>`);
  }
  
  // Add OpenGraph meta tags
  if (!html.includes('<meta property="og:title"')) {
    html = html.replace('</head>', `  <meta property="og:title" content="${metadata.title}">\n  </head>`);
  }
  
  if (!html.includes('<meta property="og:description"')) {
    html = html.replace('</head>', `  <meta property="og:description" content="${metadata.description}">\n  </head>`);
  }
  
  if (!html.includes('<meta property="og:type"')) {
    html = html.replace('</head>', `  <meta property="og:type" content="website">\n  </head>`);
  }
  
  if (!html.includes('<meta property="og:url"')) {
    html = html.replace('</head>', `  <meta property="og:url" content="${metadata.canonical}">\n  </head>`);
  }
  
  if (!html.includes('<meta property="og:image"')) {
    html = html.replace('</head>', `  <meta property="og:image" content="${metadata.ogImage}">\n  </head>`);
  }
  
  if (!html.includes('<meta property="og:site_name"')) {
    html = html.replace('</head>', `  <meta property="og:site_name" content="CompressPictures.com">\n  </head>`);
  }
  
  // Add Twitter Card meta tags
  if (!html.includes('<meta name="twitter:card"')) {
    html = html.replace('</head>', `  <meta name="twitter:card" content="summary">\n  </head>`);
  }
  
  if (!html.includes('<meta name="twitter:title"')) {
    html = html.replace('</head>', `  <meta name="twitter:title" content="${metadata.title}">\n  </head>`);
  }
  
  if (!html.includes('<meta name="twitter:description"')) {
    html = html.replace('</head>', `  <meta name="twitter:description" content="${metadata.description}">\n  </head>`);
  }
  
  if (!html.includes('<meta name="twitter:image"')) {
    html = html.replace('</head>', `  <meta name="twitter:image" content="${metadata.ogImage}">\n  </head>`);
  }
  
  // Add SEO-related meta tags
  if (!html.includes('<meta name="robots"')) {
    html = html.replace('</head>', `  <meta name="robots" content="index, follow">\n  </head>`);
  }
  
  if (!html.includes('<meta name="googlebot"')) {
    html = html.replace('</head>', `  <meta name="googlebot" content="index, follow">\n  </head>`);
  }
  
  // Add canonical link
  if (!html.includes('<link rel="canonical"')) {
    html = html.replace('</head>', `  <link rel="canonical" href="${metadata.canonical}">\n  </head>`);
  }
  
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[Post-Build] Updated metadata for ${htmlFile}`);
}

console.log('[Post-Build] SEO metadata update complete!');
