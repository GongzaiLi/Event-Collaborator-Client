<template>
  <div class="row py-5 px-4">


    <div class="col-md-7  mx-auto">
      <!-- Profile widget -->
      <div class="bg-white shadow rounded overflow-hidden ">

        <div class="px-4 pt-2 pb-4 cover">
          <img src="../assets/event-default.jpg" class="card-img" alt="...">
        </div>


        <div class="bg-light p-4 d-flex text-center">

          <div class="media align-items-center profile-head col-md-4">
            <div class="profile mr-3">
              <div class="demo-image">
                <div class="block">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="require('../assets/profile-default.png')"
                    fit="scale-down"/>
                  <h2 class="mt-0 mb-0">FName</h2>
                  <h2 class="mt-0 mb-0">Lname</h2>
                </div>
              </div>
            </div>
          </div>
          <div class="align-items-start align-content-center col-md-8 border-left mt-0">
            <h2> Title </h2>
            <h4 class="mt-0 mb-0"><i class="el-icon-date"/> Date: </h4>
            <h4 class="mt-0 mb-0"><i class="el-icon-receiving"/> Categories: </h4>
            <h4 class="mt-0 mb-0"><i class="el-icon-user"/> Capacity: </h4>
            <h4 class="mt-0 mb-0"><i class="el-icon-ship"/> Attendees: </h4><!-- only accepted-->
            <h4 class="mt-0 mb-0"><i class="el-icon-loading"/> Url: </h4>
            <h4 class="mt-0 mb-0"><i class="el-icon-place"/> Venue: </h4>
            <h4 class="mt-0 mb-0"><i class="el-icon-money"/> Fee: </h4>
          </div>


        </div>
        <div class="px-4 py-3">
          <h5 class="mb-0">Description</h5>
          <div class="p-4 rounded shadow-sm bg-light">
            <p style="text-align: justify;">there are many description</p>
          </div>
        </div>
        <div class="py-4 px-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="mb-0">Attendees List</h5>
          </div>

          <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort="{prop: 'date', order: 'descending'}"
            max-height="250"
          >
            <el-table-column min-width="55" prop="image" label="Image">
              <template v-slot="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.image"
                  fit="scale-down"/>
              </template>

            </el-table-column>
            <el-table-column
              prop="date"
              label="日期"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              :formatter="formatter">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "event-profile", //todo ask 8
  data() {
    return {
      tableData: [{
        image: require('../assets/profile-default.png'),
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        image: require('../assets/profile-default.png'),
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        image: require('../assets/profile-default.png'),
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        image: require('../assets/profile-default.png'),
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    formatter(row,) {
      return row.address;
    }
  }
}
</script>

<style scoped>

</style>
