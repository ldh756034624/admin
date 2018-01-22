<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="订单编号">
          <el-input type="text" v-model="listQuery.hotelOrderId"></el-input>
        </el-form-item>
        <el-form-item label="付款人手机号">
          <el-input type="text" v-model="listQuery.phone"></el-input>
        </el-form-item>
        <el-form-item label="收款人手机号">
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
  </div>
</template>

<script>
  import {getTableData} from '@/api/order'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: true,
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
