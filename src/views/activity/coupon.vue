<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="title">
        优惠券数量：
        <el-tag type="success">{{totalCoupon}}</el-tag>
      </div>
      <el-button class="filter-item"
                 type="primary"
                 style="margin-left:10px"
                 @click="handleCreate"
                 icon="edit">新增
      </el-button>
    </div>
    <el-table v-loading="loading"
              element-loading-text="拼命加载中"
              :data="tableData"
              border
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center"
                       label="ID"
                       width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="优惠券类型">
        <template scope="scope">
          <span>{{scope.row.couponType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="使用范围">
        <template scope="scope">
          <span>{{scope.row.wide }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="制券张数">
        <template scope="scope">
          <span>{{scope.row.askCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="领取张数">
        <template scope="scope">
          <span>{{scope.row.askCount - scope.row.leftCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="剩余张数">
        <template scope="scope">
          <span>{{scope.row.leftCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="状态">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="生效时间">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span>{{scope.row.startTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="失效时间">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="创建时间">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作">
        <template scope="scope">
          <el-button size="small"
                     type="success"
                     icon="caret-top"
                     @click="handleDel(scope.row.topicModuleId)">赠送
          </el-button>
          <el-button size="small"
                     type="info"
                     class="btn btn-sm btn-info"
                     icon="edit"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @current-change="getTableData"
                     :current-page.sync="listQuery.page"
                     :page-size="listQuery.limit"
                     layout="total, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>

    <!-- 弹出编辑和新增窗口 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               size="full">
      <el-form :model="temp"
               label-width="100px">
        <el-form-item label="标题"
                      class="red-star">
          <el-input class="w30"
                    v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型"
                      class="red-star">
          <el-select v-model="temp.couponType"
                     placeholder="请选择">
            <el-option label="免单券"
                       :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效区间"
                      class="red-star">
          <el-date-picker v-model="dateRange"
                          @change="dateRangeChange"
                          type="datetimerange"
                          placeholder="选择日期时间范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用范围">
          <el-button size="small"
                     type="primary"
                     @click="handleAddGoods">添加商品
          </el-button>
        </el-form-item>
        <el-form-item label="已添加商品"
                      class="w50">
          <el-table :data="addedGoodList"
                    border
                    fit
                    highlight-current-row
                    stripe
                    style="width: 100%">
            <el-table-column align="center"
                             label="商品ID"
                             width="65">
              <template scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="商品名称">
              <template scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template scope="scope">
                <el-button size="small"
                           icon="delete"
                           @click="handleDelGood(scope.row)"
                           type="danger">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="制券张数"
                      class="red-star">
          <el-input class="w30"
                    v-model="temp.askCount"></el-input>
        </el-form-item>
        <el-form-item label="发放方式"
                      class="red-star">
          <el-select v-model="temp.sentType"
                     placeholder="请选择">
            <el-option label="内部赠送"
                       :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'"
                   type="primary"
                   @click="create">创建</el-button>
        <el-button v-else
                   type="primary"
                   @click="update">保存</el-button>
      </div>
    </el-dialog>

    <!-- 弹出编辑和新增窗口1 -->
    <el-dialog title="商品列表"
               :visible.sync="dialogFormVisible1"
               size="small">
      <div class="filter-container">
        <el-form inline>
          <el-input type="text"
                    class="w30"
                    placeholder="请输入商品名或条码"
                    v-model="listQuery1.key"></el-input>
          <el-form-item>
            <el-button class="filter-item"
                       type="primary"
                       @click="getTableData1"
                       icon="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData1"
                border
                fit
                ref="goodsTable"
                row-key="id"
                @selection-change="handleSelectionChange"
                highlight-current-row
                style="width: 100%">
        <el-table-column type="selection"
                         :reserve-selection="true"
                         width="55">
        </el-table-column>
        <el-table-column align="center"
                         label="ID"
                         width="65">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="商品名称">
          <template scope="scope">
            <span>{{scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination @current-change="getTableData1"
                       :current-page.sync="listQuery1.pageNumber"
                       :page-size="listQuery1.pageSize"
                       layout="total, prev, pager, next"
                       :total="total1">
        </el-pagination>
      </div>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="handleCloseD1">取消</el-button>
        <el-button type="primary"
                   @click="handleConfirmD1">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTableData, addCoupon, updateCoupon } from "@/api/activity"

const ERR_OK = 0
export default {
  created() {
    this.getTableData()
  },
  data() {
    return {
      dateRange: [], // 时间范围
      totalCoupon: null, // 总卷数
      tempAddedGoodList: [], // 当前页暂存的添加的商品列表
      addedGoodList: [], // 当前模块已添加的商品列表
      loading: false,
      // 弹窗内容数据对象
      temp: {
        askCount: null,
        couponType: 1,
        endTime: null,
        goodIdList: null,
        sentType: 1,
        startTime: null,
        title: null
      },
      tableData: null, // 表格数据
      tableData1: null,
      total: null, // 数据总数
      dialogFormVisible: false,
      listQuery: {
        // 关键字查询，翻页等数据
        page: 1,
        limit: 20
      },
      tableData1: null, // 表格数据
      total1: null, // 数据总数
      dialogFormVisible1: false, // 第二个弹窗
      listQuery1: {
        // 关键字查询，翻页等数据
        key: null,
        pageNumber: 1,
        pageSize: 10
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      }
    }
  },
  methods: {
    dateRangeChange() {
      // 获取时间范围
      this.temp.startTime = +new Date(this.dateRange[0])
      this.temp.endTime = +new Date(this.dateRange[1])
    },
    // 删除已添加的商品
    handleDelGood(row) {
      let index = this.addedGoodList.indexOf(row)
      this.addedGoodList.splice(index, 1)
    },
    // 关闭弹窗1
    handleCloseD1() {
      this.tempAddedGoodList = []
      this.dialogFormVisible1 = false
    },
    // 确认弹窗1
    handleConfirmD1() {
      this.tempAddedGoodList.forEach(item => {
        // 遍历临时添加的去重加入addedList
        let addedIds = this.addedGoodList.map(i => {
          return i.id
        })
        item.id = Number(item.id)
        if (addedIds.indexOf(item.id) === -1) {
          this.addedGoodList.push(item)
        }
      })
      this.tempAddedGoodList = []
      this.dialogFormVisible1 = false
    },
    // 点击添加商品按钮时，弹出选择框
    handleAddGoods() {
      this.dialogFormVisible1 = true
      this.getTableData1()
      this.$nextTick(() => {
        this.$refs.goodsTable.clearSelection() // 清空之前的表格选择
      })
    },
    // 多选时执行
    handleSelectionChange(val) {
      this.tempAddedGoodList = val
    },
    getTableData() {
      this.loading = true
      getTableData(`/coupons`, this.listQuery).then(res => {
        // 获取tableData数据
        if (res.code === 0) {
          let datas = res.data
          this.totalCoupon = datas.count
          this.total = datas.total
          this.tableData = datas.data
          this.loading = false
        }
      })
    },
    getTableData1() {
      let _this = this
      getTableData(`/community/goods/query`, this.listQuery1).then(res => {
        // 获取tableData数据
        if (res.code === 0) {
          let datas = res.data
          this.total1 = datas.total
          this.tableData1 = datas.data
        }
      })
    },
    handleCreate() {
      // 点击创建新功能按钮
      this.resetTemp() // 清空原有表单
      this.dialogStatus = "create"
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      // 点击编辑功能按钮
      this.resetTemp()
      this.addedGoodList = [{ id: row.goodsId, name: row.goodsName }]
      this.dateRange.push(row.startTime, row.endTime) // 初始化时间
      this.temp = Object.assign(this.temp, row)
      this.dialogStatus = "update"
      this.dialogFormVisible = true
    },
    // 返回处理过的ids
    hasSorted(arr) {
      let ids = [] // 最终输出的ids
      arr.forEach((el, index) => {
        ids.push(el.id)
      })
      return ids
    },
    // 创建新功能
    create() {
      this.temp.goodIdList = this.hasSorted(this.addedGoodList)
      addCoupon(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("创建成功")
        }
      })
    },
    update() {
      // 确认编辑此条信息
      this.temp.goodIdList = this.hasSorted(this.addedGoodList)
      this.temp.startTime = +new Date(this.temp.startTime)
      this.temp.endTime = +new Date(this.temp.endTime)
      updateCoupon(this.temp, this.temp.id).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("保存成功")
        }
      })
    },
    resetTemp() {
      // 重置弹出表格
      this.addedGoodList = []
      this.dateRange = []
      this.temp = {
        askCount: null,
        couponType: 1,
        endTime: null,
        goodIdList: null,
        sentType: 1,
        startTime: null,
        title: null
      }
    }
  }
}
</script>

<style lang="scss">
.title {
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid #f2f2f2;
}
</style>

