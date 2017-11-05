<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增</el-button>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
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
      <el-table-column align="center" label="数量">
        <template scope="scope">
          <span>{{scope.row.bannerCount}}</span>
        </template>
      </el-table-column>
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
          <el-button size="small" type="warning" @click="handleModifyStatus(scope.row.id)">禁用
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
        <el-form-item label="名称" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            :action="IMGUP_API"
            :show-file-list="false"
            :on-success="handleImgSuccess"
            list-type="picture-card"
            :before-upload="beforeHandleImg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="字体颜色" prop="fontColor">
          <el-input v-model="temp.fontColor"></el-input>
        </el-form-item>
        <el-form-item label="连接类型">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.urlType" label="1">网址</el-radio>
            <el-radio class="radio" v-model="temp.urlType" label="0">内部页面</el-radio>
            <el-radio class="radio" v-model="temp.urlType" label="0">不跳转</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="动作">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态">
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
  import {addFunction, upadateFunction, getTableData} from '@/api/community_content'
  import {isPhone} from '@/utils/validate'

  const ERR_OK = 0
  export default {
    data() {
      return {
        enable: '1',
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          enable: '1',
          id: 0,
          icon: null,
          sort: null,
          title: null,
          url: null,
          urlType: '1'
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          title: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
          fontColor: [{required: true, message: '请输入颜色', trigger: 'blur'}]
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
      beforeHandleImg(file) {      // 头像上传前
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' ||file.type === 'image/png'
        if (!isJPG) {
          this.$message.error('上传头像图片必须是 JPG,JPEG,PNG 格式!')
        }
        return isJPG
      },
      handleImgSuccess(res, file) {      // 图片上传成功后
        if (res.code === 0) {
          this.$message.success('上传头像成功')
          this.temp.icon = res.data
          console.log(res.data)
        } else {
          this.$message.error('上传失败，请重试')
        }
      },
      goList(id) {  // 跳转至功能列表
        this.$router.push({path: '/community/fnlist', query: {id}})
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
        this.temp = {      // 清空内容数据对象
          enable: '1',
          id: 0,
          icon: null,
          sort: null,
          title: null,
          url: null
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
            addFunction(this.temp).then(res => {
              if (res.code === ERR_OK) {
                this.getTableData()
                this.dialogFormVisible = false
                this.$message.success('创建成功')
              }
            })
          }
        })
      },
      update() {  // 确认编辑此条信息
        this.temp.enable = this.enable
        if (!this.temp.startTime || !this.temp.endTime) {
          this.$message.error('请选择时间范围')
          return
        }
        upadateFunction(this.temp).then(res => {
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
