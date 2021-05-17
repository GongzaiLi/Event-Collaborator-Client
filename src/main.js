import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import router from "./routes";
import Auth from "./auth";
import Api from "./api";




const app = createApp(App);

app.config.globalProperties.$currentUser = Auth;
app.config.globalProperties.$api =Api;


app.use(router);// router stet
app.use(ElementPlus)
app.mount('#app');