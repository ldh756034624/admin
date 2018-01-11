<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店图片">
        <template scope="scope">
          <img :src="scope.row.images " width="150px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店名称">
        <template scope="scope">
          <span>{{scope.row.hotelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="房间数量">
        <template scope="scope">
          <span>{{scope.row.roomCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店地址">
        <template scope="scope">
          <span>{{scope.row.detailAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店电话">
        <template scope="scope">
          <span>{{scope.row.hotelPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店评分">
        <template scope="scope">
          <span>{{scope.row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="primary" @click="goRoom(scope.row.id)">
            房间
          </el-button>
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
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
        <el-form-item label="酒店名称" class="red-star">
          <el-input class="w30" v-model="temp.hotelName"></el-input>
        </el-form-item>
        <el-form-item label="酒店电话" class="red-star">
          <el-input class="w30" v-model="temp.hotelPhone"></el-input>
        </el-form-item>
        <el-form-item label="酒店城市" class="red-star">
          <el-input class="w30" v-model="temp.city"></el-input>
        </el-form-item>
        <el-form-item label="酒店地址" class="red-star">
          <el-input class="w30" v-model="temp.detailAddress"></el-input>
        </el-form-item>
        <el-form-item label="酒店评分" class="red-star">
          <el-input class="w30" v-model="temp.grade"></el-input>
        </el-form-item>
        <el-form-item label="预定时间" class="red-star">
          <el-date-picker
            v-model="dateRange"
            @change="dateRangeChange"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="酒店图片" class="red-star">
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
        <el-form-item label="酒店介绍" class="red-star">
          <ckeditor ref="ckeditor" :data="temp.hotelInfo" @getData="getCk"></ckeditor>
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
  import {getTableData, addHotel, updateHotel} from '@/api/hotel'
  import Ckeditor from '@/components/ckeditor/ckeditor'

  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        dateRange: null,  // 时间范围
        showFileList: [], // 展示出来的文件列表
        temp: {           // 弹窗内容数据对象
          city: null,
          detailAddress: null,
          endReserveTime: null,
          grade: null,
          hotelInfo: null,
          hotelName: null,
          hotelPhone: null,
          id: null,
          images: [],
          startReserveTime: null
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
      dateRangeChange() {      // 获取时间范围
        this.temp.startReserveTime = new Date(this.dateRange[0]).getTime()
        this.temp.endReserveTime = new Date(this.dateRange[1]).getTime()
      },
      beforeHandleImg(file) {      // 图片上传前
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        if (!isJPG) {
          this.$message.error('上传图片必须是 JPG,JPEG,PNG 格式!')
        }
        return isJPG
      },
      handleImgSuccess(res, file, fileList) {      // 图片上传成功后
        if (res.code === 0) {
          this.$message.success('上传成功')
          this.imgList = fileList
          console.log('imgList', this.imgList)
        } else {
          this.$message.error('上传失败，请重试')
        }
      },
      // 删除图像
      handleImgRemove(file, fileList) {
        this.imgList = fileList
        console.log('imgList', this.imgList)
      },
      goRoom(id) {
        this.$router.push({path: '/goods/room', query: {id}})
      },
      getTableData() {
        this.loading = true
        getTableData('/hotels', this.listQuery).then(res => {   // 获取tableData数据
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
        this.$nextTick(() => {
          this.$refs.ckeditor.clearData()
        })
      },
      handleUpdate(row) {   // 点击编辑功能按钮
        this.resetTemp()
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.temp.images = [this.temp.images]
        this.temp.images.forEach((item, index) => {  // 图片列表
          this.showFileList.push({
            name: index,
            url: item
          })
        })
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.ckeditor.setData()
        })
      },
      resetTemp() {   // 重置弹出表格
        this.dateRange = null  // 时间范围
        this.showFileList = []
        this.temp = {      // 清空内容数据对象
          city: null,
          detailAddress: null,
          endReserveTime: null,
          grade: null,
          hotelInfo: null,
          hotelName: null,
          hotelPhone: null,
          id: null,
          images: [],
          startReserveTime: null
        }
      },
      getCk(val) {
        this.temp.hotelInfo = val
      },
      getContent() {  // 获取editor组件的内容
        this.$refs.ckeditor.getData()
      },
      create() {    // 创建新功能
        this.getContent()
        if (this.imgList.length > 0) {
          this.imgList.forEach(item => {
            this.temp.images.push(item.response.data)
          })
        } else {
          this.$message.error('请选择图片')
        }
        addHotel(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      handleDel(id) { // 删除公告
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAnnounce(id).then(res => {
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
        this.getContent()
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
        }
        updateHotel(this.temp).then(res => {
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
