<template>
  <div class="container mt-4 mb-4">
    <div class="d-flex justify-content-center row"><!-- justify-content-center means center   d-flex a container-->
      <div class="col-md-5">
        <nav aria-label="Page navigation">
          <ul class="pagination">

            <li class="page-item">
              <a class="page-link" href="#" aria-label="Previous" @click="previousPage">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>

            <li class="page-item">
              <a class="page-link">
                Displaying {{ eventsRangeMin }} - {{ eventsRangeMax }} of total {{ totalEvents }} results
              </a>
            </li>

            <li class="page-item active">
              <a class="page-link">
                {{ currentPage }}
              </a>
            </li>


            <li class="page-item">
              <a class="page-link" href="#" aria-label="Next" @click="nextPage">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    totalEvents: {
      type: Number,
    },
    perPage: {
      type: Number,
      default: 5
    },
    currentPage: {
      type: Number,
      default: 1
    },
    paginationLoading: {
      type: Boolean
    }
  },
  data() {
    return {
    }
  },
  methods: {

    nextPage() {
      if (this.currentPage < this.totalPageCount) {
        this.updateCurrentPage(this.currentPage + 1);
      }

    },
    previousPage() {
      if (this.currentPage > 1) {
        this.updateCurrentPage(this.currentPage - 1);
      }

    },
    updateCurrentPage(currentPageNum) {
      this.$emit('update:currentPage', currentPageNum);//update the props value
      this.$emit('update:paginationLoading', true);
    }
  },
  computed: {
    totalPageCount: function () {
      return Math.ceil(this.totalEvents / this.perPage);
    },
    eventsRangeMin: function () {
      return this.currentPage === 1 ? 1 : (this.currentPage - 1) * this.perPage + 1;
    },
    eventsRangeMax: function () {
      return this.currentPage * this.perPage <= this.totalEvents ? this.currentPage * this.perPage : this.totalEvents;
    }
  }
}
</script>

<style scoped>

</style>
