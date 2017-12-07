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
      <el-table-column align="center" label="昵称">
        <template scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效时间" width="310">
        <template scope="scope">
          <span>{{scope.row.startTime | formatDateTime}}至{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="加入时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.cause}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.statusDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button v-if="!scope.row.isExpired" size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="!scope.row.isExpired && scope.row.status == 1" size="small" type="danger" class="btn btn-sm btn-info" @click="handleCancel(scope.row.id)">取消
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
        <el-form-item label="手机号" class="red-star">
          <el-input v-model="temp.phone"></el-input>
          <span>姓名：{{nickName}}</span>
        </el-form-item>
        <el-form-item label="有效时间" class="red-star">
          <el-date-picker
            v-model="dateRange"
            @change="dateRangeChange"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="2" v-model="temp.cause"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>
        <el-button v-else type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getTableData, createWhiteList, updateWhiteList, cancelWhiteList, getNickName} from '@/api/base'

  const ERR_OK = 0
  export default {
    data() {
      return {
        nickName: '', // 用户名称
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          cause: null,
          phone: null
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
      handleCancel(id) { // 取消白名单
        this.$confirm('确定将此项移出白名单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelWhiteList(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getTableData()
            }
          })
        })
      },
      dateRangeChange() {      // 获取时间范围
        this.temp.startTime = new Date(this.dateRange[0]).getTime()
        this.temp.endTime = new Date(this.dateRange[1]).getTime()
      },
      getTableData() {
        getTableData('/basis/white_list').then(res => {   // 获取tableData数据
          if (res.code === ERR_OK) {
            console.log(res.data)
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleCreate() {    // 点击创建新功能按钮
        this.resetTemp()    // 清空原有表单
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        this.resetTemp()    // 清空原有表单
        this.dateRange.push(new Date(row.startTime))   // 初始化时间
        this.dateRange.push(new Date(row.endTime))
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          cause: null,
          phone: null
        }
        this.dateRange = []
      },
      create() {    // 创建新功能
        if (!this.temp.startTime || !this.temp.endTime) {
          this.$message.error('请选择时间范围')
          return
        }
        createWhiteList(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      update() {  // 确认编辑此条信息
        if (!this.temp.startTime || !this.temp.endTime) {
          this.$message.error('请选择时间范围')
          return
        }
        updateWhiteList(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('保存成功')
          }
        })
      }
    },
    watch: {
      'temp.phone'(newVal) {
        if (newVal.length !== 11) {
          this.nickName = ''
        } else {
          getNickName({phone: newVal}).then(res => {
            if (res.code == ERR_OK) {
              res.data && (this.nickName = res.data)
            }
          })
        }
      }
    }
  }
</script>
