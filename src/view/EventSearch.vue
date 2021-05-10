<template>
  <div>
    <event-search-bar @sentEventData="passEventData($event)"/><!-- pass events -->
    <div v-show="eventItem.length">
      <event-card
        v-for="event in eventItem.slice(eventsMinRange, eventsMaxRange)"
        v-bind:key="event"
        :event-id='event.eventId'/>
      <div v-show="eventItem.length">
        <el-pagination
            :page-size="20"
            :pager-count="11"
            layout="prev, pager, next"
            :total="1000">
        </el-pagination>
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
