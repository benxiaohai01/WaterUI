import { createApp } from 'vue'
import WaterUI from '@water-ui/components'
import '@water-ui/components/style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(WaterUI)
app.use(router)
app.mount('#app')
