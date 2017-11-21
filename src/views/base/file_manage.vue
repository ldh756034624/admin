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
      <el-table-column align="center" label="路径">
        <template scope="scope">
          <span>{{scope.row.articleType.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预览">
        <template scope="scope">
          <span>{{scope.row.recommend}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <!--<el-button size="small" type="primary" @click="actionArtAssort(scope.row)">-->
            <!--{{scope.row.enable == 0 ? '启用' : '禁用'}}-->
          <!--</el-button>-->
          <!--<el-button size="small" type="danger" @click="handleDel(scope.row.id)">删除-->
          <!--</el-button>-->
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
        <el-form-item label="标题" class="red-star">
          <el-input class="w30" v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="文件夹" prop="fontColor" class="red-star">
          <el-select v-model="temp.articleTypeId" placeholder="请选择">
            <el-option v-for="item in select" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章图片" class="red-star">
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
  import {getTableData, addArt, upadateArt, delArt} from '@/api/community_content'

  const ERR_OK = 0
  export default {
    data() {
      return {
        select: [],
        temp: {           // 弹窗内容数据对象
          articleTypeId: null,
          content: null,
          enable: 1,
          id: null,
          recommend: 1,
          sort: null,
          startTime: null,
          title: null,
          url: null,
          isPush: 0,
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
      this.getArtType()
    },
    methods: {
      dateChange(val) {
        if (!val) {
          this.temp.startTime = 0
          return
        }
        this.temp.startTime = new Date(val).getTime()
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
        row.enable === 0 ? row.enable = 1 : row.enable = 0
        row.articleTypeId = row.articleType.id
        upadateArt(row).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.$message.success('修改成功')
          }
        })
      },
      getArtType() {  // 获取文章所有类别
        let data = {
          pageNumber: 1,
          pageSize: 100
        }
        getTableData('/article/category/list', data).then(res => {
          if (res.code === 0) {
            res.data.data.forEach(item => {
              let tmp = {
                val: item.id,
                label: item.name
              }
              this.select.push(tmp)
            })
          }
        })
      },
      getTableData() {
        getTableData('/article/list', this.listQuery).then(res => {   // 获取tableData数据
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
        this.resetTemp()
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.temp.articleTypeId = row.articleType.id
        if (row.url) {
          this.temp.isPush = 1
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          articleTypeId: null,
          content: null,
          enable: 1,
          id: null,
          recommend: 1,
          startTime: null,
          title: null,
          url: null,
          isPush: 0,
          imgUrl: null,
        }
      },
      create() {    // 创建新功能
        this.temp.isPush == false && delete this.temp.url
        addArt(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      update() {  // 确认编辑此条信息
        this.temp.isPush == false && delete this.temp.url
        upadateArt(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('保存成功')
          }
        })
      },
      handleDel(id) { //删除
        this.$confirm('此操作将永久删除该条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delArt(id).then(res => {
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
    }
  }
</script>
