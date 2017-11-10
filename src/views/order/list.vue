<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="订单编号">
        <template scope="scope">
          <span>{{scope.row.no || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template scope="scope">
          <span>{{scope.row.goods}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量">
        <template scope="scope">
          <span>{{scope.row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.userPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货人" width="100">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="快递名称">
        <template scope="scope">
          <span>{{scope.row.expressName || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">查看
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

    <!-- 弹出编辑和新增窗口 -->
    <el-dialog title="订单详情" :visible.sync="dialogFormVisible" size="full">
      <el-form :model="temp" label-width="100px">
        <h1 class="title">商品信息</h1>
        <el-form-item label="订单号">
          <span>{{temp.no}}</span>
        </el-form-item>
        <el-form-item label="商品名称">
          <span>{{temp.goods}}</span>
        </el-form-item>
        <el-form-item label="用户ID">
          <span>{{temp.userId }}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>{{temp.createTime | formatDateTime}}</span>
        </el-form-item>
        <h1 class="title">支付信息</h1>
        <el-form-item label="支付方式">
          <span>{{temp.payMethond}}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{temp.payMoney}}</span>
        </el-form-item>
        <el-form-item label="支付状态">
          <span>{{temp.payStatus}}</span>
        </el-form-item>
        <h1 class="title">配送信息</h1>
        <el-form-item label="收货人">
          <el-input class="w30" v-model="temp.userName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input class="w30" v-model="temp.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input class="w30" v-model="temp.userAddres"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="fontColor">
          <el-select v-model="temp.articleTypeId" placeholder="请选择">
            <el-option v-for="item in select" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input class="w30" v-model="temp.logisticsNumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create">创建</el-button>
        <el-button v-else type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getTableData, updateOrder} from '@/api/order'

  const ERR_OK = 0
  export default {
    data() {
      return {
        select: [],
        temp: {           // 弹窗内容数据对象
          didiCardNumber: null,
          expressName: null,
          goods: null,
          id: null,
          logisticsNumber: null,
          money: null,
          no: null,
          orderType: null,
          payMethodDesc: null,
          payMethond: null,
          payMoney: null,
          payStatus: null,
          status: null,
          userAddres: null,
          userId: null,
          userName: null,
          userPhone: null
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: true,
        rules: {
          title: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
          fontColor: [{required: true, message: '请输入颜色', trigger: 'blur'}]
        },
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20
        }
      }
    },
    created() {
      this.getTableData()
      this.getExpressCompany()
    },
    methods: {
      getExpressCompany() {  // 获取所有物流公司
        getTableData('/order/supportExpress').then(res => {
          if (res.code === 0) {
            let select = []
            res.data.data.forEach(item => {
              let tmp = {
                val: item.id,
                label: item.name
              }
              select.push(tmp)
            })
            this.select = select
            console.log('select', select)
          }
        })
      },
      getTableData() {
        getTableData('/order/list', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        this.resetTemp()
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          didiCardNumber: null,
          expressName: null,
          goods: null,
          id: null,
          logisticsNumber: null,
          money: null,
          no: null,
          orderType: null,
          payMethodDesc: null,
          payMethond: null,
          payMoney: null,
          payStatus: null,
          status: null,
          userAddres: null,
          userId: null,
          userName: null,
          userPhone: null
        }
      },
      update() {  // 确认编辑此条信息
        updateOrder(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('保存成功')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    font-size: 20px;
  }
</style>
