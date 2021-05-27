<template>
  <div>
    <div class="container mt-6 mb-2">
      <div class="d-flex justify-content-center row">
        <div class="col-md-10">
          <div class="p-2 bg-white shadow">
            <button id="searchAreaButton" class="btn btn-secondary btn-lg btn-block" type="button"
                    data-toggle="collapse"
                    data-target="#collapseSearch"
                    aria-expanded="false" aria-controls="collapseSearch" @click="switchSearchArea">
              Open Search Box
            </button>
          </div>

          <div class="my-2 p-3 bg-white rounded shadow">


            <div class="collapse" id="collapseSearch">
              <form @submit.prevent>

                <div class="form-row">
                  <div class="col-md-8 mb-3">
                    <label><strong>Search Area :</strong></label>
                    <input type="text" class="form-control shadow" placeholder="Search Area"
                           v-model="searchParameters.q">
                  </div>

                  <div class="col-md-4 mb-3">
                    <label><strong>Sort By :</strong></label>
                    <select class="custom-select shadow" v-model="searchParameters.sortBy">
                      <option selected value="">Sort By</option>
                      <option v-for="(value, key) in sortByOptionList" v-bind:key="value" v-bind:value="key">
                        {{ key }}
                      </option>
                    </select>
                  </div>

                </div>


                <div class="form-row">

                  <div class="col-md-4 mb-3">
                    <label><strong>Results start with:</strong></label>
                    <el-tooltip class="item" effect="light" content="Please input a positive integer">
                      <input type="number" class="form-control shadow" placeholder="Result start with"
                             v-model="searchParameters.startIndex" min="0" step="1">
                    </el-tooltip>
                  </div>

                  <div class="col-md-4 mb-3">
                    <label><strong>Results number:</strong></label>
                    <el-tooltip class="item" effect="light" content="Please input a positive integer">
                      <input type="number" class="form-control shadow" placeholder="Results number"
                             v-model="searchParameters.count" min="0" step="1">
                    </el-tooltip>
                  </div>

                  <div class="col-md-4 mb-3">
                    <label><strong>Organizer Id:</strong></label>
                    <el-tooltip class="item" effect="light" content="Please input a positive integer">
                      <input type="number" class="form-control shadow" placeholder="Organizer Id"
                             v-model="searchParameters.organizerId" min="0" step="1">
                    </el-tooltip>
                  </div>

                </div>



                <div class="form-row mb-3">
                  <div class="col-md-12">
                    <label><strong>Category Type: (Can add more then one)</strong></label>
                    <div class="shadow">
                      <el-select v-model="searchParameters.categoryIds" multiple filterable placeholder="Choose Category" style="width: 100%">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>

                <div class="p-2 bg-white row">
                  <div class="col-md-10">
                    <button class="btn btn-secondary btn-lg" type="submit" @click="eventSearch" style="width: 20%">
                      Search
                    </button>
                  </div>
                  <div class="col-md-2 mt-1">
                    <button class="btn btn-secondary btn-sm" @click="eventSearchClean">Clean</button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import moment from "moment";
export default {
  name: "event-search-bar",
  data() {
    return {
      query: '',
      searchParameters: {
        startIndex: '',//default 0
        count: '',
        q: '',
        categoryIds: [],
        organizerId: '',
        sortBy: '',
      },
      searchArea: 'Open',
      sortByOptionList: {
        'Attendees (L to H)': 'ATTENDEES_ASC',
        'Attendees (H to L)': 'ATTENDEES_DESC',
        'Date (Old To New)': 'DATE_ASC',
        'Date (New To Old)': 'DATE_DESC',
      },
      // 'Capacity (L to H)': 'CAPACITY_ASC',
      // 'Capacity (H to L)': 'CAPACITY_DESC',
      // 'Title (A-Z)': 'ALPHABETICAL_ASC',
      // 'Title (Z-A)': 'ALPHABETICAL_DESC',
      categoryId: null,
      categoryTypes: [],
      options: [],

    }
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    switchSearchArea: function () {
      this.searchArea = this.searchArea !== 'Close' ? 'Close' : 'Open Search Box';
      document.getElementById("searchAreaButton").innerHTML = this.searchArea;
    },

    eventSearch: function () {
      this.query = '';
      this.setQuery();
      this.getEvents();
    },

    getEvents: function () {
      this.$api.getEvents(this.query)
          .then((response) => {
            this.$emit('sentEventData', this.filterEvents(response.data));
          })
          .catch((error) => {
            this.makeNotify('Read All Events', error.response.statusText, 'error');
          })
    },

    getCategories: async function () {
      await this.$api.getEventCategories()
          .then((response) => {
            this.categoryTypes = response.data;
            this.setOption(this.categoryTypes);
          })
          .catch((error) => {
            this.makeNotify('Read All Categories', error.response.statusText, 'error');
          })
    },

    setQuery: function () {
      for (const key in this.searchParameters) {
        if (this.searchParameters[key].length && key !== 'categoryIds' && key !== 'sortBy' && key !== 'q') {
          this.query += (this.query.length) ? '&' : '?';
          this.query += `${key}=${this.searchParameters[key]}`;
        }
      }
      if (this.searchParameters.q.length) {
        this.query += (this.query.length) ? '&' : '?';
        this.query += `q=${this.searchParameters.q.replaceAll(' ', '%20')}`;
      }
      if (this.searchParameters.categoryIds.length) {
        for (const id of Object.values(this.searchParameters.categoryIds)) {
          this.query += (this.query.length) ? '&' : '?';
          this.query += `categoryIds=${id}`;
        }
      }

      if (this.searchParameters.sortBy.length) {
        this.query += (this.query.length) ? '&' : '?';
        this.query += `sortBy=${this.sortByOptionList[this.searchParameters.sortBy]}`;
      } else {
        this.query += (this.query.length) ? '&' : '?';
        this.query += `sortBy=${this.sortByOptionList['Date (Old To New)']}`;
      }

    },

    eventSearchClean: function () {
      Object.keys(this.searchParameters).forEach(key => this.searchParameters[key] = '');
      this.searchParameters.categoryIds = [];
      this.query = '';
    },

    setOption: function (categories) {
      this.options = [];
      categories.forEach((category) => {
        this.options.push({value: category.id, label: category.name});
      })
    },
    makeNotify(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type
      });
    },
    filterEvents(events) {

      if (this.$currentUser.checkLogin()) {
        if (!events.length) {
          this.makeNotify('Searching Events', "Cannot find any events", 'info')
        }
        return events;
      }
      let allEvents = []

      const now = new Date();
      events.forEach((event)=> {
        if (moment(event.date).isAfter(now)) allEvents.push(event);
      })

      if (!allEvents.length) {
        this.makeNotify('Searching Events', "Cannot find any events", 'info')
      }
      return allEvents;
    }
  }
}
</script>

<style scoped>

</style>
