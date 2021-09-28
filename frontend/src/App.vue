<template>
  <div id="app">
    <header>
      <div class="titleDiv">
        <img src="123.PNG">
      </div>
    </header>
    <HeadMenu/>
    <router-view/>
  </div>
  
</template>

<script>
import HeadMenu from '@/components/HeadMenu'

export default {
  data(){
    return{
      userId:"",
    }
  },
  created(){
    // 새로고침 시 유지항목
    // 1. url
    const url = this.$cookies.get('url');
    if(url){
      this.$router.push({name: url}).catch(() => {});
    }
  },
  components:{
    HeadMenu,
  },
  methods:{
  }
}
</script>

<style>
body{
  min-width: 1200px;
}
header {
  height: 60px;
  background-color: rgb(221, 221, 214);
}
</style>
