import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css'

// Create and mount the app
const app = createApp(App)
app.use(router)
app.mount('#app')
