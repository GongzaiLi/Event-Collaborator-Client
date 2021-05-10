<template>

  <div class="row py-5 px-4"> <!--todo need fix flash--->
    <div class="col-md-5 mx-auto">
      <div class="bg-white shadow rounded overflow-hidden">


        <div class="px-4 pt-0 pb-4 cover">
          <div class="media align-items-end profile-head">
            <div class="profile mr-3" style="margin-top: 0.7em">
              <img :src="userImage" alt="userImage" width="120" class="rounded mb-2 img-thumbnail"
                   @error="setUserImageDefault">

              <button v-show="foundUser" class="btn btn-secondary btn-sm btn-block" data-toggle="modal"
                      data-target="#editUserModal">Edit
                profile
              </button>

            </div>
            <div class="media-body mb-5">
              <h4 class="mt-0 mb-0">{{ user.firstName }} {{ user.lastName }}</h4>
              <p v-show="foundUser" class="mb-4"> <!--small-->
                {{ user.email }}
              </p>
            </div>
          </div>
        </div>


        <div class="px-4 py-3">
          <h5 class="mb-0">Participating event</h5>
          <div class="p-4 rounded shadow-sm bg-light">
            <p class="mb-0">1</p><!--font-italic-->
            <p class="mb-0">2</p>
            <p class="mb-0">3</p>
          </div>
        </div>


        <div class="modal fade" id="editUserModal"
             data-backdrop="static"
             data-keyboard="false"
             tabindex="-1"
             aria-labelledby="editUserModalLabel"
             aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content" style="background-color:transparent; border: transparent">

              <div class="modal-body">
                <div class="col-md-9" style="text-align: right; margin-top: 25px">
                  <button type="button" class="btn btn-outline-danger" data-dismiss="modal">
                    <strong>X</strong>
                  </button>
                </div>
                <register-and-edit :edit-modal="true" :edit-user="user" :on-click-edit="editUser" :edit-user-image="userImage" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import RegisterAndEdit from "./RegisterAndEdit";
// import {ref} from 'vue';
// import $ from 'jquery';

export default {
  name: "UserProfile",
  components: {
    RegisterAndEdit
  },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
      },
      foundUser: false,
      userId: null,
      userImage: '',
    }
  },
  mounted() {//mounted

    this.userId = this.$route.params.userId;
    if (this.$currentUser.checkLoginUser(this.userId)) {
      this.getUser(this.userId);
    } else {
      this.foundUser = false;
    }
  },
  methods: {
    getUser: function (userId) {
      this.$api.getUser(userId, this.$currentUser.getToken())
        .then((response) => {
          this.user = response.data;
          this.userImage = this.$api.getUserImage(this.userId);
          this.foundUser = true;
        })
        .catch((error) => {
          //todo do not find show not fund card
          this.foundUser = false;
          console.log(error);
          ///**
          this.user = {
            firstName: "aaaa",
            lastName: "bbbb",
            email: "a@a",
          }
          this.foundUser = true;
          //**/
        });

    },
    editUser: function (editUserInf) {
      const editUser = {};
      Object.keys(editUserInf).forEach((key) => {
        if (editUserInf[key].length) {
          editUser[key] = editUserInf[key];
        }
      })
      this.$api.editUser(this.userId, editUser, this.$currentUser.getToken())
        .then(() => {
          //todo show the edit user successful
          //----------------
          this.getUser(this.userId);

        })
        .catch((error) => {
          alert(error.message);
        })
      window.$('#editUserModal').modal('hide');//
    },
    setUserImageDefault: function (e) {
      e.target.src = require('../assets/profile-default.png');
    }

  }
}
</script>

<style scoped>

</style>
