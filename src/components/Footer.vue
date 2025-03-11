<template>
      <footer class="py-8 mt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Logo and tagline -->
            <div class="md:col-span-1">
              <h3 class="text-md font-bold text-gray-800 dark:text-gray-200 mb-3">
                <i class="fas fa-image mr-2"></i> CompressPictures.com
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Free online tool for optimizing your images without sacrificing quality.
              </p>
            </div>

            <div class="md:col-span-1"></div>
            
            <!-- Quick links -->
            <div class="md:col-span-1">
              <h4 class="text-sm font-semibold uppercase text-gray-600 dark:text-gray-300 mb-4">Features</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#features" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Image Compression</a></li>
                <li><a href="#features" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Format & Resize</a></li>
                <li><a href="#features" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Format Conversion</a></li>
              </ul>
            </div>
            
            <!-- Resources -->
            <div class="md:col-span-1">
              <h4 class="text-sm font-semibold uppercase text-gray-600 dark:text-gray-300 mb-4">Resources</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#faq" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">FAQ</a></li>
                <li><router-link to="/privacy" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Privacy Policy</router-link></li>
                <li><router-link to="/terms" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Terms of Service</router-link></li>
              </ul>
            </div>
            
            <!-- Social 
            <div class="md:col-span-1">
              <h4 class="text-sm font-semibold uppercase text-gray-600 dark:text-gray-300 mb-4">Connect</h4>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <i class="fab fa-twitter text-lg"></i>
                </a>
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <i class="fab fa-github text-lg"></i>
                </a>
                <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <i class="fab fa-linkedin text-lg"></i>
                </a>
              </div>
            </div>-->
          </div>
          
          <!-- Copyright -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {{ new Date().getFullYear() }} CompressPictures.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
  </template> 