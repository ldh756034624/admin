<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本">
        <template scope="scope">
          <span>{{scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本号">
        <template scope="scope">
          <span>{{scope.row.versionNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="升级类型">
        <template scope="scope">
          <span>{{scope.row.upgradeTypeDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template scope="scope">
          <span>{{scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="success" @click="delItem(scope.row.id)">删除
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
      <el-form :model="temp" ref="temp" label-width="100px">
        <el-form-item label="版本" class="red-star">
          <el-input v-model="temp.version"></el-input>
        </el-form-item>
        <el-form-item label="版本号" class="red-star">
          <el-input v-model="temp.versionNumber"></el-input>
        </el-form-item>
        <el-form-item label="客户端类型" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.clientType" :label="1">IOS</el-radio>
            <el-radio class="radio" v-model="temp.clientType" :label="2">Android</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="升级类型" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.upgradeType" :label="1">不提示升级</el-radio>
            <el-radio class="radio" v-model="temp.upgradeType" :label="2">建议升级</el-radio>
            <el-radio class="radio" v-model="temp.upgradeType" :label="3">强制升级</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="内容" class="red-star">
          <el-input type="textarea" :rows="2" v-model="temp.description"></el-input>
        </el-form-item>
        <el-form-item label="Android包">
          <el-upload
            class="upload-demo"
            drag
            :action="FILE_API"
            :file-list="fileList"
            :on-remove="handleRemove"
            :on-success="handleFileSuccess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
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
  import {getTableData, createVer, updateVer, delVer} from '@/api/base'

  const ERR_OK = 0
  export default {
    data() {
      return {
        fileList: [],
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          version: null,
          versionNumber: null,
          clientType: 1,
          upgradeType: 1,
          description: null,
          packageName: null
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
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
      handleRemove(file, fileList) {  // 清空上传文件列表
        this.fileList = []
        this.temp.packageUrl = null
        this.temp.packageName = null
      },
      handleFileSuccess(res, file) {
        if (res.code === ERR_OK) {
          this.$message.success('上传成功')
          this.fileList = [{name: file.name, url: res.data}]
          this.temp.packageUrl = res.data
          this.temp.packageName = file.name
        }
      },
      getTableData() {
        getTableData('/basis/version/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      resetTemp() {   // 重置弹出表格
        this.fileList = []
        this.temp = {
          version: null,
          versionNumber: null,
          clientType: 1,
          upgradeType: 1,
          description: null,
          packageUrl: null,
          packageName: null
        }
      },
      handleCreate() {    // 点击创建新功能按钮
        this.resetTemp()    // 清空原有表单
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      create() {    // 创建新功能
        this.hasFile()
        createVer(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        if (row.packageUrl) {
          this.fileList = [{name: row.packageName, url: row.packageUrl}]
        }
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      update() {  // 编辑此条信息
        this.hasFile()
        updateVer(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('保存成功')
          }
        })
      },
      hasFile() { //　是否有升级包上传
        if (this.fileList.length === 0) {
          this.temp.packageUrl = null
          this.temp.packageName = null
        }
      },
      delItem(id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delVer(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message.success('删除成功')
              this.getTableData()
            }
          })
        })
      }
    },
    watch: {
      'temp.versionNumber'(newVal, oldVal) {
        this.$nextTick(() => {
          this.temp.versionNumber = newVal.replace(/\D+/, '')
        })
      }
    }
  }
</script>
