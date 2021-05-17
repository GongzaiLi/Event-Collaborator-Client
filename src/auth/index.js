// app.config.globalProperties.axios = axios;

export default {
    setToken: function (user) {
        Object.keys(user).forEach((key) => {
            sessionStorage.setItem(key, user[key]);
        })
    },
    getToken: function () {
        return sessionStorage.getItem('token');
    },
    getUserId: function () {
        return sessionStorage.getItem('userId');
    },
    deleteToken: function () {
        sessionStorage.clear();
    },
    checkLogin: function () {
        return sessionStorage.getItem('userId') !== null;
    },
    checkLoginUser: function (userId) {
        if (userId) {
            return sessionStorage.getItem('userId') === userId.toString();
        }
        return false;

    }
}