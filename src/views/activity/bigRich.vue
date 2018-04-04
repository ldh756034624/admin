<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item"
                 type="primary"
                 style="margin-left:10px"
                 @click="handleCreate"
                 icon="edit">新增期数
      </el-button>
    </div>
    <el-table v-loading="loading"
              element-loading-text="拼命加载中"
              :data="tableData"
              border
              fit
              highlight-current-row
              :row-class-name="tableRowClassName"
              style="width: 100%">
      <el-table-column align="center"
                       label="序号">
        <template scope="scope">
          <span>{{scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="期数">
        <template scope="scope">
          <span>{{scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="参与用户">
        <template scope="scope">
          <span style="color:rgb(91,192,222); cursor:pointer;"
                @click="handleUserList(scope.row.id,scope.row.joinCount)">{{scope.row.joinCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="奖励金额">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="中奖用户">
        <template scope="scope">
          <span>{{scope.row.winnerUser || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="活动区间">
        <template scope="scope">
          <span>{{scope.row.startTime | formatDateTime}} - {{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="开奖时间">
        <template scope="scope">
          <span>{{scope.row.startLotteryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="活动状态">
        <template scope="scope">
          <span>{{scope.row.activeStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="启用/禁用">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作">
        <template scope="scope">
          <el-button size="small"
                     type="info"
                     class="btn btn-sm btn-info"
                     v-if="scope.row.canEdit"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small"
                     :type="scope.row.statusInt == 1 ? 'danger' : 'success'"
                     @click="handleEnable(scope.row.id, scope.row.statusInt)">
            {{scope.row.statusInt == 1 ? '禁用' : '启用'}}
          </el-button>
          <el-button size="small"
                     type="success"
                     class="btn btn-sm btn-info"
                     v-if="scope.row.canAddUser "
                     @click="handleUser(scope.row.id)">添加用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @current-change="getTableData"
                     :current-page.sync="listQuery.pageNumber"
                     :page-size="listQuery.pageSize"
                     layout="total, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>

    <!-- 弹出编辑和新增窗口 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               size="full">
      <el-form :model="temp"
               ref="temp"
               label-width="100px"
               class="form30">
        <el-form-item label="活动区间"
                      class="red-star">
          <el-date-picker v-model="dateRange"
                          :disabled="dialogStatus === 'update' ? true : false"
                          @change="dateRangeChange"
                          type="datetimerange"
                          placeholder="选择日期时间范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开奖时间"
                      class="red-star">
          <el-date-picker v-model="dateTime"
                          @change="dateTimeChange"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="启用/禁用"
                      class="red-star">
          <div class="checkitem">
            <el-radio class="radio"
                      v-model="temp.statusInt"
                      :label="1">启用</el-radio>
            <el-radio class="radio"
                      v-model="temp.statusInt"
                      :label="0">禁用</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'"
                   type="primary"
                   @click="create">提交</el-button>
        <el-button v-else
                   type="primary"
                   @click="update">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加中奖总户弹框 -->
    <el-dialog title="添加中奖用户"
               :visible.sync="dialogFormVisible1"
               size="full">
      <el-form :model="temp1"
               ref="temp1"
               label-width="100px"
               class="form30">
        <el-form-item label="开奖金额">
          <el-input v-model="temp1.money"></el-input>
        </el-form-item>
        <el-form-item label="添加用户">
          <el-input v-model="temp1.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary"
                   @click="handleBigRichUser">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getTableData,
  addBigRich,
  updateBigRich,
  enableBigRich,
  addBigRichUser
} from "@/api/activity.js"

const ERR_OK = 0
export default {
  data() {
    return {
      loading: false,
      dateRange: null, // 时间范围
      dateTime: null, // 日期时间点
      // 弹窗内容数据对象
      temp: {
        startTime: null,
        endTime: null,
        id: null,
        startLotteryTime: null,
        statusInt: 1
      },
      temp1: {
        // 添加中奖用户
        money: null,
        phone: null
      },
      tableData: null, // 表格数据
      total: null, // 数据总数
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: "",
      listQuery: {
        pageNumber: 1,
        pageSize: 20
      },
      textMap: {
        update: "编辑",
        create: "新增"
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 获取列表数据
    getTableData() {
      this.loading = true
      getTableData("/activity/bigRiches", this.listQuery).then(res => {
        // 获取tableData数据
        if (res.code === 0) {
          let datas = res.data
          this.total = datas.total
          this.tableData = datas.data
          this.loading = false
        }
      })
    },
    handleUserList(id, num) {
      if (num == 0) {
        this.$message.error("没有用户")
        return
      }
      this.$router.push({
        path: "/activity/bigRich/bigRichUserList",
        query: { id }
      })
    },
    // todo
    handleEnable(id, status) {
      // let desc = type === 2 ? "下架" : "上架"
      let desc = status == 1 ? "禁用" : "启用"
      this.$confirm(`是否${desc}此商品?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        enableBigRich(id, status == 1 ? 0 : 1).then(res => {
          if (res.code === ERR_OK) {
            this.$message({
              type: "success",
              message: `${desc}成功!`
            })
            this.getTableData()
          }
        })
      })
    },
    // 添加中奖用户
    handleUser(id) {
      this.temp1 = {
        activityId: id,
        money: null,
        phone: null
      }
      this.dialogFormVisible1 = true
    },
    handleBigRichUser() {
      addBigRichUser(this.temp1).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible1 = false
          this.$message.success("添加成功")
        }
      })
    },
    dateTimeChange() {
      this.temp.startLotteryTime = +new Date(this.dateTime)
    },
    dateRangeChange() {
      // 获取时间范围
      this.temp.startTime = +new Date(this.dateRange[0])
      this.temp.endTime = +new Date(this.dateRange[1])
    },
    resetTemp() {
      // 重置弹出表格
      this.dateRange = []
      this.dateTime = null
      this.temp = {
        startTime: null,
        endTime: null,
        id: null,
        statusInt: 1,
        startLotteryTime: null
      }
    },
    handleCreate() {
      // 点击创建新功能按钮
      this.resetTemp() // 清空原有表单
      this.dialogStatus = "create"
      this.dialogFormVisible = true
    },
    create() {
      // 创建新功能
      this.temp.status = this.temp.statusInt
      addBigRich(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("创建成功")
        }
      })
    },
    handleUpdate(row) {
      // todo 点击编辑功能按钮
      // 状态数值有问题，没法保存
      this.resetTemp() // 清空原有表单
      this.dateRange.push(row.startTime, row.endTime) // 初始化时间
      this.dateTime = row.startLotteryTime
      this.temp = Object.assign(this.temp, row) // 赋值
      this.dialogStatus = "update"
      this.dialogFormVisible = true
    },
    update() {
      // 确认编辑此条信息
      this.temp.startTime = +new Date(this.temp.startTime)
      this.temp.endTime = +new Date(this.temp.endTime)
      this.temp.startLotteryTime = +new Date(this.temp.startLotteryTime)
      this.temp.status = this.temp.statusInt
      updateBigRich(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("保存成功")
        }
      })
    },
    // 改变每行颜色
    tableRowClassName(row, index) {
      if (row.statusInt != 1) {
        return "err-row"
      }
    }
  }
}
</script>

<style lang="scss">

</style>
