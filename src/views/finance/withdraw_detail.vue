customer.vue
<template>
  <div class="app-container">
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单号">
        <template scope="scope">
          <span>{{scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现金额">
        <template scope="scope">
          <span>{{scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手续费">
        <template scope="scope">
          <span>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现银行">
        <template scope="scope">
          <span>{{scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现状态">
        <template scope="scope">
          <span>{{scope.row.status | status}}</span>
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
      <el-table-column align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.finishTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
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
  import {getTableData} from '@/api/finance'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        userId: null,
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
        }
      }
    },
    created() {
      this.userId = this.$route.query.id
      this.getTableData()
    },
    methods: {
      getTableData() {
        let _this = this
        this.loading = true
        getTableData(`/account/withdraw/flow/${_this.userId}`, this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      }
    },
    filters: {
      status(val) {
        switch (val) {
          case 2:
            return '银行转账中'
            break;
          case 3:
            return '银行转账完成'
            break;
          case 4:
            return '提现异常'
            break;
          case 5:
            return '退回'
            break;
        }
      }
    }
  }
</script>
