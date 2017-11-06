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
      <el-table-column align="center" label="名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数名">
        <template scope="scope">
          <span>{{scope.row.bannerCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数值">
        <template scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明">
        <template scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="error" @click="handleDele(scope.row.id)">删除
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
      <el-form :model="temp" ref="temp" :rules="rules" label-width="100px">
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="参数标识" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="参数类型">
          <div class="checkitem">
            <el-radio class="radio" v-model="enable" label="1">文本</el-radio>
            <el-radio class="radio" v-model="enable" label="0">对象</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="参数值" prop="code">
          <el-input v-model="temp.code"></el-input>    <!--v-if="temp.type == 1"-->
          <div>
            <div v-for="item in temp.objParams">
              <span>key:</span>
              <el-input v-model="item.key"></el-input>
              <span>value:</span>
              <el-input v-model="item.code"></el-input>
              <el-button type="primary" icon="plus" v-if="index === 0" @click="add"></el-button>
              <el-button type="primary" icon="minus" v-else @click="minus"></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="参数描述">
          <el-input type="textarea" v-model="temp.code"></el-input>
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
  import {addFn, upadateFn, getTableData, banSort} from '@/api/community_content'
  import {isPhone} from '@/utils/validate'

  const ERR_OK = 0
  export default {
    data() {
      return {
        enable: '1',
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
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
      add() { // 添加一条参数
        this.temp.objParams.push({
          key: null,
          value: nulltemp
        })
      },
      minus() { // 删除一条参数
        this.temp.objParams.pop()
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
      },
      dateRangeChange() {      // 获取时间范围
        this.temp.startTime = new Date(this.dateRange[0]).getTime()
        this.temp.endTime = new Date(this.dateRange[1]).getTime()
      },
      getTableData() {
        getTableData('/community/banner_type/page', this.listQuery).then(res => {   // 获取tableData数据
          if(res.code === 0) {
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
        this.dateRange = []
        this.dateRange.push(new Date(row.startTime))   // 初始化时间
        this.dateRange.push(new Date(row.endTime))
        this.enable = row.enable.toString()
        this.temp = row   // 赋值

        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.enable = '1'
        this.temp = {
          name: null,
          enable: '1',
          id: null
        }
      },
      create() {    // 创建新功能
        this.resetTemp()
        this.temp.id = 0
        this.temp.enable = this.enable
        if (!this.temp.startTime || !this.temp.endTime) {
          this.$message.error('请选择时间范围')
          return
        }
        this.$refs.temp.validate(valid => {
          if (valid) {
            addFn(this.temp).then(res => {
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
        this.temp.enable = this.enable
        if (!this.temp.startTime || !this.temp.endTime) {
          this.$message.error('请选择时间范围')
          return
        }
        upadateFn(this.temp).then(res => {
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
