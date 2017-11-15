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
      <el-table-column align="center" label="是否启用">
        <template scope="scope">
          <span>{{scope.row.enable == 0 ? '禁用' : '启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文章数" width="100">
        <template scope="scope">
          <span>{{scope.row.articleCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="primary" @click="actionArtAssort(scope.row)">{{scope.row.enable == 0 ? '启用' : '禁用'}}</el-button>
          <el-button size="small" type="danger" @click="delItem(scope.row.id)">删除</el-button>
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
      <el-form :model="temp" label-width="100px">
        <el-form-item label="分类名称" class="red-star">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.enable" :label="1">启用</el-radio>
            <el-radio class="radio" v-model="temp.enable" :label="0">禁用</el-radio>
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
  import {getTableData, addArtAssort, upadateArtAssort, delArtAssort} from '@/api/community_content'
  import {isPhone} from '@/utils/validate'

  const ERR_OK = 0
  export default {
    data() {
      return {
        enable: '1',
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          name: null,
          sort: null,
          enable: 1
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
      actionArtAssort(row) {  // 启用禁用
        row.enable === 0 ? row.enable = 1 : row.enable = 0
        this.temp = row
        this.update()
      },
      getTableData() {
        getTableData('/article/category/list', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === ERR_OK) {
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
          name: null,
          sort: null,
          enable: 1
        }
      },
      create() {    // 创建新功能
        addArtAssort(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      update() {  // 编辑此条信息
        upadateArtAssort(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('保存成功')
          }
        })
      },
      delItem(id) { //删除
        this.$confirm('此操作将永久删除该条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delArtAssort(id).then(res => {
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
      'temp.sort'(newVal, oldVal) {
        this.$nextTick(() => {
          this.temp.sort = newVal.replace(/\D+/, '')
          console.log(this.temp.sort)
        })
      }
    }
  }
</script>
