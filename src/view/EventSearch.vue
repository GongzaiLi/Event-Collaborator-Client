<template>
  <div>
    <event-search-bar @sentEventData="passEventData($event)"/><!-- pass events -->
    <div v-show="eventItem.length">
      <event-card
          v-for="event in eventItem.slice(eventsMinRange, eventsMaxRange)"
          v-bind:key="event"
          :event-id='event.eventId'/>

      <div class="container mt-4 mb-4">
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

import EventSearchBar from "../components/EventSearchBar";
import EventCard from "../components/EventCard";


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
      perPage: 5,
      currentPage: 1,
    }
  },
  methods: {
    passEventData(events) {
      this.eventItem = events;
      this.totalEvents = this.eventItem.length;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  },
  computed: {
    eventsMinRange: function () {
      return this.currentPage === 1 ? 0 : (this.currentPage - 1) * this.perPage;

    },
    eventsMaxRange: function () {
      return this.currentPage * this.perPage;
    }
  }
}
</script>

<style scoped>

</style>
