import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

async function bootstrap() {
	await authStore.initAuth()
	app.mount('#app')

	// remove the initial loading placeholder if present
	const loadingEl = document.getElementById('initial-loading')
	if (loadingEl) loadingEl.remove()
}

bootstrap()