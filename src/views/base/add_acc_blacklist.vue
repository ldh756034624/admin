<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="filter-container">
        <el-form inline>
          <el-form-item label="提交时间">
            <el-date-picker
              v-model="dateRange"
              @change="dateRangeChange"
              type="daterange"
              placeholder="选择日期范围">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="UserID或手机号">
            <el-input type="text" v-model="listQuery.key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
            <el-button class="filter-item" type="primary" @click="clearQuery" icon="search">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <span>查询结果{{tableData.length}}条</span>
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleBlack">加入黑名单
      </el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中"  :data="tableData" @selection-change="handleSelectionChange" border fit highlight-current-row
              style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="UserID">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template scope="scope">
          <span>{{scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="openID">
        <template scope="scope">
          <span>{{scope.row.openId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开瓶次数">
        <template scope="scope">
          <span>{{scope.row.openCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参与次数">
        <template scope="scope">
          <span>{{scope.row.joinCount}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getTableData, accountToBlacklist} from '@/api/base'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        dateRange: null,  // 时间范围
        tableData: [],    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          phone: null,
          code: null,
          startTime: null,
          endTime: null
        }
      }
    },
    created() {
//      this.getTableData()
    },
    methods: {
      clearQuery() {  // 清空search
        this.listQuery = {
          startTime: null,
          endTime: null,
          key: null
        }
        this.dateRange = null
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
      handleSelectionChange(val) {  // 多表格勾选时
        let ids = []
        val.forEach(item => {
          ids.push(item.userId)
        })
        this.ids = ids
      },
      getTableData() {
        this.loading = true
        getTableData('/account/rewardInfo', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      handleBlack() {  // 拉黑
        if (this.ids.length > 0) {
          this.$confirm(`确定拉黑?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              userIds: this.ids,
              status: 1
            }
            accountToBlacklist(data).then((res) => {
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
