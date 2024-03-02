<template>
  <div id="app">
    <van-nav-bar :title="nameMap[$route.name]" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft"
      v-if = "visibleRoute.indexOf($route.name) == -1" />
    <router-view />
    <van-tabbar v-model="$route.name" @change="onChange" v-if="visibleRoute.indexOf($route.name) != -1">
      <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="activity" icon="search">活动</van-tabbar-item>
      <van-tabbar-item name="info" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import HTTP from './utils/http'
export default ({
  data() {
    return {
      visibleRoute: ['home','activity', 'info'],
      nameMap: {
        'home': '首页',
        'activity': '活动',
        'info': '我的',
        'branchList': '选择门店',
        'login': '登录',
        'order': '点单',
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async onChange(name) {
      if (name === 'home') {
        this.$router.push('/')
      } else {
        let isLogin = true
        let token = localStorage.getItem('token')
        if (!token) {
          isLogin = false
        } else {
          let res = await HTTP.request({
            url: '/token/validate',
            method: 'post',
            data: {
              token: token
            }
          })
          if (res.data.res) {
            isLogin = true
          } else {
            isLogin = false
          }

        }
        if (!isLogin) {
          localStorage.clear()
          this.$router.push('/login')
          return
        }
        this.$router.push('/' + name)

      }
    }
  }
})
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
