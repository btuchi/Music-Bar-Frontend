<template>
    <div>
        <div v-for="(branch, index) in branchList" :key="index" style = "border:2px solid black; margin: 10px;">
            <div>{{branch.branch_name}}</div>
            <div>{{branch.branch_address}}</div>
            <div>{{branch.branch_open_time}} ~ {{ branch.branch_close_time }} </div>
            <div>{{branch.branch_phone}}</div>
            <div>{{branch.branch_address}}</div>
            <div v-if = "branch.distance">距您{{branch.distance.toFixed(2)}}km</div>
            <van-button type="primary" @click="chooseBranch(branch.branch_id, branch.branch_name)">选择该门店</van-button>
        </div>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import HTTP from '../utils/http'
  
  export default {
    name: 'BranchListView',
    components: {
      
    },
    data() {
        return {
            branchList: []
        }
    },
    created() {
        this.getBranchList()
    },
    methods: {
        chooseBranch(branch_id, branch_name) {
            let expiration = Date.now() + 1000 * 60 * 60 * 24 * 7
            console.log({branch_id: branch_id, expiration: expiration})
            console.log({branch_name: branch_name, expiration: expiration})
            localStorage.setItem('branch_id', JSON.stringify({branch_id: branch_id, expiration: expiration}))
            localStorage.setItem('branch_name', JSON.stringify({branch_name: branch_name, expiration: expiration}))
            this.$router.push('/')
        },
        getBranchList() {
            let that = this
            navigator.geolocation.getCurrentPosition(async function(position){
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                let res = await that.getBranchListMain(lat, lon)
                that.branchList = res.data
            },async function(error){
                console.log("Error occurred. Error code: " + error.code);
                let res = await that.getBranchListMain()
                that.branchList = res.data
            });
        },
        async getBranchListMain(lat = null, lon = null) {
            return await HTTP.request({
                url: '/branch/list',
                method: 'get',
                params: {
                    latitude: lat,
                    longitude: lon
                }
            })
        }
    }
  }
  </script>