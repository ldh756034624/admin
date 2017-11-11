customer.vue
<template>
  <div class="app-container">
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
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
          <span>{{scope.row.withdrawalsMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现次数">
        <template scope="scope">
          <span>{{scope.row.withdrawalsCount }}</span>
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
        userId: null,
        tableData: null,    // 表格数据
        total: null        // 数据总数
      }
    },
    created() {
      this.userId = this.$route.query.id
      this.getTableData()
    },
    methods: {
      getTableData() {
        getTableData(`/account/${this.userId}/bankInfo`).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            this.tableData = res.data
          }
        })
      }
    }
  }
</script>
