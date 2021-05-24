import axios from 'axios';

const SERVER_URL = "http://localhost:4941/api/v1/";
//http://192.168.178.103:4941/api/v1/
//http://localhost:4941/api/v1/ //http://csse-s365docker1.canterbury.ac.nz:4001/api/v1/
const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 1000
});

export default {

    //users
    register: (user) => instance.post('users/register', user),
    login: (user) => instance.post('users/login', user),
    logout: (token) => instance.post('users/logout', null, {headers: {'X-Authorization': token}}),
    getUser: (userId, token) => instance.get(`users/${userId}`, {headers: {'X-Authorization': token}}),
    editUser: (userId, userInfo, token) => instance.patch(`users/${userId}`, userInfo, {headers: {'X-Authorization': token}}),

    //users.images
    getUserImage: (userId) => {
        return `${SERVER_URL}users/${userId}/image`;
    },

    putUserImage: (userId, userImage, token) => instance.put(`users/${userId}/image`, userImage.imgBaseData, {
        headers: {
            'X-Authorization': token,
            'Content-Type': userImage.imgBaseData.type
        }
    }),

    deleteUserImage: (userId, token) => instance.delete(`users/${userId}/image`, {headers: {'X-Authorization': token}}),

    //event
    getEvents: (searchParameters) => instance.get(`events/${searchParameters}`),
    // searchParameters = '?startIndex=20&count=10&q=Pizza%20party&organizerId=11&sortBy=DATE_DESC'
    createEvent: (event, token) => instance.post(`events`, event, {headers: {'X-Authorization': token}}),
    getEvent: (eventId) => instance.get(`events/${eventId}`),
    deleteEvent: (eventId, token) => instance.delete(`events/${eventId}`, {headers: {'X-Authorization': token}}),
    editEvent: (eventId, event, token) => instance.patch(`events/${eventId}`, event, {headers: {'X-Authorization': token}}),
    getEventCategories: () => instance.get(`events/categories`),


    //event.images
    getEventImage: (eventId) => {
        return `${SERVER_URL}events/${eventId}/image`;
    },


    putEventImage: (eventId, eventImage, token) => instance.put(`events/${eventId}/image`, eventImage.imgBaseData, {
        headers: {
            'X-Authorization': token,
            'Content-Type': eventImage.imgBaseData.type
        }
    }),

    //events.attendees
    getEventAttendees: (eventId, token) => instance.get(`events/${eventId}/attendees`, {headers: {'X-Authorization': token}}),
    createEventAttendees: (eventId, token) => instance.post(`events/${eventId}/attendees`, null, {headers: {'X-Authorization': token}}),
    deleteEventAttendees: (eventId, token) => instance.delete(`events/${eventId}/attendees`, {headers: {'X-Authorization': token}}),
    updateEventAttendees: (eventId, userId, status, token) => instance.patch(`events/${eventId}/attendees/${userId}`, status, {headers: {'X-Authorization': token}}),

}
