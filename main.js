import Alpine from 'alpinejs'
import router from './src/router';
// import app from '/src/tes';
window.Alpine = Alpine;

// window.app = app;


// window.onload = app.init
Alpine.data('router', router)
// Alpine.data('appws', appws)
Alpine.start();
