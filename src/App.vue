<template>
  <div id="app">
    <el-affix>
      <Navbar/>
    </el-affix>
    <router-view v-slot="{ Component }" v-if="isRouterAlive"><!-- v-if="isRouterAlive"-->
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive"/>
    </router-view>
  </div>
</template>

<script>
import Navbar from "./components/modals/Navbar";

export default {
  name: 'App',
  components: {
    Navbar,
  },
  provide() {// can inject very deep components
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      })
    }
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*margin-top: 60px;*/
}
</style>
