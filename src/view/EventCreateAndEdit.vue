<template>
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card shadow">

          <div class="card-body">
            <div>
              <!--can change width and height-->
              <img :src="image.imgUrl" class="img-thumbnail rounded mx-auto d-block"
                   width="350" height="350" alt="userImage"
                   @error="setUserImageDefault">
              <input
                  class="col-md-8 py-2" type="file" id="imageInput" accept="image/png,image/jpeg,image/GIF"
                  @change="openImage($event)" ref="file" @blur="validateImage($event)"
                  style="margin-top: 0.5em"
              >
              <button class="btn btn-secondary btn-sm" form="imageInput" @click="removePhoto">Remove Photo</button>
            </div>
          </div>
          <hr>

          <div class="card-body">

            <el-form :model="newEvent" :rules="rules" ref="newEvent" label-width="120px" class="demo-ruleForm">

              <el-form-item label="Title: " prop="title">
                <el-input v-model="newEvent.title"></el-input>
              </el-form-item>

              <el-form-item label="Category: " prop="categoryIds"><!--font-family="Arial"-->
                <el-select v-model="newEvent.categoryIds" multiple filterable placeholder="Choose Category"
                           style="width: 100%">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="Date:" prop="date" placeholder="Activity zone">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="Pick a date" v-model="newEvent.date"
                                  style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="4">-</el-col>
                <el-col :span="11">
                  <el-time-picker placeholder="Pick Time" v-model="newEvent.time" style="width: 100%;"></el-time-picker>
                </el-col>

              </el-form-item>

              <el-tooltip class="item" effect="light" content="0 means no limit on the number of attendees"
                          placement="top">
                <el-form-item label="Capacity: " prop="capacity">
                  <el-input v-model.number="newEvent.capacity"/>
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
                <el-button v-if="editModal" type="primary" @click="eventEdit('newEvent')">Edit</el-button>
                <el-button v-else type="primary" @click="eventCreate('newEvent')">Create</el-button>
                <el-button @click="resetForm('newEvent')">Reset</el-button>
              </el-form-item>
            </el-form>

          </div>

        </div>
      </div>

    </div>


  </div>
</template>

<script>
import moment from 'moment';

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
    }
  },
  data() {
    let checkDate = (rule, date, callback) => {
      let now = new Date();
      if (date < now) {
        callback(new Error('The New Event Data must be in the future'));
      } else {
        callback();
      }
    };
    let validateCapacity = (rule, capacity, callback) => {
      let validate = new RegExp("^[0-9][0-9]*$").test(capacity);
      if (!validate) {
        callback(new Error('Please input a Integer number'));
      } else {
        callback();
      }
    };

    return {
      eventId: 0,
      newEvent: {
        title: '',
        description: '',
        categoryIds: [],
        date: '',
        time: '',
        isOnline: false,
        url: '',
        venue: '',
        capacity: 0,
        requiresAttendanceControl: true,
        fee: 0
      },
      hasImage: false,

      rules: {
        title: [
          {required: true, message: 'Please input Title', trigger: 'blur'},
          {min: 0, message: 'Length should at least one', trigger: 'blur'}
        ],
        categoryIds: [
          {required: true, message: 'Please pick a category', trigger: 'change'}
        ],
        date: [
          {required: true, message: 'Please pick a date', trigger: 'change'},
          {type: 'date', message: 'The date must in the future', trigger: 'blur'},
          {validator: checkDate, trigger: 'blur'}
        ],
        time: [
          {required: true, message: 'Please pick a time', trigger: 'change'},
        ],
        description: [
          {required: true, message: 'Please input Describe', trigger: 'blur'},
          {min: 0, message: 'Length should at least one', trigger: 'blur'}
        ],
        capacity: [
          {required: true, message: 'Please input a Max capacity', trigger: 'blur'},
          {type: 'number', message: 'Please input a Number', trigger: 'blur'},
          {validator: validateCapacity, trigger: 'blur'}
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

      options: [],
      image: {
        imgUrl: '',
        imgBaseData: '',
        defaultImage: require('../assets/event-default.jpg'),
        initImage() {
          this.imgUrl = this.defaultImage;
        },
      },
    };
  },
  mounted() {
    this.initEventCreateAndEdit();
  },
  methods: {
    initEventCreateAndEdit() {
      this.getCategories();
      if (this.editModal) {
        this.editEventSetUp(this.editEventInfo);
      }
    },
    //todo modify the function
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
      this.eventId = event.eventId;
    },
    eventEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          this.$api.editEvent(this.eventId, this.newEvent, this.$currentUser.getToken())
              .then(() => {
                //todo then put event image
              })

        } else {

          return false;
        }
      });
      window.$('#editUserModal').modal('hide');//
    },

    eventCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.validateImage()) {
          this.$api.createEvent(this.setUpNewEventRequest, this.$currentUser.getToken())
              .then((response) => {
                this.eventId = response.data.eventId

              })
              .then(() => {
                this.putImage(this.eventId);
              })
              .catch((error) => {
                console.log(error);
              })

        } else {

          return false;
        }
      });
    },
    putImage: async function (eventId) {
      await this.$api.putEventImage(eventId, this.image, this.$currentUser.getToken())
          .then(() => {
            console.log(32222222222222222222222);
            // show successful
          })
          .catch((error) => {
            console.log(error);
          })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setUserImageDefault: function (e) {
      e.target.src = require('../assets/event-default.jpg');
    },

    openImage: function (event) {
      if (event.target.files[0]) {
        this.image.imgUrl = window.URL.createObjectURL(event.target.files[0]);
        this.hasImage = true;
        this.image.imgBaseData = this.$refs.file.files[0];
        console.log(this.image.imgBaseData);
        console.log(this.image.imgBaseData.type);
        event.target.value = '';
      }
    },
    removePhoto: function () {
      this.image.imgUrl = this.image.defaultImage;
      this.hasImage = false;
    },
    getCategories: async function () {
      await this.$api.getEventCategories()
          .then((response) => {
            this.setOption(response.data);
          })
          .catch((error) => {
            alert(error.message);
          })
    },
    setOption: function (categories) {
      this.options = [];
      categories.forEach((category) => {
        this.options.push({value: category.id, label: category.name});
      })
    },
    validateImage: function (e) {
      if (!this.hasImage) {
        this.$message.warning('Please Put a event Image');
        e.target.value = '';
        return false;
      } else {
        return true;
      }
    },
  },
  computed: {
    setUpNewEventRequest() {
      let date = this.newEvent.date.toString().split(' ').splice(0, 4).join(' ') + ' ' +
          this.newEvent.time.toString().split(' ').splice(4).join(' ');
      let requestBody = {
        title: this.newEvent.title,
        description: this.newEvent.description,
        categoryIds: Object.values(this.newEvent.categoryIds),
        date: moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss.SSS'),
        isOnline: this.newEvent.isOnline,
        url: this.newEvent.url,
        venue: this.newEvent.venue,
        requiresAttendanceControl: this.newEvent.requiresAttendanceControl,
        fee: this.newEvent.fee
      }
      if (this.newEvent.capacity !== 0) requestBody.capacity = this.newEvent.capacity;
      return requestBody;
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
