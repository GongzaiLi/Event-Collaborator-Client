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
              <!--can change width and height-->
              <img :src="imgUrl" class="img-thumbnail rounded mx-auto d-block" width="350" height="350" alt="userImage"
                   @error="setUserImageDefault">
              <input
                class="col-md-8 py-2" type="file" id="imageInput" accept="image/png,image/jpeg,image/GIF"
                @change="openImage($event)"
                style="margin-top: 0.5em"
              >
              <button class="btn btn-secondary btn-sm" form="imageInput" @click="removePhoto">Remove Photo</button>
            </div>
          </div>
          <hr>

          <div class="card-body">
            <form @submit.prevent>
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
                <input type="password"
                       class="form-control"
                       v-model="userInfo.password"
                       :required="editPasswordRequired"
                       v-bind:oninput="passwordOnInvalid"/>
              </div>
              <div>
                <div class="form-group" v-if="!editModal">
                  <b>Confirm Password</b>
                  <input type="password"
                         class="form-control"
                         v-model="confirmPassword"
                         required
                         v-bind:oninput="confirmPasswordOnInvalid"/>
                </div>
                <div class="form-group" v-else>
                  <b>New Password</b>
                  <input type="password"
                         class="form-control"
                         v-model="userInfo.currentPassword"
                         :required="editPasswordRequired"
                         v-bind:oninput="passwordOnInvalid"/>
                </div>
              </div>
              <div class="form-group">
                <button v-if="!editModal" type="submit" class="btn btn-secondary btn-block" v-on:click="register">
                  Register
                </button>
                <button v-if="editModal" type="submit" class="btn btn-secondary btn-block" v-on:click="editUser">
                  Edit
                </button>
              </div>
              <div v-if="error.length" class="alert alert-danger alert-dismissible fade show" role="alert"
                   style="margin-top: 0.2em">
                {{ error }}
              </div>
            </form>
          </div>

          <footer v-show="!editModal" class="border-top card-body text-center">Have an account?
            <router-link to="/login">Log In</router-link>
          </footer>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
import Api from '../api';
// import {onUpdated} from 'vue';

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
      type: String//Image
    },
  },
  data() {
    return {
      use: 'asd',
      userInfo: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        currentPassword: ''
      },
      confirmPassword: '',
      error: '',
      //todo may be can delete
      user: {
        userId: 0,
        token: ""
      },
      imgUrl: require('../assets/profile-default.png'),
      imgBaseData: '',
      defaultImage: require('../assets/profile-default.png'),
      removeImage: false,
      editPasswordRequired: true,
    }
  },
  mounted() {
    if (this.editModal) {
      // setTimeout(() => {
      //   this.editUserSetUp(this.editUser);
      // }, 100);
      this.editUserSetUp(this.editUserInfo);
    }

  },
  methods: {
    editUser: function () {
      if (this.validateRegister()){
      //todo should update
      const editUser = {};
      Object.keys(this.userInfo).forEach((key) => {
        if (this.userInfo[key].length) {
          editUser[key] = this.userInfo[key];
        }
      })
      this.$api.editUser(this.userId, editUser, this.$currentUser.getToken())
        .then(() => {
          //todo show the edit user successful
          //todo call image api if image had
          this.getUser(this.userId);

        })
        .catch((error) => {
          alert(error.message);
        })
      window.$('#editUserModal').modal('hide');//
      }
    },

    register: async function () {

      if (this.validateRegister()) {
        let registerInf = {
          "firstName": this.userInfo.firstName,
          "lastName": this.userInfo.lastName,
          "email": this.userInfo.email,
          "password": this.userInfo.password
        };

        await Api.register(registerInf)
          .then((response) => {
            this.user = response.data
            const loginInf = {
              "email": this.userInfo.email,
              "password": this.userInfo.password
            }
            return Api.login(loginInf);
          })
          .then((response) => {
            //todo token set and go to user profile
            this.user = response.data;
            this.$currentUser.setToken(this.user);
            //todo the image
            if (this.imgBaseData) {
              Api.putUserImage(this.user.userId, this.imgBaseData);
            }
          })
          .then(() => {
            this.goToUserPage();
          })
          .catch((error) => {
            console.log(this.error)
            this.error = error.message;
          });
      }

    },

    /**
     * validate Login date
     */
    validateRegister: function () {
      return this.userInfo.firstName.length &&
        this.userInfo.lastName.length &&
        this.userInfo.email.length &&
        (this.userInfo.password.length >= MIN_PASSWORD_LENGTH) &&
        (this.userInfo.password === this.confirmPassword);
    },
    //todo update the function
    openImage: async function (event) {
      if (event.target.files[0]) {
        this.imgUrl = window.URL.createObjectURL(event.target.files[0]);
        this.removeImage = false;

        let reader = new FileReader();
        reader.onload = (event) => {
          this.imgBaseData = event.target.result;
          //e.target.result  就是从本地读取的图片的base64格式,将它上传给服务器即可
          //使用axios的post方法上传即可
        }
        reader.readAsDataURL(event.target.files[0]);
        // console.log(event.target.value);
        event.target.value = '';//todo can take the the name of the file
      }


    },
    goToUserPage: function () {
      this.$router.push({name: 'user-profile', params: {userId: this.user.userId}});
    },
    removePhoto: function () {
      this.imgUrl = this.defaultImage;
      this.removeImage = true;
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
      this.imgUrl = this.editUserImage;

    }
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

  watch: {
    editUser(oldVal, newVal){
      console.log(oldVal, 1111111);
      console.log(newVal, 111111223);

    }
  }


}
</script>

<style scoped>
</style>
