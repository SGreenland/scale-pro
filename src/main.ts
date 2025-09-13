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
import UserPitchData from './pages/UserPitchData.vue'
import {
    ModuleRegistry,
    AllCommunityModule,
} from 'ag-grid-community';
import vClickAway from './directives/vClickAway';

import axios from "axios";

import.meta.env.PROD && (axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000");

axios.defaults.withCredentials = true;



// Register the module...
ModuleRegistry.registerModules([
    AllCommunityModule, // or AllEnterpriseModule
]);

const routes = [
    {path: '/', component: Main, name: 'Home'},
    {path: '/login', component: Login, name: 'Login'},
    {path: '/signup', component: Signup, name: 'Signup'},
    {path: '/settings', component: Settings, name: 'Settings'},
    {path: '/my-pitch-data', component: UserPitchData, name: 'My Pitch Data'},
    {path: '/upgrade', component: GetProLandingPage, name: 'Upgrade'},
    {path: '/my-account', component: UserAccountPage, name: 'My Account'},
];



const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App).use(router);

app.directive('click-away', vClickAway);

app.mount('#app');
