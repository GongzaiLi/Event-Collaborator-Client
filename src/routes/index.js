import {createWebHistory, createRouter} from "vue-router";
import Login from '../components/modals/Login';
import RegisterAndEdit from '../components/modals/RegisterAndEdit';
import UserProfile from "../components/user/UserProfile";
import EventSearch from "../components/events/EventSearch";
import EventProfile from "../components/events/EventProfile";
import EventCreate from "../components/events/EventCreateAndEdit";
import auth from "../auth";


const routes = [
    {path: "/", redirect: '/event/search'},
    {path: "/login", name: 'login', component: Login, meta: {keepAlive: false}},
    {path: "/register", name: 'register', component: RegisterAndEdit, meta: {keepAlive: false}},
    {path: "/user/:userId", name: 'user-profile', component: UserProfile, meta: {keepAlive: false}},
    {path: "/event/search", name: 'event-search', component: EventSearch, meta: {keepAlive: true}},
    {path: "/event/:eventId", name: 'event-profile', component: EventProfile, meta: {keepAlive: false}},
    {path: "/event/create", name: 'event-create', component: EventCreate, meta: {keepAlive: false}},
];


const router = createRouter({
    routes,
    history: createWebHistory()
});


router.beforeEach((to, from, next) => {
    if ((to.name === 'event-create' || to.name === 'user-profile') && !auth.checkLogin()) {
        next({name: 'login'})
    } else if ((to.name === 'login' || to.name === 'register') && auth.checkLogin()) {
        next({name: 'user-profile', params: {userId: auth.getUserId()}})
    } else {
        next()
    }
})

export default router;
