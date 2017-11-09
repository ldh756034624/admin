<template>
  <div class="app-container">
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
          <span>{{scope.row.bannerCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户银行">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡号">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对账">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleDetail(scope.row)">详情
          </el-button>
          <el-button size="small" type="warning" class="btn btn-sm btn-info" @click="handleDetail(scope.row)">退回
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
          <span>{{temp.phone}}</span>
        </el-form-item>
        <el-form-item label="开户银行">
          <span>{{temp.money}}</span>
        </el-form-item>
        <el-form-item label="卡号">
          <span>{{temp.urserId}}</span>
        </el-form-item>
        <el-form-item label="省市">
          <span>{{temp.ip}}</span>
        </el-form-item>
        <el-form-item label="提现金额">
          <span>{{temp.phoneType}}</span>
        </el-form-item>
        <el-form-item label="手续费">
          <span>{{temp.version}}</span>
        </el-form-item>
        <el-form-item label="提现时间">
          <span>{{temp.createTime | formatDateTime}}</span>
        </el-form-item>
        <el-form-item label="回调时间">
          <span>{{temp.createTime | formatDateTime}}</span>
        </el-form-item>
        <el-form-item label="提现状态">
          <span>{{temp.createTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {addFn, upadateFn, getTableData} from '@/api/community_content'
  import {isPhone} from '@/utils/validate'

  const ERR_OK = 0
  export default {
    data() {
      return {
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20
        },
        temp: {

        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
      }
    },
    created() {
      this.getTableData()
      if (this.$route.query.code) {
        this.listQuery.code = this.$route.query.code
      }
    },
    methods: {
      getTableData() {
        getTableData('/activity/lottery/flow/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleDetail(row) {   // 查看详情
        this.temp = row
        this.dialogFormVisible = true
      }
    }
  }
</script>
