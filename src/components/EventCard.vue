<template>
  <div v-show="!loading">
    <div class="container mt-6 mb-2">
      <div class="d-flex justify-content-center row"><!-- justify-content-center means center   d-flex a container-->
        <div class="col-md-10">
          <div class="row p-2 bg-white border shadow" @click="goToEventProfile"><!--rounded-->
            <div class="col-md-3 mt-1">
              <!--box main-image-->
              <img class="img-fluid img-responsive rounded" :src="eventImage" alt="event"
                   @error="setEventImageDefault"/>
              <!--todo nee fix the error massage-->
            </div>
            <div class="col-md-6 mt-1"><!--Spacing 间距-->

              <h2>{{ event.title }}</h2>

              <div class="row responsive">
                <strong class="col-5">Date:</strong>
                <span class="col-6">{{ event.date }}</span><!--todo modify date-->
              </div>

              <div class="row responsive">
                <strong class="col-5">Attendees:</strong>
                <span class="col-6">{{ event.attendeeCount }}</span>
              </div>

              <div class="row">
                <strong class="col-5">Category:</strong>
                <div class="col-6">
                  <span class="mb-1" v-for="category in event.categories" v-bind:key="category">
                    {{ category + '  ' }}<!--todo may need modify-->
                  </span>
                </div>

              </div>

            </div>

            <div class="align-items-center align-content-center col-md-3 border-left mt-2">

              <!--              <strong class="col-3">Organizer:</strong>-->


              <div class="d-flex flex-row align-items-center  mt-4">
                <img class="rounded" :src="userImage" width="50" height="50" alt="user" @error="setUserImageDefault"/>
                <!--                onerror="this.onerror=null;this.src='https://cdn.discordapp.com/attachments/474461177309691904/711913897820422195/defaultUser.png';"-->
                <span class="col-5">
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
import Api from '../api';

export default {
  name: "event-card",
  props: {
    eventId: {
      type: Number,
    }
  },
  data() {
    return {
      event: {
        eventId: 2,
        title: "tile",
        categories: [1, 2, 3, 4],
        organizerFirstName: "Scott",
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
      error: {
        eventError: '',
        eventImageError: '',
        userImageError: ''
      },

      eventImage: require('../assets/event-default.jpg'),
      userImage: require('../assets/profile-default.png'),
      loading: true

    }
  },
  mounted() {
    this.getEvent();//todo

  },
  created() {
    //todo may use
  },
  methods: {

    getEvent: function () {
      Api.getEvent(this.eventId)
        .then((response) => {
          this.event = response.data;
        })
        .then(() => {
          this.eventImage = Api.getEventImage(this.eventId);
        })
        .then(() => {
          this.userImage = Api.getUserImage(this.event.organizerId);
          this.loading = false;
        })
        .catch((error) => {
          this.error.eventError = error.message;
          this.loading = false;
        })


    },

    goToEventProfile: function () {
      this.$router.push({name: 'event-profile', params: {eventId: this.eventId}});
    },
    setEventImageDefault: function (e) {
      e.target.src = require('../assets/event-default.jpg');
    },
    setUserImageDefault: function (e) {
      e.target.src = require('../assets/profile-default.png');
    }

  }
}
</script>

<style scoped>

</style>
