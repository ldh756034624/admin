<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增</el-button>
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="goList" icon="edit">去列表</el-button>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类名称">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template scope="scope">
          <span v-if="scope.row.department !== null">{{scope.row.department.name}}</span>
          <span v-else="scope.row.department == null">---</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template scope="scope">
          <p v-for="(item,index) in scope.row.roles" :key="item.id">{{item.name}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="100">
        <template scope="scope">
          <el-tag :type="scope.row.status">
            <span v-if="scope.row.deleted_at == null">启用</span>
            <span v-else>禁用</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标示码">
        <template scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="success" @click="goList(scope.row.id)">列表
          </el-button>
          <el-button size="small" type="warning" @click="handleModifyStatus(scope.row.id)">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="getTableData"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.pageSize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

    <!-- 弹出编辑和新增窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="full">
      <el-form :model="temp" ref="temp" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="上线时间">
          <el-date-picker
            v-model="dateRange"
            @change="dateRangeChange"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <div class="checkitem">
            <el-radio class="radio" v-model="enable" label="1">启用</el-radio>
            <el-radio class="radio" v-model="enable" label="2">禁用</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create('temp')">提交</el-button>
        <el-button v-else type="primary" @click="update('temp')">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {addFn, getTableData} from '@/api/community_content'
  import {isPhone} from '@/utils/validate'

  export default {
    data() {
      return {
        enable: '1',
        dateRange: null,  // 时间范围
        temp: {   // 弹窗内容数据对象
          enable: '1',
          name: null,
          id: null
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
          code: [{required: true, message: '请输入标识', trigger: 'blur'}]
        },
        listQuery: {  // 关键字查询，翻页等数据
          page: 1,
          limit: 20,
        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
      }
    },
    mounted() {
//      this.getTableData()
    },
    methods: {
      goList(id) {  // 去功能列表
        this.$router.push({path:'/community/fnlist', query: {id}})
      },
      dateRangeChange() {      // 获取时间范围
        this.temp.startDate = new Date(this.dateRange[0]).getTime()
        this.temp.endDate = new Date(this.dateRange[1]).getTime()
      },
      getTableData() {
        getTableData('url', this.listQuery).then(res => {   // 获取tableData数据
          const datas = re.data
          this.tableData = datas.list.data
          this.total = datas.list.total
        })
      },
      handleCreate() {    // 点击创建新功能按钮
        this.resetTemp()    // 清空原有表单
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        this.temp = {
          id: row.id,
          name: row.name,
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.radio = '1'
        this.temp = {
          name: null,
          enable: '1',
          id: null
        }
      },
      create(temp) {    // 创建新功能
        this.temp.enable = this.enable
        if (!this.temp.startDate || !this.temp.endDate) {
          this.$message.error('请选择时间范围')
        }
        this.$refs[temp].validate(valid => {
          if (valid) {
            addFn(this.temp).then(res => {
              if (res.code === 0) {
                this.getTableData()
                this.dialogFormVisible = false
                this.$message.success('创建成功')
              }
            })
          }
        })
      },
      update(temp) {
        this.temp.enable = this.enable
        if (!this.temp.startDate || !this.temp.endDate) {
          this.$message.error('请选择时间范围')
        }
        this.$refs[temp].validate(valid => {
          if (valid) {
            addFn(this.temp).then(() => {   // 这里改为更新
              this.getTableData()
              this.dialogFormVisible = false
              this.$message.success('创建成功')
            })
          }
        })
      }
    }
  }
</script>
