<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="filter-container">
        <el-form inline>
          <el-form-item label="名称或参数标识">
            <el-input type="text" v-model="listQuery.key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中"  :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template scope="scope">
          <span>{{scope.row.type | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数标识">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数值">
        <template scope="scope">
          <span>{{scope.row.val}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="说明">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="primary" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDele(scope.row.id)">删除
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
      <el-form label-width="100px">
        <el-form-item label="参数名称" class="red-star">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="参数标识" class="red-star">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="参数类型" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" :label="0" v-model="temp.type">文本</el-radio>
            <el-radio class="radio" :label="1" v-model="temp.type">对象</el-radio>
            <el-radio class="radio" :label="2" v-model="temp.type">数组</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="参数值" prop="code" class="red-star">
          <!--文本-->
          <div v-if="temp.type == 0">
            <el-input class="w30" v-model="temp.textParams"></el-input>
          </div>
          <!--对象-->
          <div v-if="temp.type == 1">
            <div v-for="(item, index) in temp.objParams" style="margin-bottom: 10px">
              <span>key:</span>
              <el-input class="w30" v-model="item.key"></el-input>
              <span>value:</span>
              <el-input class="w30" v-model="item.code"></el-input>
              <el-button type="primary" icon="plus" v-if="index === 0" @click="add"></el-button>
              <el-button type="primary" icon="minus" v-else @click="minus"></el-button>
            </div>
          </div>
          <!--数组-->
          <div v-if="temp.type == 2">
            <div v-for="(item, index) in temp.arrParams" style="margin-bottom: 10px">
              <el-input class="w30" v-model="item.val"></el-input>
              <el-button type="primary" icon="plus" v-if="index === 0" @click="add(0)"></el-button>
              <el-button type="primary" icon="minus" v-else @click="minus(0)"></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="参数描述" class="red-star">
          <el-input type="textarea" v-model="temp.description"></el-input>
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
  import {getTableData, createParams, updateParams, delParams} from '@/api/base'
  import {isPhone} from '@/utils/validate'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        temp: {           // 弹窗内容数据对象
          type: 0,
          code: null,
          description: null,
          val: null,    // 接口params传递
          textParams: null, // 文本输入框
          arrParams: [{   // 数组输入框
            val: null
          }],
          objParams: [  // 对象输入框
            {
              key: null,
              code: null
            }
          ]
        },
        dateRange: null,  // 时间范围
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
          key: null
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
      add(type) { // 添加一条参数
        if (type === 0) {
          this.temp.arrParams.push({
            val: null
          })
          return
        }
        this.temp.objParams.push({
          key: null,
          code: null
        })
      },
      minus(type) { // 删除一条参数
        if (type === 0) {
          this.temp.arrParams.pop()
          return
        }
        this.temp.objParams.pop()
      },
      handleDele(id) { // 删除当前条目
        this.$confirm('此操作将永久删除该条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delParams(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message.success('删除成功!')
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
        this.loading = true
        getTableData('/basis/param/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      handleCreate() {    // 点击创建新功能按钮
        this.resetTemp()    // 清空原有表单
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        this.resetTemp()
        this.temp = Object.assign(this.temp, row)

        let type = row.type
        if (type == 0) {
          this.temp.textParams = row.val[0].val
        } else if (type == 1) {
          this.temp.objParams = row.val
        } else {
          this.temp.arrParams = row.val
        }

        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {
          type: 0,
          code: null,
          description: null,
          val: null,    // 接口params传递
          textParams: null, // 文本输入框
          arrParams: [{   // 数组输入框
            val: null
          }],
          objParams: [  // 对象输入框
            {
              key: null,
              code: null
            }
          ]
        }
      },
      create() {    // 创建新功能
        this.assignVal()
        createParams(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.$message.success('创建成功')
            this.getTableData()
            this.dialogFormVisible = false
          }
        })
      },
      update() {  // 编辑此条信息
        this.assignVal()
        updateParams(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.$message.success('保存成功')
            this.getTableData()
            this.dialogFormVisible = false
          }
        })
      },
      assignVal() {   // 给 temp.val 赋值
        if (this.temp.type == 1) {  // 对象
          this.temp.val = this.temp.objParams
        } else if (this.temp.type == 0) {  //文本
          this.temp.val = [{val: this.temp.textParams}]
        } else {  // 数组
          this.temp.val = this.temp.arrParams
        }
      }
    },
    filters: {
      typeFilter (val) {
        if (val == 0) {
          return '文本'
        } else if (val == 1) {
          return '对象'
        } else {
          return '数组'
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
