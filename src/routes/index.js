import Login from '../view/Login';
import RegisterAndEdit from '../view/RegisterAndEdit';
import UserProfile from "../view/UserProfile";
import EventSearch from "../view/EventSearch";
import EventProfile from "../view/EventProfile";


/**
 *
 */
const routes = [
  {path: "/", redirect: '/login',  meta: {keepAlive: false}},
  {path: "/login", name: 'login', component: Login,  meta: {keepAlive: false}},
  {path: "/register", name: 'register', component: RegisterAndEdit,  meta: {keepAlive: false}},
  {path: "/user/:userId", name: 'user-profile', component: UserProfile,  meta: {keepAlive: false}},
  {path: "/event/search", name: 'event-search', component: EventSearch, meta: {keepAlive: true}},
  {path: "/event/:eventId", name: 'event-profile', component: EventProfile,  meta: {keepAlive: false}},
];

export default routes;
//todo 守卫
