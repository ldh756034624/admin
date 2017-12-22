<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="filter-container">
        <el-form label-width="100px">
          <el-form-item label="商品名称" class="red-star">
            <span>{{goodsName}}</span>
          </el-form-item>
          <el-form-item label="数据" class="red-star">
            <el-input class="w30" :rows="5" type="textarea" v-model="insertData"></el-input>
          </el-form-item>
          <el-form-item label="导入数据">
            <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleInsert" icon="edit">导入
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <hr>
      <div class="filter-container">
        <el-form inline>
          <el-form-item label="userID">
            <el-input type="text" v-model="listQuery.userId"></el-input>
          </el-form-item>
          <el-form-item label="券号">
            <el-input type="text" v-model="listQuery.no"></el-input>
          </el-form-item>
          <el-form-item label="批次">
            <el-select v-model="listQuery.batchNo" placeholder="请选择">
              <el-option v-if="batchList" v-for="item in batchList" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="listQuery.status" placeholder="请选择">
              <el-option label="正常" :value="1"></el-option>
              <el-option label="已使用" :value="2"></el-option>
              <el-option label="禁用" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="券号">
        <template scope="scope">
          <span>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="批次">
        <template scope="scope">
          <span>{{scope.row.batchNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="userID">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="导入时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放时间">
        <template scope="scope">
          <span>{{scope.row.grantTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button v-if="scope.row.status !== '正常'" size="small" type="success"
                     @click="changeStatus(scope.row.id, 1)">启用
          </el-button>
          <el-button v-else size="small" type="danger" @click="changeStatus(scope.row.id, 2)">禁用
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
  import {getTableData, insertData, changeBatchStatus} from '@/api/deal'

  const ERR_OK = 0
  export default {
    data() {
      return {
        insertData: null, // 导入数据
        goodsName: null,  // 商品名称
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          goodsId: null,
          userId: null,
          no: null, //　券号
          batchNo: null,  // 批次
          status: 1    // 状态 默认正常
        },
        batchList: null
      }
    },
    created() {
      this.goodsId = this.$route.query.goodsId  //　获取goodsID
      this.listQuery.goodsId = this.$route.query.goodsId
      this.goodsName = this.$route.query.goodsName  // goods名称
      this.getBatch()
      this.getTableData()
    },
    methods: {
      getTableData() {
        getTableData('/transaction/card_coupons', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      getBatch() {  // 获取批次下拉列表
        getTableData('/transaction/card_coupons/batch_no?goodsId=' + this.goodsId).then(res => {
          this.batchList = res.data
        })
      },
      handleInsert() {  // 导入数据
        if (this.insertData != '' || this.insertData != null) {
          let data = {
            goodsId: this.goodsId,
            nos: this.insertData
          }
          insertData(data).then(res => {
            if (res.success) {
              this.$message.success('导入成功')
              this.insertData = null
              this.getTableData()
              this.getBatch()
            }
          })
        }
      },
      changeStatus(id, type) { // 物品上下架
        let desc = type === 2 ? '禁用' : '启用'
        this.$confirm(`是否${desc}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeBatchStatus(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          })
        })
      },
      handleDele(id) { // 删除当前条目
        this.$confirm('此操作将永久删除该条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFunction(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTableData()
            }
          })
        })
      }
    },
    watch: {
      'listQuery.userId'(newVal, oldVal) {
        (newVal || newVal == 0) && (newVal = newVal.toString())
        this.$nextTick(() => {
          this.listQuery.userId = newVal.replace(/\D+/, '')
        })
      }
    },
  }
</script>

<style lang="scss">
</style>
