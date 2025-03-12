import { ViteSSG } from 'vite-ssg'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import { routes } from './router'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes },
  // function to have custom setups
  ({ app, router, routes, isClient, initialState }) => {
    // Create head management
    const head = createHead()
    app.use(head)

    // Set up meta tags for each route using the meta information
    router.beforeEach((to, from, next) => {
      // Get the route's meta information (or use defaults if not available)
      const meta = to.meta || {
        title: 'Free Online Image Resizer/Compression - High-Quality & Fast',
        description: 'A free web app to optimize and compress your images',
        keywords: 'image optimizer, image compression, image converter, compress jpeg, compress png, compress webp',
        author: 'CompressPictures.com'
      }

      // Update head with route-specific metadata
      head.updateDOM({
        title: meta.title,
        meta: [
          {
            name: 'description',
            content: meta.description
          },
          {
            name: 'keywords',
            content: meta.keywords
          },
          {
            name: 'author',
            content: meta.author
          },
          // Open Graph tags for social sharing
          {
            property: 'og:title',
            content: meta.title
          },
          {
            property: 'og:description',
            content: meta.description
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:url',
            content: `https://compresspictures.com${to.path}`
          },
          // Twitter Card tags
          {
            name: 'twitter:card',
            content: 'summary'
          },
          {
            name: 'twitter:title',
            content: meta.title
          },
          {
            name: 'twitter:description',
            content: meta.description
          }
        ]
      })

      next()
    })
  },
)