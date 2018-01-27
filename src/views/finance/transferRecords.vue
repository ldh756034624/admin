<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="转账分类">
          <el-select v-model="listQuery.type">
            <el-option v-for="item in querySelect" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款人手机号">
          <el-input type="text" v-model="listQuery.originPhone"></el-input>
        </el-form-item>
        <el-form-item label="收款人手机号">
          <el-input type="text" v-model="listQuery.targetPhone"></el-input>
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
    <el-table v-loading="loading" element-loading-text="拼命加载中"  :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="转账分类">
        <template scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款人">
        <template scope="scope">
          <span>{{scope.row.originUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款人">
        <template scope="scope">
          <span>{{scope.row.targetUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.time}}</span>
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
        querySelect: [
          {
            label: '直接转账',
            value: 1
          },
          {
            label: '推广红包',
            value: 2
          }
        ],
        dateRange: null,
        loading: false,
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          title: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
          fontColor: [{required: true, message: '请输入颜色', trigger: 'blur'}]
        },
        listQuery: {  // 关键字查询，翻页等数据
          page: 1,
          limit: 20,
          type: null,
          originPhone: null,
          targetPhone: null,
        }
      }
    },
    created() {
      this.getTableData()
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
      getTableData() {
        this.loading = true
        getTableData('/transaction/transfer', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      // resetTemp() {   // 重置弹出表格
      //   this.temp = {      // 清空内容数据对象
      //     bankImg: null,
      //     bankName: null,
      //     color: null,
      //     status: null,
      //     code: null
      //   }
      // }
    }
  }
</script>

<style lang="scss">
</style>
