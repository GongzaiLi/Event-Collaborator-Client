<template>

  <div class="row py-5 px-4"> <!--todo need fix flash and not find card--->
    <div class="col-md-10 mx-auto">
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
            <el-table
              :data="tableData"
              stripe
              style="width: 100%"
              :default-sort="{prop: 'date', order: 'descending'}"
              max-height="250"
              @row-click="goToEventProfile"
            >
              <el-table-column min-width="50" prop="image" label="Image" width="100">
                <template v-slot="scope">
                  <img class="rounded" :src="scope.row.image" width="50" height="50" alt="user"
                       @error="setUserImageDefault"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="eventId"
                label="Id"
                sortable
                width="100"/>
              <el-table-column
                prop="title"
                label="Title"
                sortable
                width="180"/>
              <el-table-column
                prop="date"
                label="Date"
                sortable
                width="180"/>
              <el-table-column
                prop="role"
                label="Role"
                sortable
                width="100"/>

              <!-- todo only owner can edit and delete-->
              <el-table-column label="Action">
                <template #default="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">Edit
                  </el-button>

                  <el-popconfirm
                    confirmButtonText='Ok'
                    cancelButtonText='Cancel'
                    icon="el-icon-info"
                    iconColor="red"
                    title="DO YOU WANT TO EDIT THE EVENT？"
                    @Confirm="handleDelete(scope.$index, scope.row)"
                    @Cancel="()=>{}"
                  >
                    <!--todo need check the button is working-->
                    <template #reference>
                      <el-button
                        size="mini"
                        type="danger"
                       >Delete
                      </el-button><!-- @click="handleDelete(scope.$index, scope.row)"-->
                    </template>

                  </el-popconfirm>

                </template>
              </el-table-column>

            </el-table>

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
                <register-and-edit :edit-modal="true" :edit-user="user" :on-click-edit="editUser"
                                   :edit-user-image="userImage"/>
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
      tableData: [{
        eventId: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'


      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
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
    },
    handleEdit(index, row) {
      //todo
      console.log(index, row);
    },
    handleDelete(index, row) {
      //todo
      console.log(index, row);
    },
    goToEventProfile: function (event) {
      console.log(event);
      this.$router.push({name: 'event-profile', params: {eventId: event.eventId}});
    },

  }
}
</script>

<style scoped>

</style>
