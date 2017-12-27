<template>
  <div class="app-container">
    <div class="userInfo">
      <div class="avatar-wrapper" v-if="userInfo">
        <img :src="userInfo.avatar" class="avatar" width="100" height="100">
        <el-tag type="success">{{userInfo.isAdmin}}</el-tag>
        <el-tag type="success">{{userInfo.status}}</el-tag>
      </div>
      <div class="info-wrapper">
        <div class="left">
          <el-form label-width="100px">
            <el-form-item label="昵称">
              <span>{{userInfo.nickName || '无'}}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{userInfo.phone}}</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{userInfo.createTime | formatDateTime}}</span>
            </el-form-item>
            <el-form-item label="最后登录时间">
              <span>{{userInfo.lastLoginTime | formatDateTime}}</span>
            </el-form-item>
            <el-form-item label="登录次数">
              <span>{{userInfo.loginCount}}</span>
            </el-form-item>
            <el-form-item label="openid">
              <span>{{userInfo.openId || '无'}}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-form :model="extendsInfo" label-width="100px">
            <el-form-item label="性别">
              <span>{{extendsInfo.sex || '无'}}</span>
            </el-form-item>
            <el-form-item label="生日">
              <span>{{extendsInfo.birthday | formatDate}}</span>
            </el-form-item>
            <el-form-item label="学历">
              <span>{{extendsInfo.education || '无'}}</span>
            </el-form-item>
            <el-form-item label="职业">
              <span>{{extendsInfo.job || '无'}}</span>
            </el-form-item>
            <el-form-item label="情感">
              <span>{{extendsInfo.marriageStatus || '无'}}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="title">银行卡</div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="bankInfo" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="持卡人姓名">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡号">
        <template scope="scope">
          <span>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省">
        <template scope="scope">
          <span>{{scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="市">
        <template scope="scope">
          <span>{{scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现金额">
        <template scope="scope">
          <span>{{scope.row.withdrawMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现次数">
        <template scope="scope">
          <span>{{scope.row.withdrawCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="title">收货地址</div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="addressInfo" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否默认">
        <template scope="scope">
          <span>{{scope.row.defaultAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货人">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货地址">
        <template scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getTableData} from '@/api/finance'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        userId: null,
        addressInfo: null,
        bankInfo: null,
        extendsInfo: null,
        userInfo: null
      }
    },
    created() {
      this.userId = this.$route.query.id
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {  // 获取用户信息
        this.loading = true
        getTableData('/user/info/' + this.userId).then(res => {   // 获取tableData数据
          if (res.code === ERR_OK) {
            this.addressInfo = res.data.userAddressInfoVOList // 地址信息
            this.bankInfo = res.data.userBankInfoVOList // 银行信息
            this.extendsInfo = res.data.userExtendsInfoVO // 额外信息
            this.userInfo = res.data.userInfoVO // 用户信息
            this.loading = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .info-wrapper {
    display: flex;
    &>div{
      flex: 1;
    }
  }

  .title {
    font-size: 16px;
    padding-left: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
    border-left: 2px solid #1c8de0;
  }

  .avatar-wrapper{
    .avatar{
      border: 1px solid #ccc;
    }
  }
</style>
