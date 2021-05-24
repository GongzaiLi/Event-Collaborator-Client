<template>

  <nav class="navbar navbar-expand navbar-dark bg-dark">

    <div class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#" @click="goToEventPage">Event Search</a>
        </li>
        <li class="nav-item active" v-show="visible">  <!--todo if not login not show up-->
          <a class="nav-link" href="#" @click="goToCreateEventPage">Create Event</a>
        </li>
        <li class="nav-item active" v-show="visible">  <!--todo if not login not show up-->
          <a class="nav-link" href="#" @click="goToUserPage">Profile</a>
        </li>
      </ul>
      <div class="nav-item dropdown my-2 my-lg-0">

        <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
          <img class="rounded" src="../../assets/profile-default.png" width="30" height="30" alt="userDefaultImage"/>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <!--v-show-->
          <div v-if="!visible">
            <a class="dropdown-item" href="#" @click="goToRegisterPage">Register</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-on:click="goToLoginPage">Login</a>

          </div>
          <!--          <div class="dropdown-divider"></div>-->
          <div v-else>

            <!--v-show-->
            <a class="dropdown-item" href="#" @click="loginOut">Log Out</a>
            <!--todo if not login hide up-->
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>

<script>
// import Api from '../api';

export default {
  name: "Navbar",
  // inject: ['reload'],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    goToLoginPage: function () {
      this.$router.push({name: 'login'});
      // this.reload();
    },
    goToRegisterPage: function () {
      this.$router.push({name: 'register'});
    },
    goToUserPage: function () {
      this.$router.push({name: 'user-profile', params: {userId: this.$currentUser.getUserId()}});//todo change later
    },
    goToEventPage: function () {
      this.$router.push({name: 'event-search'});
    },
    loginOut: async function () {
      await this.$api.logout(this.$currentUser.getToken())
        .then(() => {//IIFE
          this.goToLoginPage();
        })
        .catch(() => {
          // alert(error.message);
        });
      //this.goToLoginPage();
      this.$currentUser.deleteToken();
    },
    goToCreateEventPage: function () {
      this.$router.push({name: 'event-create'});
    }
  },
  watch: {
    //todo watch and check the user login or not
    $route() {
      this.visible = this.$currentUser.checkLogin();
    }
  }

}
</script>

<style scoped>

</style>
