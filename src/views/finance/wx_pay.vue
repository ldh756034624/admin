<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="订单类型">
          <el-select v-model="listQuery.orderType">
            <el-option v-for="item in querySelect" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信订单编号">
          <el-input type="text" v-model="listQuery.wxOrderNo"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            @change="dateRangeChange"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
          <el-button class="filter-item" type="primary" @click="handleExport">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="微信订单编号">
        <template scope="scope">
          <span>{{scope.row.wxOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单类型">
        <template scope="scope">
          <span>{{scope.row.orderType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品订单">
        <template scope="scope">
          <span>{{scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付时间">
        <template scope="scope">
          <span>{{scope.row.payDate | formatDateTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="getTableData"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getTableData, exportExcel} from '@/api/finance'

  const ERR_OK = 0
  export default {
    data() {
      return {
        querySelect: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '充值',
            value: 1
          },
          {
            label: '购买',
            value: 2
          }
        ],
        dateRange: null,
        loading: false,
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          wxOrderNo: null,
          orderType: -1,
          startTime: null,
          endTime: null,
          page: 1,
          limit: 20
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      // 导出excel
      handleExport() {
        this.$confirm(`是否导出Excel?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportExcel(this.listQuery).then(res => {
            if (res.code === 0) {
              let datas = res.data
              window.location.href = datas
            }
          })
        })
      },
      dateRangeChange() {      // 获取时间范围
        if (!this.dateRange[0] || !this.dateRange[1]) {
          delete this.listQuery.startTime
          delete this.listQuery.endTime
          return
        }
        this.listQuery.startTime = new Date(this.dateRange[0]).getTime()
        this.listQuery.endTime = new Date(this.dateRange[1]).getTime()
      },
      getTableData() {
        this.loading = true
        getTableData('/order/wx/list', this.listQuery).then(res => {   // 获取tableData数据
          this.loading = false
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      }
    }
  }
</script>

<style lang="scss">
</style>
