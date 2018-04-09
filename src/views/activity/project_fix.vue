<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="title">
        当前专题：
        <el-tag type="primary">{{name}}专场</el-tag>
      </div>
      <el-button class="filter-item"
                 type="primary"
                 style="margin-left:10px"
                 @click="handleCreate"
                 icon="edit">新建装修板块
      </el-button>
    </div>
    <el-table v-loading="loading"
              element-loading-text="拼命加载中"
              :data="tableData"
              border
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center"
                       label="排序"
                       width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="图片">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="商品数">
        <template scope="scope">
          <span>{{scope.row.articleType.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="创建时间">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作">
        <template scope="scope">
          <el-button size="small"
                     type="info"
                     class="btn btn-sm btn-info"
                     icon="edit"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small"
                     type="danger"
                     icon="delete"
                     @click="handleDel">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @current-change="getTableData"
                     :current-page.sync="listQuery.pageNumber"
                     :page-size="listQuery.pageSize"
                     layout="total, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>

    <!-- 弹出编辑和新增窗口 -->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible"
               size="full">
      <el-form :model="temp"
               label-width="100px">
        <el-form-item label="模块图片">
          <el-upload :action="IMGUP_API"
                     :show-file-list="false"
                     :on-success="handleImgSuccess"
                     list-type="picture-card"
                     :before-upload="beforeHandleImg">
            <img v-if="temp.imgUrl"
                 :src="temp.imgUrl"
                 class="avatar"
                 width="148"
                 height="148">
            <i v-else
               class="avatar-uploader-icon el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="添加商品">
          <el-button size="small"
                     type="primary"
                     @click="handAdd">添加商品
          </el-button>
        </el-form-item>
        <el-form-item label="已添加商品"
                      class="w50">
          <el-table :data="tableData"
                    border
                    fit
                    highlight-current-row
                    stripe
                    style="width: 100%">
            <el-table-column align="center"
                             label="ID"
                             width="65">
              <template scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="商品名称">
              <template scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="排序">
              <template scope="scope">
                <el-input @change="inutChange(e, scope.row)"
                          v-model="scope.row.mySort"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template scope="scope">
                <el-button size="small"
                           icon="delete"
                           type="danger">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="排序">
          <el-input class="w30"
                    v-model="temp.userName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'"
                   type="primary"
                   @click="create">创建</el-button>
        <el-button v-else
                   type="primary"
                   @click="update">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTableData } from "@/api/community_content"

const ERR_OK = 0
export default {
  created() {
    this.id = this.$route.query.id // 专题id
    this.name = this.$route.query.name // 专题id
    this.getTableData()
  },
  data() {
    return {
      name: null, // 专题名称
      goodsSort: {},
      loading: false,
      temp: {
        // 弹窗内容数据对象
        articleTypeId: null,
        content: null,
        enable: 1,
        id: null,
        recommend: 1,
        sort: null,
        startTime: "",
        title: null,
        url: null,
        isPush: 0,
        imgUrl: null,
        userName: null
      },
      tableData: null, // 表格数据
      total: null, // 数据总数
      dialogFormVisible: false,
      listQuery: {
        // 关键字查询，翻页等数据
        pageNumber: 1,
        pageSize: 20
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      }
    }
  },
  methods: {
    // 给商品输入排序时
    inutChange() {
      console.log(this.tableData)
    },
    beforeHandleImg(file) {
      // 图片上传前
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      if (!isJPG) {
        this.$message.error("上传头像图片必须是 JPG,JPEG,PNG 格式!")
      }
      return isJPG
    },
    handleImgSuccess(res, file) {
      // 图片上传成功后
      if (res.code === 0) {
        this.$message.success("上传成功")
        this.temp.imgUrl = res.data
      } else {
        this.$message.error("上传失败，请重试")
      }
    },
    goList(id) {
      // 跳转至功能列表
      this.$router.push({ path: "/community/fnlist", query: { id } })
    },
    getTableData() {
      let _this = this
      this.loading = true
      getTableData(`/goodsTopic/module/${this.id}`, this.listQuery).then(
        res => {
          // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data

            // 动态绑定属性
            // if (this.tableData.length > 0) {
            //   this.tableData.forEach(element => {
            //     _this.$set(element, "mySort", element.mySort)
            //   })
            // }

            this.loading = false
          }
        }
      )
    },
    handleCreate() {
      // 点击创建新功能按钮
      this.resetTemp() // 清空原有表单
      this.dialogStatus = "create"
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      // 点击编辑功能按钮
      this.resetTemp()
      this.dialogStatus = "update"
      this.dialogFormVisible = true
    },
    resetTemp() {
      // 重置弹出表格
      this.temp = {
        // 清空内容数据对象
        articleTypeId: null,
        content: null,
        enable: 1,
        id: null,
        recommend: 1,
        sort: null,
        startTime: "",
        title: null,
        url: null,
        isPush: 0,
        imgUrl: null,
        userName: null
      }
    },
    create() {
      // 创建新功能
      addArt(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("创建成功")
        }
      })
    },
    update() {
      // 确认编辑此条信息
      upadateArt(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("保存成功")
        }
      })
    }
  },
  watch: {
    goodsSort() {
      console.log(this.goodsSort)
    }
  }
}
</script>

<style lang="scss">
.title {
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid #f2f2f2;
}
</style>

