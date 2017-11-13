<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="filter-container">
        <el-form inline>
          <el-form-item label="手机号">
            <el-input type="text" v-model="listQuery.phone"></el-input>
          </el-form-item>
          <el-form-item label="兑换码">
            <el-input type="text" v-model="listQuery.code"></el-input>
          </el-form-item>
          <el-form-item label="提交时间">
            <el-date-picker
              v-model="dateRange"
              @change="dateRangeChange"
              type="daterange"
              placeholder="选择日期范围">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleTransfer">转账
      </el-button>
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleTransfered" icon="edit">
        已操作转账记录
      </el-button>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" border fit highlight-current-row
              style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template scope="scope">
          <span>{{scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑奖码">
        <template scope="scope">
          <span>{{scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发奖时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
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
  import {getTableData, transfer} from '@/api/finance'

  const ERR_OK = 0
  export default {
    data() {
      return {
        dateRange: null,  // 时间范围
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          phone: null,
          code: null,
          startTime: null,
          endTime: null
        }
      }
    },
    created() {
    },
    methods: {
      dateRangeChange() {      // 获取时间范围
        if (!this.dateRange[0] || !this.dateRange[1]) {
          delete this.listQuery.startTime
          delete this.listQuery.endTime
          return
        }
        this.listQuery.startTime = new Date(this.dateRange[0]).getTime()
        this.listQuery.endTime = new Date(this.dateRange[1]).getTime()
      },
      handleSelectionChange(val) {  // 多表格勾选时
        let ids = []
        val.forEach(item => {
          ids.push(item.id)
        })
        this.ids = ids
      },
      handleTransfered() {  // 跳转至功能列表
        this.$router.push({path: '/finance/transfered'})
      },
      getTableData() {
        getTableData('/finance/lottery/flow/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleTransfer() {  // 转账
        if (this.ids.length > 0) {
          this.$confirm(`确定转账?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            transfer({ids: this.ids}).then((res) => {
              if (res.code === 0) {
                this.$message.success('操作成功')
                this.getTableData()
              }
            })
          })
        }
      }
    }
  }
</script>
