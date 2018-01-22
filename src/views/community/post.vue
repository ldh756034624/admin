<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">帖子发布
      </el-button>
      <router-link to="/community/postAssort">
        <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="menu">分类管理
        </el-button>
      </router-link>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布者">
        <template scope="scope">
          <span>{{scope.row.articleType.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template scope="scope">
          <a class="blue" :href="scope.row.url || scope.row.jointUrl">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template scope="scope">
          <span>{{scope.row.articleType.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发帖时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="IP">
        <template scope="scope">
          <span>{{scope.row.enable === 0 ? '禁用' : '启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="赞赏人数/金额">
        <template scope="scope">
          <span class="blue" @click="handleRewards(scope.row.id)">{{scope.row.enable === 0 ? '禁用' : '启用'}}</span>
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
          <el-button size="small" type="danger" @click="handleDel(scope.row.id)">删除
          </el-button>
          <el-button size="small" type="primary" @click="handleComment(scope.row.id)">评论
          </el-button>
          <el-button size="small" type="success" @click="handleDel(scope.row.id)">通过/不通过
          </el-button>
          <el-button size="small" @click="handleDel(scope.row.id)">锁住
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
        <el-form-item label="帖子标题" class="red-star">
          <el-input class="w30" v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="马甲发布" class="red-star">
          <el-input class="w30" v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="选择分类" prop="fontColor" class="red-star">
          <el-select v-model="temp.articleTypeId" placeholder="请选择">
            <el-option v-for="item in select" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帖子内容" prop="fontColor" class="red-star">
          <ckeditor ref="ckeditor" :data="temp.content" @getData="getCk"></ckeditor>
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
  import {isPhone} from '@/utils/validate'

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
        select: [],
        enable: '1',
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          articleTypeId: null,
          content: null,
          enable: 1,
          id: null,
          recommend: 1,
          sort: null,
          startTime: '',
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
        rules: {
          title: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
          fontColor: [{required: true, message: '请输入颜色', trigger: 'blur'}]
        },
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
            this.$message.success('操作成功')
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
      goList(id) {  // 跳转至功能列表
        this.$router.push({path: '/community/fnlist', query: {id}})
      },
      getTableData() {
        this.loading = true
        getTableData('/article/list', this.listQuery).then(res => {   // 获取tableData数据
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
        row.startTime == 0 && (row.startTime = '')
        this.temp = Object.assign(this.temp, row)   // 赋值
        this.temp.articleTypeId = row.articleType.id
        if (row.url) {
          this.temp.isPush = 1
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs.ckeditor.setData()
        })
      },
      resetTemp() {   // 重置弹出表格
        this.temp = {      // 清空内容数据对象
          articleTypeId: null,
          content: null,
          enable: 1,
          id: null,
          recommend: 1,
          sort: null,
          startTime: '',
          title: null,
          url: null,
          isPush: 0,
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
        this.getContent()
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
      },
      // 跳转查看赞赏
      handleRewards(id) {
        this.$router.push({path: '/community/rewardList', query: {id}})
      },
      // 跳转评论查看
      handleComment(id) {
        this.$router.push({path: '/community/comment', query: {id}})
      }
    },
    watch: {
      'temp.sort'(newVal, oldVal) {
        (newVal || newVal == 0) && (newVal = newVal.toString())
        this.$nextTick(() => {
          this.temp.sort = newVal.replace(/\D+/, '')
        })
      }
    },
    components: {
      Ckeditor
    }
  }
</script>

<style scoped lang="less">
  .blue {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
