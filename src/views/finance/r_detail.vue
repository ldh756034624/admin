<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="batchRecharge" v-loading="loading">充值</el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :data="tableData" border fit highlight-current-row
    :row-class-name="tableRowStatusClass"
              style="width: 100%">
      <el-table-column
        type="selection"
        :selectable="tableRowStatus"
        width="55">
      </el-table-column>
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
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template scope="scope">
          <span>{{scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值金额">
        <template scope="scope">
          <span>{{scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值时间">
        <template scope="scope">
          <span>{{scope.row.rechargeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.statusDesc}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
  title="确定充值？"
  :visible.sync="dialogVisible"
  size="tiny">
  <p>总金额：{{totalNum}}<p><p>人数：{{ids.length}}</p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onConfirm">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
  import {getTableData, batchRecharge} from '@/api/finance'
import {MessageBox} from 'element-ui'
  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        ids: [],
        dialogVisible: false,
        id: this.$route.query.id || 0,
        tableData: null    // 表格数据
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      tableRowStatus (row, index) {
        if (row.status === 2) {
          return true
        } else {
          return false
        }
      },
      tableRowStatusClass (row, index) {
        if (row.status === 2) {
          return 'warning-row';
        } else if (row.status === 1) {
          return 'success-row';
        } else if (row.status === 3) {
          return 'err-row';
        }
        return '';
      },
      batchRecharge() {  // 批量充值
        if (this.ids.length < 1) {
          this.$message.error('您还未勾选')
          return
        }
        this.dialogVisible = true
      },
      onConfirm () {
        const self = this
        self.loading = true
        batchRecharge({ids: self.ids}).then(res => {
          if (res.code === 0) {
            self.$message.success('充值成功')
            self.dialogVisible = false
            self.loading = false
            setTimeout(() => {
              self.getTableData()
            }, 500)
          }
        })
      },
      handleSelectionChange(val) {  // 多表格勾选时
        let ids = []
        val.forEach(item => {
          ids.push(item.id)
        })
        this.ids = ids
      },
      getTableData() {
        this.loading = true
        getTableData('/batch/record/'+this.id).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            this.tableData = res.data
            this.loading = false
          }
        })
      },
      goFile (filePath) {
        window.open(filePath)
      }
    },
    computed: {
      totalNum: function () {
        const self = this
        // 没有水票直接跳过
        if (self.ids.length < 1) {
          return 0
        }
        let num = 0
        self.tableData.forEach(function(item){
          self.ids.forEach(function(itemN){
            if (item.id === itemN) {
              num+=parseInt(item.money)
            }
          })
        })
        // 减去商品的售价
        return num
      }
    }
  }
</script>
<style type="text/css" >
  .el-table .warning-row {
    background: #fff;
  }

  .el-table .success-row {
    background: #D9FFFF;
  }

  .el-table .err-row {
    background: #FFB5B5;
  }
</style>