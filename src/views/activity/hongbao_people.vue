<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="手机号">
          <el-input type="text" v-model="listQuery.phone"></el-input>
        </el-form-item>
        <el-form-item label="兑奖码">
          <el-input type="text" v-model="listQuery.code"></el-input>
        </el-form-item>
        <el-form-item label="中奖状态">
          <el-select v-model="listQuery.status" placeholder="请选择">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑奖码">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID">
        <template scope="scope">
          <span>{{scope.row.bannerCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ip">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="经纬度">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">详情
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
    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="full">-->
      <!--<el-form :model="temp" ref="temp" :rules="rules" label-width="100px">-->
        <!--<el-form-item label="分类名称" prop="name">-->
          <!--<el-input v-model="temp.name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="标识" prop="code">-->
          <!--<el-input v-model="temp.code"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="上线时间">-->
          <!--<el-date-picker-->
            <!--v-model="dateRange"-->
            <!--@change="dateRangeChange"-->
            <!--type="daterange"-->
            <!--placeholder="选择日期范围">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="状态">-->
          <!--<div class="checkitem">-->
            <!--<el-radio class="radio" v-model="enable" label="1">启用</el-radio>-->
            <!--<el-radio class="radio" v-model="enable" label="0">禁用</el-radio>-->
          <!--</div>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">取消</el-button>-->
        <!--<el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>-->
        <!--<el-button v-else type="primary" @click="update">提交</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

  </div>
</template>

<script>
  import {addFn, upadateFn, getTableData} from '@/api/community_content'
  import {isPhone} from '@/utils/validate'

  const ERR_OK = 0
  export default {
    data() {
      return {
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          phone: null,
          code: null,
          status: 0
        },
        temp: {

        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
      }
    },
    created() {
      this.getTableData()
      if (this.$route.query.code) {
        this.listQuery.code = this.$route.query.code
      }
    },
    methods: {
      goList(id) {  // 跳转至功能列表
        this.$router.push({path: '/community/fnlist', query: {id}})
      },
      dateRangeChange() {      // 获取时间范围
        this.temp.startTime = new Date(this.dateRange[0]).getTime()
        this.temp.endTime = new Date(this.dateRange[1]).getTime()
      },
      getTableData() {
        getTableData('/activity/lottery/flow/page', this.listQuery).then(res => {   // 获取tableData数据
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
