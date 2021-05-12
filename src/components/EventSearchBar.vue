<template>
  <div>
    <div class="container mt-6 mb-2">
      <div class="d-flex justify-content-center row"><!-- justify-content-center means center   d-flex a container-->
        <div class="col-md-10">
          <div class=" p-2 bg-white shadow">
            <button id="searchAreaButton" class="btn btn-secondary btn-lg btn-block" type="button"
                    data-toggle="collapse"
                    data-target="#collapseSearch"
                    aria-expanded="false" aria-controls="collapseSearch" @click="switchSearchArea">
              Open Search Box
            </button>
          </div>

          <div class="my-2 p-3 bg-white rounded shadow">


            <div class="collapse" id="collapseSearch"><!--collapse-->
              <form @submit.prevent> <!---todo--->

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
                    <label><strong>Category ID: (Can add more then one)</strong></label>
                    <form @submit.prevent>
                      <div class="input-group shadow">
                        <input type="number" class="form-control" placeholder="Category ID"
                               aria-label="Recipient's username" v-model="categoryId" min="0" step="1" required>
                        <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="submit" @click="addCategoryList">Add
                          </button><!--todo need show category List> may use the tag-->
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div class="form-row mb-3">
                  <div class="col-md-12">
                    <label><strong>Selected Category ID:</strong></label>
                    <form v-for="id in searchParameters.categoryIds" v-bind:key="id">
                      <div class="input-group shadow mb-2">
                        <input type="number" class="form-control" :placeholder="id"
                               aria-label="Recipient's username" disabled>
                        <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" @click="cleanCategoryList(id)">-
                          </button>
                        </div>
                      </div>

                    </form>
                  </div>
                </div>


                <div class="row">
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
import Api from '../api';

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
        'Capacity (L to H)': 'CAPACITY_ASC',
        'Capacity (H to L)': 'CAPACITY_DESC',
        'Date (Old To New)': 'DATE_ASC',
        'Date (New To Old)': 'DATE_DESC',
        'Title (A-Z)': 'ALPHABETICAL_ASC',
        'Title (Z-A)': 'ALPHABETICAL_DESC',
      },
      categoryId: null,
      categoryTypes: [],

    }
  },
  mounted() {
    //todo check login or not sortByOptionList has?????
    this.getCategories();
  },
  methods: {
    switchSearchArea: function () {
      this.searchArea = this.searchArea !== 'Close' ? 'Close' : 'Open Search Box';
      document.getElementById("searchAreaButton").innerHTML = this.searchArea;
    },
    cleanCategoryList: function (id) {
      const index = this.searchParameters.categoryIds.indexOf(id.toString());
      if (index > -1) {
        this.searchParameters.categoryIds.splice(index, 1);
      }
    },
    addCategoryList: function () {
      if (this.categoryId && !this.searchParameters.categoryIds.includes(this.categoryId)) {
        this.searchParameters.categoryIds.push(this.categoryId);
      }
    },

    eventSearch: function () {
      this.query = ''; // init
      this.setQuery();
      this.getEvents();
    },

    getEvents: function () {
      Api.getEvents(this.query)
        .then((response) => {
          this.$emit('sentEventData', response.data);
        })
        .catch((error) => {
          alert(error.message);
        })
    },

    getCategories: function () {
      this.$api.getEventCategories()
        .then((response) => {
          this.categoryTypes = response.data;
          // console.log(this.categoryTypes);
        })
        .catch((error) => {
          alert(error.message);
        })
    },

    setQuery: function () {
      //todo simplify the function
      for (const key in this.searchParameters) {
        if (this.searchParameters[key].length && key !== 'categoryIds' && key !== 'sortBy' && key !== 'q') {
          this.query += (this.query.length) ? '&' : '?';
          this.query += `${key}=${this.searchParameters[key]}`;
        }
      }
      if (this.searchParameters.q.length) {
        this.query += (this.query.length) ? '&' : '?';
        this.searchParameters.q = this.searchParameters.q.replaceAll(' ', '%20');
        this.query += `q=${this.searchParameters.q}`;
      }
      if (this.searchParameters.categoryIds.length) {
        for (const id of this.searchParameters.categoryIds) {
          this.query += (this.query.length) ? '&' : '?';
          this.query += `categoryIds=${id}`;
        }
      }
      if (this.searchParameters.sortBy.length) {
        this.query += (this.query.length) ? '&' : '?';
        this.query += `sortBy=${this.sortByOptionList[this.searchParameters.sortBy]}`;
      }

    },

    eventSearchClean: function () {
      Object.keys(this.searchParameters).forEach(key => this.searchParameters[key] = '');
      this.searchParameters.categoryIds = [];
      this.query = '';
    }
  }
}
</script>

<style scoped>

</style>
