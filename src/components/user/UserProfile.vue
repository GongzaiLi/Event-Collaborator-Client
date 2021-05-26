<template>

  <div class="row py-5 px-4" v-if="!loading">
    <div class="col-md-8 mx-auto" v-if="foundUser">
      <div class="bg-white shadow rounded overflow-hidden">

        <div class="px-4 pt-0 pb-4 cover">
          <div class="media align-items-end profile-head">
            <div class="profile mr-5" style="margin-top: 1.0em">

              <img :src="userImage" alt="userImage" width="120" class="rounded mb-2 img-thumbnail"
                   @error="setUserImageDefault">

              <button class="btn btn-secondary btn-sm btn-block" @click="setUserModal">Edit
                profile
              </button>

            </div>
            <div class="media-body mb-6">
              <h4 class="mt-2 mb-1">{{ user.firstName }} {{ user.lastName }}</h4>
              <p class="mb-4"> <!--small-->
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
                :default-sort="{prop: 'eventId', order: 'increasing'}"
                max-height="500"
                @row-click="goToEventProfile"
            >
              <el-table-column min-width="50" prop="image" label="Image" width="100">
                <template v-slot="scope">
                  <img class="rounded" :src="scope.row.image" width="50" height="50" alt="user"
                       @error="setEventImageDefault"/>
                </template>
              </el-table-column>
              <el-table-column
                  prop="eventId"
                  label="Id"
                  sortable
                  width="80"/>
              <el-table-column
                  prop="title"
                  label="Title"
                  sortable
                  width="150"/>
              <el-table-column
                  prop="date"
                  label="Date"
                  sortable
                  width="200"/>
              <el-table-column
                  prop="role"
                  label="Role"
                  sortable
                  width="100"/>
              <el-table-column
                  prop="status"
                  label="Status"
                  width="90"/>

              <el-table-column label="Action">
                <template #default="scope">

                  <div v-if="scope.row.role === 'organizer' && checkEventDate(scope.row)">
                    <el-button
                        size="mini"
                        type="success"
                        @click.stop="eventEdit(scope.row)">Edit
                    </el-button>

                    <el-popconfirm
                        confirmButtonText='Ok'
                        cancelButtonText='Cancel'
                        icon="el-icon-info"
                        iconColor="red"
                        title="DO YOU WANT TO EDIT THE EVENT？"
                        @Confirm="eventDelete(scope.row)"
                        @Cancel="()=>{}"
                    >
                      <template #reference>
                        <el-button
                            size="mini"
                            type="danger"
                        >Delete
                        </el-button><!-- @click="handleDelete(scope.$index, scope.row)"-->

                      </template>

                    </el-popconfirm>
                  </div>
                  <div v-else>
                    <span>No privilege</span>
                  </div>
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
                <div class="col-md-10" style="text-align: right; margin-top: 25px">
                  <el-button type="danger" class="btn btn-outline-danger" data-dismiss="modal" circle
                             icon="el-icon-close"/>
                </div>
                <event-create-and-edit v-if="eventModal" :edit-modal="true" :edit-event-info="editEventInfo" :reload-user-profile="setUpUserProfile"/>
                <register-and-edit
                    v-else
                    :edit-modal="true"
                    :edit-user-info="user"
                    :edit-user-image="userImage"
                    :user-id="parseInt(userId)"
                    :reload-user-profile="setUpUserProfile"/>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-else style="width:800px; margin:0 auto;">
      <el-result icon="info" title="Not Found">
      </el-result>
    </div>

  </div>

</template>

<script>
import RegisterAndEdit from "../modals/RegisterAndEdit";
import EventCreateAndEdit from "../events/EventCreateAndEdit";

export default {
  name: "UserProfile",
  components: {
    RegisterAndEdit,
    EventCreateAndEdit
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
      tableData: [],
      eventModal: true,
      editEventInfo: {},
      loading: true
    }
  },
  mounted() {
    this.setUpUserProfile();
  },
  methods: {
    /**
     * init user profile page
     **/
    setUpUserProfile: async function () {
      this.loading = true;
      this.userId = this.$route.params.userId;
      if (this.$currentUser.checkLoginUser(this.userId)) {
        await this.getUser(this.userId);
        await this.getEvents();
      } else {
        this.foundUser = false;
        this.loading = false;
      }
    },
    /**
     * get user detail
     **/
    getUser: async function (userId) {
      await this.$api.getUser(userId, this.$currentUser.getToken())
          .then((response) => {
            this.user = response.data;
            this.userImage = this.$api.getUserImage(this.userId);
            this.foundUser = true;
            this.loading = false;
          })
          .catch((error) => {
            this.foundUser = false;
            this.loading = false;
            this.makeNotify('Get A user', error.response.statusText, 'error');
          });
    },
    /**
     * if image error set a default image
     **/
    setUserImageDefault: function (e) {
      e.target.src = require('../../assets/profile-default.png');
    },
    /**
     * call get event api
     **/
    getEvents: async function () {
      this.tableData = [];
      await this.$api.getEvents('')
          .then((response) => {
            response.data.forEach(async (event) => {
              await this.getEventsAttendees(event.eventId)
              await this.$api.getEvent(event.eventId).then((response) => {
                if (response.data.organizerId === parseInt(this.userId)) {
                  this.setUpTheTable(response.data, "accepted");
                }
              });
            })
          })
          .catch((error) => {
            this.makeNotify('Get ALl Event', error.response.statusText, 'error');
          })
    },
    /**
     * call api get Event attendees
     **/
    getEventsAttendees: async function (eventId) {
      await this.$api.getEventAttendees(eventId, this.$currentUser.getToken())
          .then((response) => {
            response.data.forEach(async (user) => {
              if (user.attendeeId === parseInt(this.userId)) await this.getEvent(eventId, user.status);
            })
          })
          .catch((error) => {
            this.makeNotify('Get Event Attendees', error.response.statusText, 'error');
          })


    },
    /**
     * call api get a event
     **/
    getEvent: async function (eventId, status) {
      await this.$api.getEvent(eventId)
          .then((response) => {
            this.setUpTheTable(response.data, status)
          })
          .catch((error) => {
            this.makeNotify('Get a Event', error.response.statusText, 'error');
          })
    },
    /**
     * set up the table
     **/
    setUpTheTable: function (event, status) {
      let tableItem = event;
      tableItem.image = this.$api.getEventImage(event.id);
      tableItem.eventId = event.id;
      tableItem.title = event.title;
      tableItem.date = this.setDate(event.date);
      tableItem.role = this.$currentUser.checkLoginUser(event.organizerId) ? 'organizer' : 'attendee';
      tableItem.status = status;

      if (!this.checkTableHadItem(tableItem.eventId)) this.tableData.push(tableItem);
    },
    /**
     * open the event edit modal.
     **/
    eventEdit(row) {
      this.editEventInfo = row;
      this.eventModal = true;
      window.$('#editUserModal').modal('show');//
    },
    eventDelete(row) {
      this.$api.deleteEvent(row.eventId, this.$currentUser.getToken())
          .then(() => {
            this.setUpUserProfile();
          })
          .catch((error) => {
            this.makeNotify('user Profile', error.response.statusText, 'error');
          });
    },
    /**
     * go to event Profile
     * */
    goToEventProfile: function (event) {
      this.$router.push({name: 'event-profile', params: {eventId: event.eventId}});
    },
    setEventImageDefault: function (e) {
      e.target.src = require('../../assets/event-default.jpg');
    },
    checkTableHadItem(eventId) {
      for (const item of this.tableData) {
        if (item.eventId === eventId) {
          return true;
        }
      }
      return false;
    },
    setUserModal() {
      this.eventModal = false;
      window.$('#editUserModal').modal('show');//
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
    setDate(date) {
      return new Date(date).toString().split(' ').splice(0, 5).join(' ');
    },
    checkEventDate(event) {
      let date = new Date(event.date);
      let now = new Date();
      return date > now;
    }
  },
  watch: {
    $route() {
      this.setUpUserProfile();
    },
  }
}
</script>

<style scoped>

</style>
