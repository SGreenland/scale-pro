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
import ForgotPassword from './pages/ForgotPassword.vue'
import ResetPassword from './pages/ResetPassword.vue'

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
    {path: '/verify-email', component: Login, name: 'Verify Email', meta: {excludeFromNav: true}, beforeEnter: (to: any, from: any, next: any) => {
         if (to.path == '/verify-email' && to.query.token) {
        const token = to.query.token as string;
        // send token to backend to verify email
        axios.get(`api/verify-email?token=${token}`).then(response => {
            next({name: 'Home', query: { verified: 'true' } });
        }).catch(error => {
            next({name: 'Login', query: { verified: 'false' } });
        });
    } else {
        next();
    }
    }},
    {path: '/forgot-password', component: ForgotPassword, name: 'Forgot Password', meta: {excludeFromNav: true}},
    {path: '/reset-password', component: ResetPassword, name: 'Reset Password', meta: {excludeFromNav: true}}
];



const router = createRouter({
    history: createWebHistory(),
    routes,
});


const app = createApp(App).use(router);

app.directive('click-away', vClickAway);

app.mount('#app');
