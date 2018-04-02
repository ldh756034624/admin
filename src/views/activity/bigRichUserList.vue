<template>
  <div class="app-container">
    <el-table v-loading="loading"
              element-loading-text="拼命加载中"
              :data="tableData"
              border
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center"
                       label="序号"
                       width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="用户手机号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="用户名">
        <template scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="订单号"
                       width="310">
        <template scope="scope">
          <span>{{scope.row.startTime}}xxxx</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="奖励金额">
        <template scope="scope">
          <span>{{scope.row.money || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="参与期数">
        <template scope="scope">
          <span>{{scope.row.activity_number }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @current-change="getTableData"
                     :current-page.sync="listQuery.pageNumber"
                     :page-size="listQuery.pageSize"
                     layout="total, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getTableData } from "@/api/base"

const ERR_OK = 0
export default {
  data() {
    return {
      loading: false,
      tableData: null, // 表格数据
      total: null, // 数据总数
      listQuery: {
        // 关键字查询，翻页等数据
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
      getTableData("/activity/bigRich/users/" + this.$route.query.id).then(
        res => {
          // 获取tableData数据
          if (res.code === ERR_OK) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        }
      )
    }
  }
}
</script>
