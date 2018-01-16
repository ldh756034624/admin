<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="addRecharge">导入</el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="批次号">
        <template scope="scope">
          <span>{{scope.row.batchNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已充值数量/总数量">
        <template scope="scope">
          <span>{{scope.row.rechargeCountRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已充值金额/总金额">
        <template scope="scope">
          <span>{{scope.row.rechargeMoneyRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="导入时间">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="导入源文件">
        <template scope="scope">
          <span @click="goFile(scope.row.filePath)">{{scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button class="filter-item" type="primary" @click="goDetail(scope.row.id)" icon="search">查看</el-button>
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
        tableData: null    // 表格数据
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      addRecharge() {  // 跳转至导入
        this.$router.push({path: '/finance/rechargeAdd'})
      },
      goDetail (id) {
        this.$router.push({path: '/finance/rDetail', query: {id: id}})
      },
      getTableData() {
        this.loading = true
        getTableData('/batches').then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      goFile (filePath) {
        window.open(filePath)
      }
    }
  }
</script>
