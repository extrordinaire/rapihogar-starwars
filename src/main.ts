import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import pinia_plugin_persisted_state from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import 'beercss'
import 'material-dynamic-colors'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
const pinia = createPinia()
pinia.use(pinia_plugin_persisted_state)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
