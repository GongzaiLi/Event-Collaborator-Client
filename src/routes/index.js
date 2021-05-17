import {createWebHistory, createRouter} from "vue-router";
import Login from '../view/Login';
import RegisterAndEdit from '../view/RegisterAndEdit';
import UserProfile from "../view/UserProfile";
import EventSearch from "../view/EventSearch";
import EventProfile from "../view/EventProfile";
import EventCreate from "../view/EventCreateAndEdit";
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
    if (to.name !== 'register' && to.name !== 'event-search' && to.name !== 'login' && !auth.checkLogin()) {
        next({name: 'login'})
    } else if (to.name === 'login' && auth.checkLogin()) {
        next({name: 'user-profile', params: {userId: auth.getUserId()}})
    } else {
        next()
    }
})

export default router;
