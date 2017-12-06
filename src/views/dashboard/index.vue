<template>
  <div class="dashboard-container">
    <div class="bd">
      <ul>
        <li class="item" v-for="item in list">
          <div class="title">{{item.name}}</div>
          <div class="content">
            <div class="count">{{item.value}}</div>
            <div class="desc">{{item.desc}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getDashboard} from '@/api/login'
  import {parseTime} from '@/utils/index'

  export default {
    name: 'dashboard',
    data() {
      return {
        list: {}
      }
    },
    created() {
      this.getInit()
    },
    methods: {
      getInit() {
        getDashboard().then(res => {
          if (res.code === 0) {
            this.list = res.data
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  ul, li {
    list-style: none;
  }

  .bd {
    padding: 20px;
    .item {
      float: left;
      min-width: 300px;
      border: 1px solid #d1dbe5;
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      margin-right: 20px;
      margin-bottom: 20px;
      .title {
        height: 45px;
        line-height: 45px;
        padding-left: 20px;
        border-bottom: 1px solid #d1dbe5;
        font-size: 20px;
        color: #444;
        font-weight: bold;
      }
      .content {
        box-sizing: border-box;
        padding: 10px 30px;
        height: 100px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .count {
          font-size: 26px;
          color: #555;
        }
        .desc {
          font-size: 16px;
        }
      }
    }
  }
</style>
