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
    // install plugins etc.
    const head = createHead()
    app.use(head)
  },
)