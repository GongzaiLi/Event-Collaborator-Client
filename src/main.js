import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import ElementPlus from 'element-plus';
import App from './App.vue';
import routes from "./routes";
import Auth from "./auth";
import Api from "./api";


const router = createRouter({
    routes,
    history: createWebHistory()
});

const app = createApp(App);

app.config.globalProperties.$currentUser = Auth;
app.config.globalProperties.$api =Api;


app.use(router);// router stet
app.use(ElementPlus)
app.mount('#app');