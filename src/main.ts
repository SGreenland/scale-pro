import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import './index.css'
import App from './App.vue'
import Main from './pages/Main.vue'
import Settings from './components/Settings.vue'

const routes = [
    {path: '/', component: Main},
    {path: '/settings', component: Settings},
];

Settings.displayName = 'Settings';


const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app')
