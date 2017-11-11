<template>
  <div class="app-container">
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
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
      <el-table-column align="center" label="钱包">
        <template scope="scope">
          <span>{{scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="V币">
        <template scope="scope">
          <span>{{scope.row.vCoins }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleWallet(scope.row.userId)">钱包明细
          </el-button>
          <el-button size="small" type="success" @click="handleVCoin(scope.row.userId)">V币明细
          </el-button>
          <el-button size="small" type="info" @click="handleWithdraw(scope.row.userId)">提现明细
          </el-button>
          <el-button size="small" type="success" @click="handleBankCard(scope.row.userId)">银行卡
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
  import {getTableData} from '@/api/finance'

  const ERR_OK = 0
  export default {
    data() {
      return {
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        getTableData('/account/list', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleWallet(id) {
        this.$router.push({path: '/finance/moneyDetail', query: {id}})
      },
      handleVCoin(id) {
        this.$router.push({path: '/finance/vDetail', query: {id}})
      },
      handleWithdraw(id) {
        this.$router.push({path: '/finance/withdrawDetail', query: {id}})
      },
      handleBankCard(id) {
        this.$router.push({path: '/finance/bankCard', query: {id}})
      },
    }
  }
</script>
