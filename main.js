import Alpine from 'alpinejs'
import router from './src/router';

window.Alpine = Alpine;

Alpine.data('router', router)

Alpine.start();
