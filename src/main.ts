import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import './index.css'
import App from './App.vue'
import Main from './pages/Main.vue'
import Settings from './components/Settings.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import GetProLandingPage from './pages/GetProLandingPage.vue'

const routes = [
    {path: '/', component: Main},
    {path: '/settings', component: Settings},
    {path: '/login', component: Login},
    {path: '/signup', component: Signup},
    {path: '/upgrade', component: GetProLandingPage},
];

Settings.displayName = 'Settings';


const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app')
