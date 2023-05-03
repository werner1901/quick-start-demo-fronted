<template>
  <div id="app">
    <UserManage />
  </div>
</template>

<script>
import UserManage from './view/user/index.vue'

export default {
  name: 'App',
  components: {
    UserManage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
