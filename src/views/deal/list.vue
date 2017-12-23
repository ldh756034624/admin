<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="订单编号">
          <el-input type="text" v-model="listQuery.no"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input type="text" v-model="listQuery.phone"></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
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
    <el-radio-group v-model="listQuery.status">
      <el-radio-button :label="-1">全部</el-radio-button>
      <el-radio-button :label="0">未确认</el-radio-button>
      <el-radio-button :label="1">等待发货</el-radio-button>
      <el-radio-button :label="2">等待收货</el-radio-button>
      <el-radio-button :label="3">已取消</el-radio-button>
      <el-radio-button :label="4">交易成功</el-radio-button>
      <el-radio-button :label="5">交易失败</el-radio-button>
      <el-radio-button :label="6">退货受理中</el-radio-button>
      <el-radio-button :label="7">退货中</el-radio-button>
      <el-radio-button :label="8">不予退货</el-radio-button>
      <el-radio-button :label="9">退货完成</el-radio-button>
    </el-radio-group>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="订单编号">
        <template scope="scope">
          <span>{{scope.row.id || '无'}}</span>
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
          <span>{{scope.row.userId || '无'}}</span>
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
          <span>{{scope.row.statusDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" v-if="scope.row.status == 0" type="primary" @click="handleConfirm(scope.row.id, 1)">确认
          </el-button>
          <el-button size="small" v-if="scope.row.status == 0" type="danger" @click="handleConfirm(scope.row.id, 3)">取消
          </el-button>
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row.id)">{{scope.row.status == 1 ? '发货' : '查看'}}
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
          <span>{{temp.id}}</span>
        </el-form-item>
        <el-form-item label="商品名称">
          <span>{{temp.goods}}</span>
        </el-form-item>
        <el-form-item label="用户ID">
          <span>{{temp.userId || '无'}}</span>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>{{temp.createTime | formatDateTime}}</span>
        </el-form-item>
        <h1 class="title">支付信息</h1>
        <el-form-item label="支付方式">
          <span>{{temp.payMethodDesc}}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{temp.payMoney}}</span>
        </el-form-item>
        <el-form-item label="支付状态">
          <span>{{temp.payStatusDesc}}</span>
        </el-form-item>
        <h1 class="title">配送信息</h1>
        <el-form-item label="收货人">
          <span>{{temp.userName}}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{temp.userPhone}}</span>
        </el-form-item>
        <el-form-item v-if="temp.orderType == 1" label="收货地址">
          <el-input class="w30" v-model="temp.userAddres"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.orderType == 1" label="快递公司" prop="fontColor">
          <el-select v-model="temp.expressName" placeholder="请选择">
            <el-option v-for="item in select" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.orderType == 1" label="快递单号">
          <el-input class="w30" v-model="temp.expressNum"></el-input>
        </el-form-item>
        <el-form-item v-if="temp.didiCardNumber && temp.didiCardNumber != 'null'" label="券号">
          <span>{{temp.didiCardNumber}}</span>
        </el-form-item>
        <el-form-item v-if="temp.tel" label="充值手机号">
          <span>{{temp.tel}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="update" v-if="temp.orderType == 1 && temp.status == 1">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getTableData, updateOrder, orderConfirm} from '@/api/order'

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
          expressNum: null,
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
        dialogFormVisible: false,
        dateRange: null,
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          no: null,
          phone: null,
          startTime: null,
          endTime: null,
          status: 0
        }
      }
    },
    created() {
      this.getTableData()
      this.getExpressCompany()
    },
    methods: {
      getTableData() {
        getTableData('/order/list', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
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
      getExpressCompany() {  // 获取所有物流公司
        getTableData('/order/supportExpress').then(res => {
          if (res.code === 0) {
            let select = []
            res.data.forEach((item, index) => {
              let tmp = {
                val: index,
                label: item
              }
              select.push(tmp)
            })
            this.select = select
          }
        })
      },
      handleConfirm(id ,type) { //todo 确认或者取消订单 1确认，3取消
        let txt = type == 3 ? '取消' : '确认'
        this.$confirm(`是否${txt}订单?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          orderConfirm(id, type).then((res) => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          })
        })
      },
      handleUpdate(id) {   // 点击编辑功能按钮
        this.resetTemp()
        getTableData(`/order/${id}`).then(res => {
          if (res.code === 0) {
            console.log(res.data)
            this.temp = Object.assign(this.temp, res.data)   // 赋值
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
          }
        })
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          didiCardNumber: null,
          expressName: null,
          goods: null,
          id: null,
          expressNum: null,
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
    },
    watch: {
      'listQuery.status'() {
        this.getTableData()
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
