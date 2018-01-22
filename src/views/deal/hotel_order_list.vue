<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="订单编号">
          <el-input type="text" v-model="listQuery.hotelOrderId"></el-input>
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
      <el-radio-button :label="0">全部</el-radio-button>
      <el-radio-button :label="1">待支付</el-radio-button>
      <el-radio-button :label="2">待确认</el-radio-button>
      <el-radio-button :label="3">成功</el-radio-button>
      <el-radio-button :label="4">已退款</el-radio-button>
      <el-radio-button :label="5">已取消</el-radio-button>
    </el-radio-group>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="订单编号">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店名称">
        <template scope="scope">
          <span>{{scope.row.hotelName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="房间名称">
        <template scope="scope">
          <span>{{scope.row.roomTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template scope="scope">
          <span>{{scope.row.phone || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入住人">
        <template scope="scope">
          <span>{{scope.row.roomer}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总金额">
        <template scope="scope">
          <span>{{scope.row.totalMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template scope="scope">
          <span>{{scope.row.statusDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="入住时间">
        <template scope="scope">
          <span>{{scope.row.comeRoomTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="离店时间">
        <template scope="scope">
          <span>{{scope.row.outRoomTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" v-if="scope.row.canAffirm" type="primary" @click="handleConfirm(scope.row.id, 1)">确认
          </el-button>
          <el-button size="small" v-if="scope.row.canRefund" type="danger" @click="handleConfirm(scope.row.id, 2)">退款
          </el-button>
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleShow(scope.row.id)">查看
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
      <el-form :model="temp" label-width="150px">

        <el-row>
          <!--左-->
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="房间类型">
                <span>{{temp.roomTypeName }}</span>
              </el-form-item>
              <el-form-item label="房间数量">
                <span>{{temp.roomCount }}</span>
              </el-form-item>
              <el-form-item label="入住/离店">
                <span>{{temp.comeAndOutDate }}</span>
              </el-form-item>
              <el-form-item label="入住人">
                <span>{{temp.roomer }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{temp.phone }}</span>
              </el-form-item>
              <el-form-item label="房间单价">
                <span>{{temp.roomPrice }}</span>
              </el-form-item>
              <el-form-item label="总价">
                <span>{{temp.roomPrice * temp.roomCount}}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <span>{{temp.orderStatus }}</span>
              </el-form-item>
            </div>
          </el-col>
          <!--右-->
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="酒店名称">
                <span>{{temp.hotelName }}</span>
              </el-form-item>
              <el-form-item label="酒店地址">
                <span>{{temp.hotelAddress }}</span>
              </el-form-item>
              <el-form-item label="酒店电话">
                <span>{{temp.hotelPhone }}</span>
              </el-form-item>
              <el-form-item label="是否含早">
                <span>{{temp.include }}</span>
              </el-form-item>
              <el-form-item label="保留到">
                <span>{{temp.keepTime }}</span>
              </el-form-item>
              <el-form-item label="住宿偏好">
                <span>{{temp.roomStyle }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{temp.remarks }}</span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <h1 class="title">支付详情</h1>
        <el-table :data="temp.payInfoList" border fit highlight-current-row
                  style="width: 100%">
          <el-table-column align="center" label="ID">
            <template scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="方式">
            <template scope="scope">
              <span>{{scope.row.payMethod}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="金额">
            <template scope="scope">
              <span>{{scope.row.money}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template scope="scope">
              <span>{{scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template scope="scope">
              <span>{{scope.row.status}}</span>
            </template>
          </el-table-column>
        </el-table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getTableData, changeHotelOrder} from '@/api/order'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        select: [],
        temp: {           // 弹窗内容数据对象
          roomTypeName: null,
          comeAndOutDate: null,
          roomer: null,
          phone: null,
          roomPrice: null,
          roomCount: null,
          orderStatus: null,
          hotelName: null,
          hotelAddress: null,
          hotelPhone: null,
          include: null,
          keepTime: null,
          roomStyle: null,
          remarks: null,
          payInfoList: null
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dateRange: null,
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          hotelOrderId: null, // 订单编号
          phone: null,
          startDate: null,
          endDate: null,
          status: 0
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.loading = true
        getTableData('/hotel/orders', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          roomTypeName: null,
          comeAndOutDate: null,
          roomer: null,
          phone: null,
          roomPrice: null,
          roomCount: null,
          orderStatus: null,
          hotelName: null,
          hotelAddress: null,
          hotelPhone: null,
          include: null,
          keepTime: null,
          roomStyle: null,
          remarks: null,
          payInfoList: null
        }
      },
      dateRangeChange() {      // 获取时间范围
        if (!this.dateRange[0] || !this.dateRange[1]) {
          delete this.listQuery.startDate
          delete this.listQuery.endDate
          return
        }
        this.listQuery.startDate = new Date(this.dateRange[0]).getTime()
        this.listQuery.endDate = new Date(this.dateRange[1]).getTime()
      },
      handleConfirm(id, type) { // 确认或者取消订单 1确认，2退款
        let txt = type == 2 ? '退款' : '确认'
        this.$confirm(`是否${txt}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            hotelOrderId: id,
            status: type
          }
          changeHotelOrder(data).then((res) => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          })
        })
      },
      // 查看
    handleShow(id) {
      this.resetTemp()
      this.dialogFormVisible = true
      getTableData('/hotel/order/detail/' + id).then(res => {
        console.log(res)
          if (res.code === ERR_OK) {
            console.log(res.data)
            this.temp = Object.assign(this.temp, res.data)
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
