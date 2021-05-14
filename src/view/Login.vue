<template>

  <div id="login" class="container">
    <div class="card shadow" style="height: 25rem;">
      <div class="card-body">
        <div class="row justify-content-center align-items-center">
          <div class="col-md-6">
            <div class="col-md-0">
              <h3 class="text-center">LOGIN</h3>
              <br>
              <form @submit.prevent><!-- if use required need form -->
                <div class="form-group">
                  <label>email:</label><br>
                  <input type="email" class="form-control" required v-model="loginInf.email" /><!--tabindex="0" id-->
                </div>
                <div class="form-group">
                  <label>Password:</label><br>
                  <input type="password" class="form-control" required v-model="loginInf.password"/>
                </div>
                <div class="text-right col-md-0">
                  <router-link :to="{name: 'register'}">Register here</router-link>
                </div>
                <div v-if="error.length" class="alert alert-danger alert-dismissible fade show" role="alert"
                     style="margin-top: 0.2em">
                  {{ error }}
                  <!--                  <button type="button" class="close" v-bind:data-dismiss="alert" aria-label="Close">-->
                  <!--                    <span aria-hidden="true">&times;</span>-->
                  <!--                  </button>-->
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
// import Api from '../api';

export default {
  data() {
    return {
      loginInf: {
        "email": '',
        "password": '',
      },
      error: "",
      user: {
        userId: 0,
        token: ""
      }
    }
  },
  methods: {

    //todo api may problem and token keep.
    login: async function () {
      //k@gmail.com abc123  a@gmail.com abc234
      if (this.validateLogin()) {
        //console.log(this.loginInf);
        await this.$api.login(this.loginInf)
            .then((response) => {//IIFE
              this.user = response.data;
              this.$currentUser.setToken(this.user);// set the token in the local
            }).then(() => {
              //EventBus.$emit('login');
              this.goToUserPage();
            })
            .catch(() => {
              this.error = "invalid email or password";
            });
      }
    },
    /**
     * validate Login date
     */
    validateLogin: function () {
      return this.loginInf.password && this.loginInf.email;
    },
    goToUserPage: function () {
      this.$router.push({name: 'user-profile', params: {userId: this.user.userId}});
    },

  }

}
</script>

