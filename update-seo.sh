#!/bin/bash

echo "[SEO] Updating metadata in static HTML files..."

# Detect the OS to use the appropriate sed syntax
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  SED_CMD="sed -i ''"
else
  # Linux and others
  SED_CMD="sed -i"
fi

# Update index.html (Home page)
$SED_CMD 's|<title>[^<]*</title>|<title>Free Online Image Resizer/Compression - High-Quality \& Fast</title>|g' dist/index.html
$SED_CMD 's|<meta name="description" content="[^"]*"|<meta name="description" content="Instantly reduce your image file size, effortlessly adapt them for any social media platform, and quickly convert between image formats."|g' dist/index.html
$SED_CMD 's|<meta name="keywords" content="[^"]*"|<meta name="keywords" content="image optimizer, image compression, image converter, compress jpeg, compress png, compress webp, compress gif, compress svg, free image tool, online image compression"|g' dist/index.html

# Update privacy.html
$SED_CMD 's|<title>[^<]*</title>|<title>Privacy Policy - CompressPictures.com</title>|g' dist/privacy.html
$SED_CMD 's|<meta name="description" content="[^"]*"|<meta name="description" content="Privacy Policy for CompressPictures.com - Learn how we handle your data and protect your privacy."|g' dist/privacy.html
$SED_CMD 's|<meta name="keywords" content="[^"]*"|<meta name="keywords" content="privacy policy, data protection, image optimizer privacy, user data, cookies policy"|g' dist/privacy.html

# Update terms.html
$SED_CMD 's|<title>[^<]*</title>|<title>Terms of Service - CompressPictures.com</title>|g' dist/terms.html
$SED_CMD 's|<meta name="description" content="[^"]*"|<meta name="description" content="Terms of Service for CompressPictures.com - Understand the rules and conditions for using our image optimization services."|g' dist/terms.html
$SED_CMD 's|<meta name="keywords" content="[^"]*"|<meta name="keywords" content="terms of service, terms and conditions, user agreement, service terms, legal terms"|g' dist/terms.html

# Update faq.html
$SED_CMD 's|<title>[^<]*</title>|<title>FAQ - CompressPictures.com</title>|g' dist/faq.html
$SED_CMD 's|<meta name="description" content="[^"]*"|<meta name="description" content="Frequently Asked Questions about our image optimization services."|g' dist/faq.html
$SED_CMD 's|<meta name="keywords" content="[^"]*"|<meta name="keywords" content="image optimizer faq, compress pictures help, image compression questions, frequently asked questions"|g' dist/faq.html

# Update features.html
$SED_CMD 's|<title>[^<]*</title>|<title>Features - CompressPictures.com</title>|g' dist/features.html
$SED_CMD 's|<meta name="description" content="[^"]*"|<meta name="description" content="Explore the features of our free image optimization service."|g' dist/features.html
$SED_CMD 's|<meta name="keywords" content="[^"]*"|<meta name="keywords" content="image optimizer features, compress pictures features, image compression options, free image tools"|g' dist/features.html

# Add author meta tag if it doesn't exist
for file in dist/*.html; do
  if ! grep -q '<meta name="author"' "$file"; then
    $SED_CMD 's|</head>|  <meta name="author" content="CompressPictures.com">\n  </head>|g' "$file"
  fi
done

echo "[SEO] Metadata update complete!"
