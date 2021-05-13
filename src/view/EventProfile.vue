<template>
  <div class="row py-5 px-4" v-show="!loading">
    <!--loading-->

    <div class="col-md-7  mx-auto">
      <!-- Profile widget -->
      <div class="bg-white shadow rounded overflow-hidden ">

        <div class="px-4 pt-2 pb-4 cover">
          <img :src="eventImage" class="card-img" alt="event" @error="setEventImageDefault"/>
        </div>

        <div class="bg-light p-4 d-flex text-center">

          <div class="media align-items-center profile-head col-md-4">
            <div class="profile mr-3">
              <div class="demo-image">
                <div class="block">
                  <img :src="userImage" alt="userImage" width="120" class="rounded mb-2 img-thumbnail"
                       @error="setUserImageDefault">
                  <h2 class="mt-0 mb-0">{{ event.organizerFirstName }}</h2>
                  <h2 class="mt-0 mb-0">{{ event.organizerLastName }}</h2>
                </div>
              </div>
            </div>
          </div>
          <div class="align-items-start align-content-center col-md-8 border-left mt-0">
            <h4> {{ event.title }} </h4>
            <hr/>
            <h5 class="mt-0 mb-1"><i class="el-icon-date"/> Date: {{ event.date }}</h5>
            <h5 class="mt-0 mb-1"><i class="el-icon-user"/> Capacity: {{ event.capacity }}</h5>
            <h5 class="mt-0 mb-1"><i class="el-icon-ship"/> Attendees: {{ event.attendeeCount }}</h5>
            <!-- only accepted-->
            <h5 class="mt-0 mb-1" v-show="event.url && event.url.length"><i class="el-icon-loading"/> Url:
              {{ event.url }}</h5>
            <h5 class="mt-0 mb-1"><i class="el-icon-place"/> Venue: {{ event.venue }}</h5>
            <h5 class="mt-0 mb-1"><i class="el-icon-money"/> Fee: {{ event.fee > 0 ? event.fee : "Free" }}</h5>
          </div>

        </div>
        <div class="px-4 py-3">
          <h5 class="mb-0"><i class="el-icon-receiving"/>Categories</h5>
          <div class="p-4 rounded shadow-sm bg-light">
            <p style="text-align: justify;">{{ categoriesResultList }}</p>
          </div>
        </div>

        <div class="px-4 py-3">
          <h5 class="mb-0">Description</h5>
          <div class="p-4 rounded shadow-sm bg-light">
            <p style="text-align: justify;">{{ event.description }}</p>
          </div>
        </div>

        <div class="py-4 px-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="mb-0">Attendees</h5>
          </div>

          <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort="{prop: 'firstName', order: 'descending'}"
            max-height="250"
          ><!--descending-->
            <el-table-column min-width="50" prop="image" label="Image">
              <template v-slot="scope">
                <img class="rounded" :src="scope.row.image" width="50" height="50" alt="user"
                     @error="setUserImageDefault"/>
                <!--                <el-image-->
                <!--                    style="width: 50px; height: 50px"-->
                <!--                    :src="scope.row.image"-->
                <!--                    fit="scale-down"/>-->
              </template>
            </el-table-column>
            <el-table-column
              prop="firstName"
              label="First Name"
              sortable
              width="250"/>
            <el-table-column
              prop="lastName"
              label="Last Name"
              sortable
              width="250"/>
          </el-table>
        </div>


        <div v-show="similarEvents.length>0">
          <hr style="max-width: 100%"/>

          <div class="px-4 py-3">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="mb-2">Similar event</h5>
            </div>
            <event-card v-for="eventId in similarEvents" v-bind:key="eventId" :event-id="eventId"/>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>

import EventCard from "../components/EventCard";

export default {
  name: "event-profile",
  components: {EventCard},
  data() {
    return {
      eventId: null,
      tableData: [],
      userImage: '',
      eventImage: '',
      event: {
        eventId: 0,
        title: "",
        categories: [],
        organizerFirstName: "",
        organizerLastName: "Li",
        attendeeCount: 0,
        capacity: null,
        description: "",
        organizerId: null,
        date: "2012-04-23T18:25:43.511Z",//todo should change
        isOnline: false,
        url: "",
        venue: "",
        requiresAttendanceControl: 0,
        fee: null
      },
      organizer: {
        firstName: "",
        lastName: "",
      },
      categoriesAllTypes: [],
      categoriesResultList: [],
      error: {
        eventError: '',
        eventImageError: '',
        userImageError: ''
      },
      loading: true,
      similarEvents: []
    }
  },
  mounted() {
    this.eventId = this.$route.params.eventId;
    this.initEventProfile();
  },
  methods: {
    initEventProfile: async function () {
      await this.getCategories();
      await this.getEvent();
      await this.getEventAttendees();
      await this.getAllEvents();
      this.setUpCategoriesTypes();
    },
    getEvent: async function () {
      await this.$api.getEvent(this.eventId)
        .then((response) => {
          this.event = response.data;
        })
        .then(() => {
          this.eventImage = this.$api.getEventImage(this.eventId);
        })
        .then(() => {
          this.userImage = this.$api.getUserImage(this.event.organizerId);
          this.loading = false;
        })
        .catch((error) => {
          this.error.eventError = error.message;
          this.loading = false;
        })


    },
    getCategories: async function () {
      await this.$api.getEventCategories()
        .then((response) => {
          this.categoriesAllTypes = response.data;
        })
        .catch((error) => {
          alert(error.message);
        })
    },
    getEventAttendees: async function () {
      await this.$api.getEventAttendees(this.eventId, this.$currentUser.getToken())
        .then((response) => {
          console.log(response.data);
          this.setUpAttendeesTable(response.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
    },
    setUpCategoriesTypes: function () {
      this.categoriesResultList = [];
      this.event.categories.forEach((id) => {
        this.categoriesAllTypes.forEach((category) => {
          if (id === category.id) {
            this.categoriesResultList.push(category.name);
          }
        });
      })
    },
    setUserImageDefault: function (e) {
      e.target.src = require('../assets/profile-default.png');
    },
    setEventImageDefault: function (e) {
      e.target.src = require('../assets/event-default.jpg');
    },
    setUpAttendeesTable: function (users) {
      this.tableData = [];
      let tableItem = {};
      users.forEach((user) => {
        tableItem.image = this.$api.getUserImage(user.attendeeId);
        tableItem.firstName = user.firstName;
        tableItem.lastName = user.lastName;
        this.tableData.push(tableItem);
        tableItem = {};
      })

    },
    getAllEvents: async function () {
      await this.$api.getEvents('')
        .then((response) => {
          response.data.forEach((event) => {
            this.checkSimilarEvent(event);
          })
        })
        .catch((error) => {
          console.log(error);
        })
    },
    checkSimilarEvent: function (event) {
      for (const category of this.categories) {
        if (event.categories.includes(category)) {
          this.similarEvents.push(event.eventId);
          return;
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
