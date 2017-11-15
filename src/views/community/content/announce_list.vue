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
      <el-table-column align="center" label="标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.enable === 0 ? '禁用' : '启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="100">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="primary" @click="actionArtAssort(scope.row)">
            {{scope.row.enable == 0 ? '启用' : '禁用'}}
          </el-button>
          <el-button size="small" type="danger" @click="handleDel(scope.row.id)">删除
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
      <el-form :model="temp" label-width="100px">
        <el-form-item label="标题">
          <el-input class="w30" v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="文章图片">
          <el-upload
            :action="IMGUP_API"
            :show-file-list="false"
            :on-success="handleImgSuccess"
            list-type="picture-card"
            :before-upload="beforeHandleImg">
            <img v-if="temp.imgUrl" :src="temp.imgUrl" class="avatar" width="148" height="148">
            <i v-else class="avatar-uploader-icon el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" prop="fontColor">
          <ckeditor ref="ckeditor" :data="temp.content" @getData="getCk"></ckeditor>
        </el-form-item>
        <el-form-item label="外部链接">
          <div class="checkitem">
            <!--<el-checkbox v-model="temp.isPush" :true-label="1" :false-label="0">外部链接</el-checkbox>-->
            <el-input class="w30" v-model="temp.url"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="启用">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.enable" :label="1">是</el-radio>
            <el-radio class="radio" v-model="temp.enable" :label="0">否</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <el-input class="w30" v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="temp.publishTime"
            type="date"
            @change="dateChange"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作者">
          <el-input class="w30" v-model="temp.userName"></el-input>
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
  import {getTableData, addAnnounce, upadateAnnounce, delAnnounce} from '@/api/community_content'
  import Ckeditor from '@/components/ckeditor/ckeditor'

  const ERR_OK = 0
  export default {
    data() {
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          content: null,
          enable: 1,
          id: null,
          sort: null,
          publishTime: null,
          title: null,
          url: null,
//          isPush: 0,
          imgUrl: null,
          userName: null
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
      dateChange(val) {
        if (!val) {
          this.temp.publishTime = 0
          return
        }
        this.temp.publishTime = new Date(val).getTime()
      },
      beforeHandleImg(file) {      // 头像上传前
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        if (!isJPG) {
          this.$message.error('上传头像图片必须是 JPG,JPEG,PNG 格式!')
        }
        return isJPG
      },
      handleImgSuccess(res, file) {      // 图片上传成功后
        if (res.code === 0) {
          this.$message.success('上传成功')
          this.temp.imgUrl = res.data
        } else {
          this.$message.error('上传失败，请重试')
        }
      },
      actionArtAssort(row) {  // 启用禁用
        console.log()
        row.enable === 0 ? row.enable = 1 : row.enable = 0
        upadateAnnounce(row).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.$message.success('修改成功')
          }
        })
      },
      getTableData() {
        getTableData('/community/announcement/page', this.listQuery).then(res => {   // 获取tableData数据
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
        this.$nextTick(() => {
          this.$refs.ckeditor.clearData()
        })
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        this.resetTemp()
        this.temp = Object.assign(this.temp, row)   // 赋值
//        if (row.url) {
//          this.temp.isPush = 1
//        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.ckeditor.setData()
        })
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          content: null,
          enable: 1,
          id: null,
          sort: null,
          publishTime: null,
          title: null,
          url: null,
//          isPush: 0,
          imgUrl: null,
          userName: null
        }
      },
      getCk(val) {
        this.temp.content = val
      },
      getContent() {  // 获取editor组件的内容
        this.$refs.ckeditor.getData()
      },
      create() {    // 创建新功能
        this.getContent()
        console.log(JSON.stringify(this.temp))
        addAnnounce(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      update() {  // 确认编辑此条信息
        this.getContent()
        upadateAnnounce(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('修改成功')
          }
        })
      }
    },
    components: {
      Ckeditor
    }
  }
</script>
