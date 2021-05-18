<template>
  <div v-show="!loading">
    <div class="container mt-6 mb-2">
      <div class="d-flex justify-content-center row"><!-- justify-content-center means center   d-flex a container-->
        <div class="col-md-10">
          <div class="row p-2 bg-white border shadow" @click="goToEventProfile"><!--rounded-->
            <div class="col-md-3 mt-1">
              <img class="img-fluid img-responsive rounded" :src="eventImage" alt="event"
                   @error="setEventImageDefault"/>
            </div>
            <div class="col-md-6 mt-1">

              <h2>{{ event.title }}</h2>

              <hr>
              <div class="row responsive">
                <strong class="col-5">Date:</strong>
                <span class="col-7">{{ setDate }}</span>
              </div>
              <hr>
              <div class="row responsive">
                <strong class="col-5">Attendees:</strong>
                <span class="col-6">{{ event.attendeeCount }}</span>
              </div>


              <hr>
              <div class="row">
                <strong class="col-5 ">Category:</strong>
              </div>
              <div class="tag-group">
                <el-tag
                    style="margin-right: 10px; margin-top: 10px"
                    type="success"
                    v-for="(category, index) in categoriesResultList"
                    v-bind:key="index">
                  {{ category.name }}
                </el-tag>
              </div>

            </div>

            <div class="align-items-center align-content-center col-md-3 border-left mt-2">
              <div class="d-flex flex-row align-items-center mt-5">
                <img class="rounded" :src="userImage" width="100" height="100" alt="user" @error="setUserImageDefault"/>
              </div>
              <div class="d-flex flex-row align-items-center  mt-3">
                <span class="col-6">
                  {{ event.organizerFirstName }} {{ event.organizerLastName }}
                </span>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>

  </div>


</template>

<script>

export default {
  name: "event-card",
  props: {
    eventId: {
      type: Number,
    }
  },
  // inject: ['reload'],
  data() {
    return {
      event: {
        eventId: 2,
        title: "tile",
        categories: [],
        organizerFirstName: "Scott",
        organizerLastName: "Li",
        attendeeCount: 0,
        capacity: null,
        description: "",
        organizerId: null,
        date: "2012-04-23T18:25:43.511Z",
        isOnline: false,
        url: "",
        venue: "",
        requiresAttendanceControl: 0,
        fee: null
      },
      error: {
        eventError: '',
        eventImageError: '',
        userImageError: ''
      },
      categoriesAllTypes: [],
      categoriesResultList: [],

      eventImage: require('../assets/event-default.jpg'),
      userImage: require('../assets/profile-default.png'),
      loading: true

    }
  },
  mounted() {
    this.initCardInfo()
  },
  methods: {
    initCardInfo: async function () {
      await this.getCategories();
      await this.getEvent();
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

    goToEventProfile: function () {
      // this.reload();
      this.$router.push({name: 'event-profile', params: {eventId: this.eventId}});
    },
    setEventImageDefault: function (e) {
      e.target.src = require('../assets/event-default.jpg');
    },
    setUserImageDefault: function (e) {
      e.target.src = require('../assets/profile-default.png');
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
    setUpCategoriesTypes: function () {
      this.categoriesResultList = [];
      this.event.categories.forEach((id) => {
        this.categoriesAllTypes.forEach((category) => {
          if (id === category.id) {
            this.categoriesResultList.push(category);
          }
        });
      });
    }
  },
  computed: {
    setDate() {
      return new Date(this.event.date).toString().split(' ').splice(0, 5).join(' ');
    }
  }
}
</script>

<style scoped>

</style>
