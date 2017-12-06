<template>
  <div class="app-container">
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.bankName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省">
        <template scope="scope">
          <span>{{scope.row.bankCardNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="市">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleDetail(scope.row)">详情
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
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
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
      handleDetail(row) {   // 查看详情
        this.temp = row   // 赋值
        this.dialogFormVisible = true
      },
    }
  }
</script>
