<template>
  <div class="about">
    我的
    {{ username }}
    <van-button type="primary" @click="logout">退出登录</van-button>
  </div>
</template>

<script>

import HTTP from '../utils/http'
export default {
  name: 'InfoView',
  components: {
  },
  data() {
    return {
      username: '',
    }
  },
  async created() {
    let res = await HTTP.request({
      url: '/user/info',
      method: 'get'
    })
    this.username = res.data.user_name

  },
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>