<template>

  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card shadow">

          <header v-show="!editModal" class="card-header">
            <h4 class="card-title mt-2">Sign up</h4>
          </header>

          <div class="card-body">
            <div>
              <img :src="image.imgUrl" class="img-thumbnail rounded mx-auto d-block" width="350" height="350"
                   alt="userImage"
                   @error="setUserImageDefault">
              <input
                  class="col-md-9 py-2" type="file" id="imageInput" accept="image/png,image/jpeg,image/gif"
                  @change="openImage($event)" ref="file"
                  style="margin-top: 0.5em"
              >
              <button class="btn btn-outline-danger btn-sm" form="imageInput" @click="removePhoto">Remove Photo</button>
            </div>
          </div>

          <hr>

          <div class="card-body">

            <form @submit.prevent="action">

              <div class="form-group">
                <b>First name</b>
                <input type="text" class="form-control" v-model="userInfo.firstName" required/>
              </div>

              <div class="form-group">
                <b>Last name</b>
                <input type="text" class="form-control" v-model="userInfo.lastName" required/>
              </div>

              <div class="form-group">
                <b>Email</b>
                <input type="email" class="form-control" v-model="userInfo.email" required/>
              </div>

              <div class="form-group">
                <b>Password</b>
                <input
                    type="password"
                    class="form-control"
                    v-model="userInfo.password"
                    :required="editPasswordRequired"
                    v-bind:oninput="passwordOnInvalid"
                    autocomplete="on"/>
              </div>

              <div>

                <div class="form-group" v-if="!editModal">
                  <b>Confirm Password</b>
                  <input
                      type="password"
                      class="form-control"
                      v-model="confirmPassword"
                      required
                      v-bind:oninput="confirmPasswordOnInvalid"
                      id="password"
                      autocomplete="on"/>
                </div>

                <div class="form-group" v-else>
                  <b>Current Password</b>
                  <input
                      type="password"
                      class="form-control"
                      v-model="userInfo.currentPassword"
                      :required="editPasswordRequired"
                      v-bind:oninput="passwordOnInvalid"
                      autocomplete="on"/>
                </div>

              </div>

              <div class="form-group">

                <button v-if="!editModal" type="submit" class="btn btn-secondary btn-block">
                  Register
                </button>

                <button v-if="editModal" type="submit" class="btn btn-secondary btn-block">
                  Edit
                </button>

              </div>

            </form>

          </div>

          <footer v-show="!editModal" class="border-top card-body text-center">
            Have an account?
            <router-link to="/login">Log In</router-link>
          </footer>

        </div>
      </div>

    </div>


  </div>
</template>

<script>

const MIN_PASSWORD_LENGTH = 8;

export default {
  name: "register-and-edit",
  props: {
    editModal: {
      type: Boolean,
      default: false
    },
    editUserInfo: {
      type: Object,
      default: () => ({}),
    },
    editUserImage: {
      type: String
    },
    userId: {
      type: Number,
    },
    reloadUserProfile: {
      type: Function,
    }
  },
  data() {
    return {

      userInfo: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        currentPassword: ''
      },
      confirmPassword: '',

      user: {
        userId: 0,
        token: ""
      },
      image: {
        imgUrl: '',
        imgBaseData: '',
        defaultImage: require('../assets/profile-default.png'),
        initImage() {
          this.imgUrl = this.defaultImage;
        },
      },
      hasImage: false,
      editPasswordRequired: true,
      editImage: false,
    }
  },
  mounted() {
    if (this.editModal) {
      this.editUserSetUp(this.editUserInfo);
    }
  },
  methods: {
    action: function () {
      if (this.editModal) {
        this.editUser();

      } else {

        this.register();
      }
    },

    /**
     * validate register date
     */
    validateRegister: function () {
      return this.userInfo.firstName.length &&
          this.userInfo.lastName.length &&
          this.userInfo.email.length &&
          (this.userInfo.password.length >= MIN_PASSWORD_LENGTH) &&
          (this.userInfo.password === this.confirmPassword);
    },

    /**
     * register a new user
     **/
    register: async function () {

      if (this.validateRegister()) {

        await this.$api.register({
          "firstName": this.userInfo.firstName,
          "lastName": this.userInfo.lastName,
          "email": this.userInfo.email,
          "password": this.userInfo.password
        })
            .then((response) => {
              this.user = response.data;

              return this.$api.login({"email": this.userInfo.email, "password": this.userInfo.password});
            })
            .then((response) => {
              this.$currentUser.setToken(response.data);
              this.changeUserImage(this.user.userId);
              this.goToUserPage();
            })
            .catch((error) => {
              this.makeNotify('Register a New User', error.response.statusText, 'error');
            });
      }
    },

    changeUserImage: async function (userId) {
      if (this.hasImage && this.editImage) {
        await this.$api.putUserImage(userId, this.image, this.$currentUser.getToken())
            .then(() => {
              return true;
            })
            .catch((error) => {
              this.makeNotify('add or edit User Image', error.response.statusText, 'error');
            })
      } else if (this.editModal && !this.hasImage) {
        await this.$api.deleteUserImage(userId, this.$currentUser.getToken())
            .then(() => {
              return true;
            })
            .catch((error) => {
              this.makeNotify('Delete User Image', error.response.statusText, 'error');
            })
      }
      return false;
    },

    editUser: function () {

      const editUser = {};
      Object.keys(this.userInfo).forEach((key) => {
        if (this.userInfo[key].length) {
          editUser[key] = this.userInfo[key];
        }
      })

      this.$api.editUser(this.$currentUser.getUserId(), editUser, this.$currentUser.getToken())
          .then(() => {
            this.changeUserImage(this.userId);
          })
          .then(() => {
            this.$router.go(0);
            this.reloadUserProfile();
            this.cleanUserInfo();
            // this.makeNotify('Edit your info', "Successful edit", 'success');

          })
          .catch((error) => {
            this.cleanUserInfo();
            this.makeNotify('Edit A User', error.response.statusText, 'error');
            //this.reloadUserProfile();
          })
      window.$('#editUserModal').modal('hide');//
    },
    cleanUserInfo: function () {
      Object.keys(this.userInfo).forEach((key) => {
        this.userInfo[key] = '';
      })
    },

    openImage: async function (event) {
      if (event.target.files[0]) {
        this.image.imgUrl = window.URL.createObjectURL(event.target.files[0]);
        this.hasImage = true;
        this.editImage = true;
        this.image.imgBaseData = this.$refs.file.files[0];
        event.target.value = '';
      }
    },
    goToUserPage: function () {
      this.$router.push({name: 'user-profile', params: {userId: this.user.userId}});
    },
    removePhoto: function () {
      this.image.initImage();
      this.hasImage = false;
      this.editImage = false;
    },
    checkPasswordEdit: function () {
      if (this.editModal) {
        this.editPasswordRequired = this.userInfo.password.length || this.userInfo.currentPassword.length;
      }
    },
    setUserImageDefault: function (e) {
      e.target.src = require('../assets/profile-default.png');
    },
    editUserSetUp: function (user) {
      this.userInfo.firstName = user.firstName;
      this.userInfo.lastName = user.lastName;
      this.userInfo.email = user.email;
      this.editPasswordRequired = false;
      this.hasImage = true;
      this.editImage = false;
      this.image.imgUrl = this.editUserImage;
    },
    makeNotify(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type
      });
    },
  },

  computed: {
    passwordOnInvalid() {
      this.checkPasswordEdit();
      return this.userInfo.password.length && this.userInfo.password.length < MIN_PASSWORD_LENGTH ?
          "this.setCustomValidity('The password must be at least 8 characters in length.')" :
          "this.setCustomValidity('')";
    },
    confirmPasswordOnInvalid() {
      this.checkPasswordEdit();
      return this.confirmPassword !== this.userInfo.password ?
          "this.setCustomValidity('Passwords do not match')" :
          "this.setCustomValidity('')";
    }
  },


  // watch: {
  //   editUser(user) {
  //     this.editUserSetUp(user);
  //   }
  // }


}
</script>

<style scoped>
</style>
