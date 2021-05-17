<template>

  <div id="login" class="container">
    <div class="card shadow" style="height: 25rem;">
      <div class="card-body">
        <div class="row justify-content-center align-items-center">
          <div class="col-md-6">
            <div class="col-md-0">

              <h3 class="text-center">LOGIN</h3>

              <br>

              <form @submit.prevent>
                <div class="form-group">
                  <label>email:</label><br>
                  <input type="email" class="form-control" required v-model="loginInf.email" />
                </div>
                <div class="form-group">
                  <label>Password:</label><br>
                  <input type="password" class="form-control" required v-model="loginInf.password" autocomplete="on"/>
                </div>
                <div class="text-right col-md-0">
                  <router-link :to="{name: 'register'}">Register here</router-link>
                </div>
                <div style="margin-top: 0.7em">
                  <button type="submit" class="btn btn-secondary btn-block" v-on:click="login">Login</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
#login {
  margin-top: 200px;
  max-width: 700px;
  max-height: 500px;
}
</style>

<script>
//done
export default {
  data() {
    return {
      loginInf: {
        "email": '',
        "password": '',
      },
      user: {
        userId: 0,
        token: ""
      }
    }
  },
  methods: {
    /**
     * login api
     **/
    login: async function () {
      if (this.validateLogin()) {
        await this.$api.login(this.loginInf)
            .then((response) => {//IIFE
              this.user = response.data;
              this.$currentUser.setToken(this.user);// set the token in the local
            }).then(() => {
              this.goToUserPage();
            })
            .catch((error) => {
              this.makeNotify('Login', error.response.statusText, 'error');
            });
      }
    },
    /**
     * validate Login date
     */
    validateLogin: function () {
      return this.loginInf.password && this.loginInf.email;
    },
    /**
     * when login successful go to the user profile
     */
    goToUserPage: function () {
      this.$router.push({name: 'user-profile', params: {userId: this.user.userId}});
    },
    /**
     * make error notify
     * @param title
     * @param message
     * @param type
     */
    makeNotify(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type
      });
    },
  }

}
</script>

