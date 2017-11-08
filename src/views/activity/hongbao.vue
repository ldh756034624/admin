function_assort.vue
<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
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
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleDetail(null)" icon="menu">所有参与记录
      </el-button>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑奖码">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发起人UserId">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品">
        <template scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参与人数">
        <template scope="scope">
          <span>{{scope.row.partakeCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总金额">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleDetail(scope.row.code)">详情
          </el-button>
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
  import {getTableData} from '@/api/activity'

  const ERR_OK = 0
  export default {
    data() {
      return {
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          enable: '1',
          name: null,
          id: null
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          code: null
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      handleDetail(code) {  // 跳转至功能列表
        this.$router.push({path: '/activity/hongbaoPeople', query: {code}})
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
        getTableData('/activity/lottery/page', this.listQuery).then(res => {   // 获取tableData数据
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
