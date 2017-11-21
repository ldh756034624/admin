<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="手机号">
          <el-input type="text" v-model="listQuery.phone"></el-input>
        </el-form-item>
        <el-form-item label="银行卡">
          <el-input type="text" v-model="listQuery.bankCardNo"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status">
            <el-option v-for="item in querySelect" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="UserId">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户银行">
        <template scope="scope">
          <span>{{scope.row.bankName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡号" width="200">
        <template scope="scope">
          <span>{{scope.row.bankCardNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="200">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status | status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleDetail(scope.row)">详情
          </el-button>
          <el-button size="small" type="warning" class="btn btn-sm btn-info" v-if="scope.row.status == 4" @click="handleSendBack(scope.row.id)">退回
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

    <!-- 详情窗口 -->
    <el-dialog title="详情" :visible.sync="dialogFormVisible" size="full">
      <el-form :model="temp" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{temp.urserId}}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{temp.name}}</span>
        </el-form-item>
        <el-form-item label="开户银行">
          <span>{{temp.bankName}}</span>
        </el-form-item>
        <el-form-item label="卡号">
          <span>{{temp.bankCardNo}}</span>
        </el-form-item>
        <el-form-item label="省市">
          <span>{{temp.provice + temp.city}}</span>
        </el-form-item>
        <el-form-item label="提现金额">
          <span>{{temp.money}}</span>
        </el-form-item>
        <el-form-item label="手续费">
          <span>暂无该字段</span>
        </el-form-item>
        <el-form-item label="提现时间">
          <span>{{temp.createTime | formatDateTime}}</span>
        </el-form-item>
        <el-form-item label="处理时间">
          <span>{{temp.finishTime | formatDateTime}}</span>
        </el-form-item>
        <el-form-item label="提现状态">
          <span>{{temp.status | status}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getTableData, sendBack} from '@/api/finance'

  const ERR_OK = 0
  export default {
    data() {
      return {
        querySelect: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '银行转账中',
            value: 2
          },
          {
            label: '银行转账完成',
            value: 3
          },
          {
            label: '银行转账失败',
            value: 4
          },
          {
            label: '退回',
            value: 5
          },
          {
            label: '提现异常',
            value: 6
          }
        ],
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          status: 6,
          phone: null,
          bankCardNo: null
        },
        temp: {
          urserId: null,
          nickName: null,
          bankName: null,
          bankCardNo: null,
          city: null,
          phoneType: null,
          money: null,
          createTime: null,
          status: null
        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        getTableData('/finance/withdraw_record/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleSendBack(id) {   // 退回
        this.$confirm('确定退回?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sendBack(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '退回成功!'
              })
              this.getTableData()
            }
          })
        })
      },
      handleDetail(row) {   // 查看详情
        this.temp = row   // 赋值
        this.dialogFormVisible = true
      },
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
            return '银行转账失败'
            break;
          case 5:
            return '退回'
            break;
          case 6:
            return '提现异常'
            break;
        }
      }
    }
  }
</script>
