<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式

  .pagination-container {
    margin-top: 30px;
    text-align: center;
  }

  .radio {
    position: relative;
    display: inline-block;
    margin-top: 0;
    margin-bottom: 0;
  }
</style>


