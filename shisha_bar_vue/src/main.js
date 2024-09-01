// Importarea modulelor necesare
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebase.mjs'

// Importarea componentei MySection
import MySection from './components/MySection.vue'

// Importarea stilurilor
import './assets/styles/style.scss'

// Crearea instanței aplicației
const app = createApp(App)

// Înregistrarea componentei MySection global
app.component('MySection', MySection)

// Utilizarea Vue Router și Vuex store
app.use(VueFire, { firebaseApp })
app.use(store).use(router).mount('#app')
