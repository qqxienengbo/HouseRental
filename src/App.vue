<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default{
    created(){
      localStorage.removeItem("user");
    }
  }
</script>

<style>

</style>
