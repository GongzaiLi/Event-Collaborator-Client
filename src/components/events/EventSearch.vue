<template>
  <div>
    <event-search-bar @sentEventData="passEventData($event)"/>
    <div v-show="eventItem.length">
      <event-card
          v-for="event in eventItem.slice(eventsMinRange, eventsMaxRange)"
          v-bind:key="event"
          :event-id='event.eventId'/>

      <div class="container mt-4 mb-4">
        <div class="d-flex justify-content-center row" style="font-family: 'Arial',serif;">
          Displaying {{ showMin }} - {{ showMax }} of total {{ totalEvents }} results
        </div>
      </div>
      <div class="container mb-4">

        <div class="d-flex justify-content-center row">
          <el-pagination
              @current-change="handleCurrentChange"
              :page-size="perPage"
              :pager-count="11"
              layout="prev, pager, next"
              :current-page="currentPage"
              :total="totalEvents">
          </el-pagination>


        </div>
      </div>
    </div>
  </div>

</template>

<script>

import EventSearchBar from "../modals/EventSearchBar";
import EventCard from "../modals/EventCard";


export default {
  name: "event-search",
  components: {
    EventCard,
    EventSearchBar
  },
  data() {
    return {
      eventItem: [],
      totalEvents: 0,
      perPage: 10,
      currentPage: 1,
    }
  },
  methods: {
    passEventData(events) {
      this.eventItem = events;
      this.totalEvents = this.eventItem.length;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    }
  },
  computed: {
    eventsMinRange: function () {
      return this.currentPage === 1 ? 0 : (this.currentPage - 1) * this.perPage;

    },
    eventsMaxRange: function () {
      return this.currentPage * this.perPage;
    },
    showMin: function () {
      return this.currentPage === 1 ? 1 : (this.currentPage - 1) * this.perPage + 1;
    },
    showMax: function () {
      return this.currentPage * this.perPage <= this.totalEvents ? this.currentPage * this.perPage : this.totalEvents;
    }

  }
}
</script>

<style scoped>

</style>
