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
      <el-table-column align="center" label="姓名">
        <template scope="scope">
          <span>{{scope.row.nickName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template scope="scope">
          <span>{{scope.row.departmentName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template scope="scope">
          <span>{{scope.row.roleName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status == 1 ? '启用' : '禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登陆">
        <template scope="scope">
          <span>{{scope.row.lastLoginTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="primary" @click="handleBan(scope.row)">{{scope.row.status == 1 ? '禁用' : '启用'}}
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
      <el-form :model="temp" :rules="rules" ref="temp" label-width="100px">
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="temp.nickName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <span v-if="dialogStatus == 'update'">{{temp.phone}}</span>
          <el-input v-else v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.status" :label="1">启用</el-radio>
            <el-radio class="radio" v-model="temp.status" :label="2">禁用</el-radio>
          </div>
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
  import {getTableData, createAdmin, updateAdmin, banAdmin} from '@/api/base'

  const ERR_OK = 0
  export default {
    data() {
      return {
        temp: {           // 弹窗内容数据对象
          nickName: null,
          phone: null,
          password: null,
          status: 1
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
        },
        rules: {
          nickName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      handleBan(row) {  // 启用或者禁用
        banAdmin(row.id).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.$message.success('修改成功')
          }
        })
      },
      getTableData() {
        getTableData('/basis/user/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
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
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {
          nickName: null,
          phone: null,
          password: null,
          status: 1
        }
      },
      create() {    // 创建新功能
        this.$refs.temp.validate(valid => {
          if (valid) {
            createAdmin(this.temp).then(res => {
              if (res.code === ERR_OK) {
                this.getTableData()
                this.dialogFormVisible = false
                this.$message.success('创建成功')
              }
            })
          }
        })
      },
      update() {  // 编辑此条信息
        updateAdmin(this.temp).then(res => {
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
