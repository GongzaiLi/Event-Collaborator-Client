<template>
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">

          <div class="card-body">
            <div>
              <!--can change width and height-->
              <img :src="require('../assets/event-default.jpg')" class="img-thumbnail rounded mx-auto d-block"
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
                <!--                <el-col :span="11">-->
                <!--                </el-col>-->
                <el-date-picker type="date" placeholder="Pick a date" v-model="newEvent.date"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>


              <el-form-item label="Online" prop="delivery">
                <el-switch v-model="newEvent.isOnline"></el-switch>
              </el-form-item>

<!--              <el-form-item>-->
<!--                <el-alert-->
<!--                    title="0 means no limit on the number of attendees"-->
<!--                    type="info"-->
<!--                    show-icon />-->
<!--              </el-form-item>-->

              <el-form-item label="Capacity: " prop="capacity" placeholder="O means no limit on the number of attendees">

                <el-input v-model="newEvent.capacity"></el-input>
              </el-form-item>

              <el-form-item label="Describe: " prop="desc">
                <el-input type="textarea" v-model="newEvent.description"></el-input>
              </el-form-item>


              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
                <el-button @click="resetForm('ruleForm')">Reset</el-button>
              </el-form-item>
            </el-form>


          </div>
          <!--                    <div v-if="error.length" class="alert alert-danger alert-dismissible fade show" role="alert"-->
          <!--                         style="margin-top: 0.2em">-->
          <!--                      {{ error }}-->
          <!--                    </div>-->
        </div>
      </div>

    </div>


  </div>
</template>

<script>
export default {
  name: "event-create-edit",
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
          {required: true, message: 'Please input Activity name', trigger: 'blur'},
          {min: 1, message: 'Length should be 3 to 5', trigger: 'blur'}
        ],
        category: [
          {required: true, message: 'Please select Activity zone', trigger: 'change'}
        ],
        date: [
          {type: 'date', required: true, message: 'Please pick a date', trigger: 'change'}
        ],
        desc: [
          {required: true, message: 'Please input activity form', trigger: 'blur'}
        ],
        capacity: [
          {type: 'number', required: true, message: 'Please input activity form', trigger: 'blur'},
          {min: -1, message: '0 means no limit on the number of attendees', trigger: 'blur'},
          {step: 1, message: 'Must be a Integer', trigger: 'blur'}
        ]
      },
      defaultImage: require('../assets/profile-default.png'),
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
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
  }
}
</script>

<style scoped>

</style>