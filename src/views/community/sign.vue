<template>
  <div class="app-container">
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="头像">
        <template scope="scope">
          <img :src="scope.row.avatar" width="70">
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID" width="65">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="奖励">
        <template scope="scope">
          <span>{{scope.row.cashBackMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="连续签到">
        <template scope="scope">
          <span>{{scope.row.signDays}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总签到">
        <template scope="scope">
          <span>{{scope.row.signCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签到时间">
        <template scope="scope">
          <span>{{scope.row.newCreateTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="getTableData"
        :current-page.sync="listQuery.pageNumber"
        :page-size="listQuery.pageSize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getTableData} from '@/api/community_content'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.loading = true
        getTableData('sign/getSign', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      }
    }
  }
</script>
