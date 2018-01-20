<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增房间
      </el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="房间名称">
        <template scope="scope">
          <span>{{scope.row.roomName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="床类型">
        <template scope="scope">
          <span>{{scope.row.bedSize}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="门市价">
        <template scope="scope">
          <span>{{scope.row.originalPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template scope="scope">
          <span>{{scope.row.realPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否含早">
        <template scope="scope">
          <span>{{scope.row.include}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" :type="scope.row.status == 0 ? 'success' : 'warning'"
                     @click="handleEnable(scope.row.id,scope.row.status)">{{scope.row.status == 0 ? '启用' : '禁用'}}
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
        <el-form-item label="酒店名称" class="red-star">
          <span>{{temp.hotelName}}</span>
        </el-form-item>
        <el-form-item label="房间名称" class="red-star">
          <el-input class="w30" v-model="temp.roomName"></el-input>
        </el-form-item>
        <el-form-item label="床型" class="red-star">
          <el-input class="w30" v-model="temp.bedSize"></el-input>
        </el-form-item>
        <el-form-item label="是否含早" class="red-star">
          <el-input class="w30" v-model="temp.include"></el-input>
        </el-form-item>
        <el-form-item label="房间图片" class="red-star">
          <el-upload
            :action="IMGUP_API"
            :on-success="handleImgSuccess"
            :on-remove="handleImgRemove"
            list-type="picture-card"
            :file-list="showFileList"
            :before-upload="beforeHandleImg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="市场价" class="red-star">
          <el-input class="w30" v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="专享价" class="red-star">
          <el-input class="w30" v-model="temp.title"></el-input>
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
  import { changeRoomaStatus, getTableData } from '@/api/hotel'
  const ERR_OK = 0
  export default {
    data() {
      return {
        showFileList: [], // 展示出来的文件列表
        loading: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          bedSize: null,
          hotelId: null,
          id: null,
          images: [],
          include: null,
          originalPrice: null,
          realPrice: null,
          roomName: null,
          typeName: null
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          hotelId: this.$route.query.id // 酒店id
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
      handleImgSuccess(res, file, fileList) {      // 图片上传成功后
        if (res.code === 0) {
          this.$message.success('上传成功')
          this.imgList = fileList
        } else {
          this.$message.error('上传失败，请重试')
        }
      },
      // 删除图像
      handleImgRemove(file, fileList) {
        this.imgList = fileList
        console.log('imgList', this.imgList)
      },
      actionArtAssort(row) {  // 启用禁用
        row.enable === 0 ? row.enable = 1 : row.enable = 0
        upadateAnnounce(row).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.$message.success('操作成功')
          }
        })
      },
      getTableData() {
        this.loading = true
        getTableData('/hotel/rooms', this.listQuery).then(res => {   // 获取tableData数据
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
        this.temp.images.forEach((item, index) => {  // 图片列表
          this.showFileList.push({
            name: index,
            url: item
          })
        })
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          bedSize: null,
          hotelId: null,
          id: null,
          images: [],
          include: null,
          originalPrice: null,
          realPrice: null,
          roomName: null,
          typeName: null
        }
      },
      getCk(val) {
        this.temp.content = val
      },
      create() {    // 创建新功能
        if (this.imgList && this.imgList.length > 0) {

          this.imgList.forEach(item => {
             console.log(item.response.data)
            this.temp.images.push(item.response.data)
          })
        } else {
          this.$message.error('请选择图片')
          return
        }
        console.log(JSON.stringify(this.temp))
        addAnnounce(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      handleEnable(roomId,status) { // 禁用公告
        let hotelId = this.$route.query.id
        if(status === 1){
          status = 0
        }else{
          status = 1
        }
        this.$confirm(status==0?`确定禁用?`:`确定启用?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeRoomaStatus({hotelId, roomId, status}).then(res => {
            if (res.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getTableData()
            }
          })
        })
      },
      update() {  // 确认编辑此条信息
        if (this.imgList.length > 0) {
          this.imgList.forEach(item => {
            if (item.response.data) {
              this.temp.images.push(item.response.data)
            } else {
              this.temp.images.push(item.url) // 编辑时候的图片
            }
          })
        } else {
          this.$message.error('请选择图片')
          return
        }
        upadateAnnounce(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('修改成功')
          }
        })
      }
    },
    watch: {
      'temp.sort'(newVal, oldVal) {
        (newVal || newVal == 0) && (newVal = newVal.toString())
        this.$nextTick(() => {
          this.temp.sort = newVal.replace(/\D+/, '')
          console.log(this.temp.sort)
        })
      }
    },
    components: {
    }
  }
</script>
