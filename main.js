import Alpine from 'alpinejs'
import router from './src/router'
window.alpine = Alpine
Alpine.data('router', router)
Alpine.start()
