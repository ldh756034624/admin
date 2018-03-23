<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
          <el-select v-model="listQuery.localtion" @change="getTableData">
            <el-option v-for="item in selectList" :label="item.val" :value="item.key"></el-option>
          </el-select>
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
      <el-table-column align="center" label="位置">
        <template scope="scope">
          <span>{{scope.row.locationDesc}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="数量">
        <template scope="scope">
          <span>{{scope.row.bannerCount}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="开始时间">
        <template scope="scope">
          <span>{{scope.row.startTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template scope="scope">
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标示码" width="100">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.enable === 0 ? '禁用' : '启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="success" @click="goList(scope.row.id)">列表
          </el-button>
          <el-button size="small" type="primary" @click="handleBan(scope.row.id)">{{scope.row.enable == 0 ? '启用' : '禁用'}}</el-button>
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="功能位置" class="red-star">
          <el-select v-model="temp.location" placeholder="请选择">
            <el-option v-for="item in selectList" :label="item.val" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标识">
          <el-select v-model="temp.code" placeholder="请选择">
            <el-option v-for="item in bannertype" :label="item.val" :value="item.key" :key="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上线时间" class="red-star">
          <el-date-picker
            v-model="dateRange"
            @change="dateRangeChange"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="enable" label="1">启用</el-radio>
            <el-radio class="radio" v-model="enable" label="0">禁用</el-radio>
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
  import {addFn, upadateFn, getTableData, banSort} from '@/api/community_content'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        enable: '1',
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          enable: '1',
          name: null,
          id: null,
          location: 1,
          code: '',
          sort: null
        },
        bannertype: [],
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        selectList: {},
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          localtion: ''
        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
      }
    },
    created() {
      this.getLocations()
      this.getType()
      this.getTableData()
    },
    methods: {
      getTableData() {
        this.loading = true
        getTableData('/community/banner_type/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      getLocations() {  // 获取分类列表
        getTableData('/community/banner_type/location').then(res => {
          res.data.forEach(item => {
            item.key = parseFloat(item.key)
          })
          this.selectList = res.data
        })
      },
      getType() {  // 获取type
        getTableData('/community/banner_type/type').then(res => {
          this.bannertype = res.data
        })
      },
      handleBan(id) {
        banSort(id).then(res => {
          if (res.code === ERR_OK) {
            this.$message.success('操作成功')
            this.getTableData()
          }
        })
      },
      goList(id) {  // 跳转至功能列表
        this.$router.push({path: '/community/fnlist', query: {id}})
      },
      dateRangeChange() {      // 获取时间范围
        if (!this.dateRange[0]) {
          this.temp.startTime = null
          this.temp.endTime = null
          return
        }
        this.temp.startTime = new Date(this.dateRange[0]).getTime()
        this.temp.endTime = new Date(this.dateRange[1]).getTime()
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
        this.temp = Object.assign(this.temp, row)   // 赋值

        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.enable = '1'
        this.temp = {
          name: null,
          enable: '1',
          code: '',
          id: null,
          location: 1,
          sort: null
        }
        this.dateRange = []
      },
      create() {    // 创建新功能
        this.temp.id = 0
        this.temp.enable = this.enable
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
