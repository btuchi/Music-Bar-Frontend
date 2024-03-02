<template>
  <div>
    <div class="home">
      <van-button @click="chooseBranch"> 选择门店: </van-button> {{ currentBranch }}
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img :src="image" width="400" height="300" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div style="border: 2px black solid;margin-top:20px;">
      <div>门店名称: {{ branchInfo.branch_name }}</div>
      <div>门店地址: {{ branchInfo.branch_address }}</div>
      <div>门店电话: {{ branchInfo.branch_phone }}</div>
      <div>门店营业时间: {{ branchInfo.branch_open_time }} ~ {{ branchInfo.branch_close_time }}</div>
      <div v-if="branchInfo.distance">距您{{ branchInfo.distance.toFixed(2) }}km</div>
    </div>
    
    <van-button type="primary" @click="reserve">预定位置</van-button>
    <van-button type="primary" @click="order">点单</van-button>

  </div>
</template>

<script>
import HTTP from '../utils/http'

export default {
  name: 'HomeView',
  components: {
  },

  data() {
    return {
      images: [],
      currentBranch: '',
      currentBranch_id: '',
      latitude: null,
      longitude: null,
      branchInfo: {}
    }
  },

  async created() {
    this.getPoster()
    if (localStorage.getItem('branch_id') && JSON.parse(localStorage.getItem('branch_id')).expiration > Date.now()) {
      this.currentBranch = JSON.parse(localStorage.getItem('branch_name')).branch_name
      this.currentBranch_id = JSON.parse(localStorage.getItem('branch_id')).branch_id
    } else {
      await this.getUserPos()


    }
    let res = await HTTP.request({
      url: '/branch/detail',
      method: 'get',
      params: {
        branch_id: this.currentBranch_id
      }
    })
    this.branchInfo = res.data
  },
  methods: {
    reserve() {
      // this.$router.push('/reserve')
    },
    order() {
      this.$router.push('/order')
    },
    chooseBranch() {
      this.$router.push('/branchList')
    },
    async getUserPos() {
      let that = this
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async function (position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          that.latitude = lat
          that.longitude = lon
          that.getClosestBranch()
          resolve()
        }, async function (error) {
          console.log("Error occurred. Error code: " + error.code);
          that.getClosestBranch()
          resolve()
        });
      })
    },
    async getPoster() {
      let res = await HTTP.request({
        url: '/poster/list',
        method: 'get'
      })
      let images = []
      if (res.code == 0) {
        for (let i = 0; i < res.data.length; i++) {
          images.push(res.data[i].poster_image)
        }
        this.images = images
      }
    },
    async getClosestBranch() {
      let res = await HTTP.request({
        url: '/branch/closest',
        method: 'get',
        params: {
          latitude: this.latitude,
          longitude: this.longitude
        }
      })
      if (res.code == 0) {
        this.currentBranch = res.data.branch_name
        let expiration = Date.now() + 1000 * 60 * 60 * 24 * 7
        localStorage.setItem('branch_id', JSON.stringify({ branch_id: res.data.branch_id, expiration: expiration }))
        localStorage.setItem('branch_name', JSON.stringify({ branch_name: res.data.branch_name, expiration: expiration }))
      }
    }
  }

}
</script>
