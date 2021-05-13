<template>
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card shadow">

          <div class="card-body">
            <div>
              <!--can change width and height-->
              <img :src="eventImage" class="img-thumbnail rounded mx-auto d-block"
                   width="350" height="350" alt="userImage"
                   @error="setUserImageDefault">
              <input
                  class="col-md-8 py-2" type="file" id="imageInput" accept="image/png,image/jpeg,image/GIF"
                  @change="openImage($event)"
                  style="margin-top: 0.5em"
              >
              <button class="btn btn-secondary btn-sm" form="imageInput" @click="removePhoto">Remove Photo</button>
            </div>
          </div>
          <hr>

          <div class="card-body">

            <el-form :model="newEvent" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

              <el-form-item label="Title: " prop="title">
                <el-input v-model="newEvent.title"></el-input>
              </el-form-item>

              <el-form-item label="Category: " prop="category"><!--font-family="Arial"-->
                <el-select v-model="newEvent.categoryIds">
                  <el-option label="Zone one" value="shanghai"></el-option>
                  <el-option label="Zone two" value="beijing"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="Date:" prop="date" placeholder="Activity zone">

                <el-date-picker type="date" placeholder="Pick a date" v-model="newEvent.date"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>

              <el-tooltip class="item" effect="light" content="0 means no limit on the number of attendees"
                          placement="top">
                <el-form-item label="Capacity: " prop="capacity">
                  <el-input v-model.number="newEvent.capacity" @blur="validateCapacity($event)"/>

                </el-form-item>
              </el-tooltip>

              <el-form-item label="Attend Req" prop="requiresAttendanceControl">
                <el-switch v-model="newEvent.requiresAttendanceControl"></el-switch>
              </el-form-item>


              <el-form-item label="Online" prop="isOnline">
                <el-switch v-model="newEvent.isOnline"></el-switch>
              </el-form-item>


              <div v-if="!newEvent.isOnline">
                <el-form-item label="Url: ">
                  <el-input v-model="newEvent.url"></el-input>
                </el-form-item>

                <el-form-item label="Venue: " prop="venue">
                  <el-input v-model="newEvent.venue"></el-input>
                </el-form-item>
              </div>

              <el-form-item label="Url: " prop="url" v-else>
                <el-input v-model="newEvent.url"></el-input>
              </el-form-item>


              <el-form-item label="Fee: " prop="fee">
                <el-input v-model.number="newEvent.fee"/>
              </el-form-item>


              <el-form-item label="Describe: " prop="description">
                <el-input type="textarea" v-model="newEvent.description"></el-input>
              </el-form-item>


              <el-form-item>
                <el-button v-if="editModal" type="primary" @click="eventEdit('ruleForm')">Edit</el-button>
                <el-button v-else type="primary" @click="eventCreate('ruleForm')">Create</el-button>
                <el-button @click="resetForm('ruleForm')">Reset</el-button>
              </el-form-item>
            </el-form>

          </div>

        </div>
      </div>

    </div>


  </div>
</template>

<script>
export default {
  name: "event-create-edit",
  props: {
    editModal: {
      type: Boolean,
      default: false
    },
    editEventInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      newEvent: {
        title: '',
        description: '',
        categoryIds: [],
        date: '',
        isOnline: false,
        url: '',
        venue: '', //todo two choose one depend on is online?
        capacity: 0,
        requiresAttendanceControl: true,
        fee: 0
      },
      rules: {
        title: [
          {required: true, message: 'Please input Title', trigger: 'blur'},
          {min: 0, message: 'Length should at least one', trigger: 'blur'}
        ],
        category: [
          {required: false, message: 'Please select Activity zone', trigger: 'change'}
        ],
        date: [
          {type: 'date', required: true, message: 'Please pick a date', trigger: 'change'}
        ],
        description: [
          {required: true, message: 'Please input Describe', trigger: 'blur'},
          {min: 0, message: 'Length should at least one', trigger: 'blur'}
        ],
        capacity: [
          {required: true, message: 'Please input a Max capacity', trigger: 'blur'},
          {type: 'number', message: 'Please input a Number', trigger: 'blur'},
        ],
        venue: [
          {required: true, message: 'Please input a venue', trigger: 'blur'},
        ],
        url: [
          {required: true, message: 'Please input a url', trigger: 'blur'},
          {type: 'url', message: 'Please input correct url', trigger: 'blur'},
        ],
        fee: [
          {required: true, message: 'Please input a Max capacity', trigger: 'blur'},
          {type: 'number', message: 'Please input a Number', trigger: 'blur'},
        ],
      },
      defaultImage: require('../assets/profile-default.png'),
      eventImage: ''
    };
  },
  mounted() {
    if (this.editModal) {
      this.editEventSetUp(this.editEventInfo);
    }
  },
  methods: {
    editEventSetUp(event) {
      this.newEvent.title = event.title;
      this.newEvent.categoryIds = event.categoryIds;
      this.newEvent.date = event.date;
      this.newEvent.isOnline = event.isOnline === 1;
      this.newEvent.url = event.url;
      this.newEvent.venue = event.venue;
      this.newEvent.capacity = event.capacity || 0;
      this.newEvent.requiresAttendanceControl = event.requiresAttendanceControl === 1;
      this.newEvent.fee = event.fee;
      this.newEvent.description = event.description;
      this.eventImage = event.image;

    },
    eventEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          // todo validate the request body
          //todo call post event api - will back a event id
          //todo then post event image
        } else {
          console.log('error submit!!');
          // window.$('#editUserModal').modal('hide');//
          return false;
        }
      });
    },
    eventCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          // todo validate the request body
          //todo call post event api - will back a event id
          //todo then post event image
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setUserImageDefault: function (e) {
      e.target.src = require('../assets/profile-default.png');
    },
    //todo update the function
    openImage: async function (event) {
      if (event.target.files[0]) {
        this.imgUrl = window.URL.createObjectURL(event.target.files[0]);
        this.removeImage = false;

        let reader = new FileReader();
        reader.onload = (event) => {
          this.imgBaseData = event.target.result;
          //e.target.result  就是从本地读取的图片的base64格式,将它上传给服务器即可
          //使用axios的post方法上传即可
        }
        reader.readAsDataURL(event.target.files[0]);
        // console.log(event.target.value);
        event.target.value = '';//todo can take the the name of the file
      }
    },
    removePhoto: function () {
      this.imgUrl = this.defaultImage;
      this.removeImage = true;
    },
    validateCapacity: function (e) {
      let validate = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!validate) {
        this.$message.warning('Please input a Integer number');
        e.target.value = '';
      }
    }
  },
  watch: {
    editEventInfo(event) {
      this.editEventSetUp(event);
    }
  }
}
</script>

<style scoped>

</style>
