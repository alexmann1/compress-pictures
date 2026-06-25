# CompressPictures.com

A free, privacy-focused online tool for compressing, resizing, and converting images. All processing happens **entirely in the browser** — images are never uploaded to a server, so they never leave the user's device.

Live at [compresspictures.com](https://compresspictures.com).

## Features

- **Compress** — reduce image file size with adjustable quality, ideal for web and social media.
- **Format** — crop and reformat images to common aspect ratios/presets.
- **Convert** — change between image formats (JPEG, PNG, WebP, GIF, SVG).
- **Resize** — scale images down by dimensions while previewing the result.
- **Before/after compare** — see original vs. optimized side by side.
- **Privacy by design** — all work is done client-side via the Canvas API; nothing is sent anywhere.
- **Dark mode** and a cookie/consent banner with Google Consent Mode v2.

## Tech Stack

- **[Vue 3](https://vuejs.org/)** (`<script setup>` SFCs)
- **[Vite](https://vite.dev/)** for dev/build tooling
- **[vite-ssg](https://github.com/antfu/vite-ssg)** — static site generation; every route is pre-rendered to HTML for SEO
- **[Vue Router](https://router.vuejs.org/)** for routing
- **[@vueuse/head](https://github.com/vueuse/head)** for per-page meta tags
- **[Tailwind CSS](https://tailwindcss.com/)** (with PostCSS + Autoprefixer) for styling
- **[Font Awesome](https://fontawesome.com/)** for icons
- **[browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)** — client-side image compression helper

Image transformation itself is handled in the browser using the native Canvas API (`canvas.toDataURL` / `toBlob`).

## Project Structure

```
src/
  main.js          # App entry — ViteSSG setup, head/SEO, Google Consent Mode v2
  router.js        # Routes + per-route SEO meta
  App.vue          # Root layout
  pages/           # Home, About, PrivacyPolicy, TermsOfService
  components/
    FeatureTabs.vue       # Compress / Format / Convert tab switcher
    ImageUploader.vue     # Drag-and-drop + file picker
    ImageControls.vue     # Compression controls & canvas processing
    ImageFormatMode.vue   # Crop / aspect-ratio formatting
    ImageConvertMode.vue  # Format conversion
    ImageResizeMode.vue   # Dimension resizing
    ImageCompare.vue      # Before/after preview
    ImagePreview.vue
    CookieConsent.vue / ConsentBanner.vue  # Consent UI
    ThemeToggle.vue       # Dark mode
    Footer.vue, PageMeta.vue, ContentSection.vue
public/            # Static assets, sitemap.xml, ads.txt
post-build.js      # Injects per-page SEO metadata into generated HTML
nginx.conf         # Production server config
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production (static site + SEO post-processing)
npm run build

# Preview the production build locally
npm run preview
```

The build runs `vite-ssg build` to pre-render all routes, then `node post-build.js` to apply per-page SEO metadata to the generated HTML files. Output goes to `dist/`.

## Deployment

Deploys are automated via GitHub Actions (`.github/workflows/main.yml`):

1. On push to `main`, the workflow installs deps and runs `npm run build`.
2. The `dist/` folder is zipped and copied to an Azure VM over SSH/SCP.
3. The VM unzips it and swaps it into the live `www` directory.

The site is served by **nginx** (`nginx.conf`), which handles clean URLs, static-asset caching, security headers, and SPA fallback routing.

## Privacy

No image data is transmitted to any server — every operation runs locally in the visitor's browser. Analytics load only after consent (Google Consent Mode v2 defaults all storage to `denied`). See the in-app Privacy Policy for details.
