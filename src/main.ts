import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import './index.css'
import App from './App.vue'
import Main from './pages/Main.vue'
import Settings from './components/Settings.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import GetProLandingPage from './pages/GetProLandingPage.vue'
import UserAccountPage from './pages/UserAccountPage.vue'

const routes = [
    {path: '/', component: Main, name: 'Home'},
    {path: '/settings', component: Settings, name: 'Settings'},
    {path: '/login', component: Login, name: 'Login'},
    {path: '/signup', component: Signup, name: 'Signup'},
    {path: '/upgrade', component: GetProLandingPage, name: 'Upgrade'},
    {path: '/my-account', component: UserAccountPage, name: 'My Account'},
];

Settings.displayName = 'Settings';


const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app')
