<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status == 2 ? '禁用' : '启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="full">
      <el-form :model="temp" label-width="110px">
        <el-form-item label="分类名称" class="red-star">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="分类标识" class="red-star">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="是否实物" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.reality" :label="0">否</el-radio>
            <el-radio class="radio" v-model="temp.reality" :label="1">是</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="状态" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.status" :label="1">启用</el-radio>
            <el-radio class="radio" v-model="temp.status" :label="2">禁用</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="是否导入数据" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.allowImport" :label="2">是</el-radio>
            <el-radio class="radio" v-model="temp.allowImport" :label="1">否</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>
        <el-button v-else type="primary" @click="update">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getTableData, addGoodsAssort, upadateGoodsAssort} from '@/api/community_content'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          name: null,
          status: 1,
          code: null,
          allowImport: 1,
          reality: 0
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20
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
        this.loading = true
        getTableData('/transaction/goods_type', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === ERR_OK) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {
          name: null,
          status: 1,
          code: null,
          allowImport: 1,
          reality: 0
        }
      },
      handleCreate() {    // 点击创建新功能按钮
        this.resetTemp()    // 清空原有表单
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      create() {    // 创建新功能
        addGoodsAssort(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      update() {  // 编辑此条信息
        upadateGoodsAssort(this.temp).then(res => {
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
