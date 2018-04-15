<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item"
                 type="primary"
                 style="margin-left:10px"
                 @click="handleCreate"
                 icon="edit">新建专题
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
                       label="序号"
                       width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="专题名称">
        <template scope="scope">
          <span>{{scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="专题URL">
        <template scope="scope">
          <span>{{scope.row.url}}</span>
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
          <router-link :to="{path: '/activity/projectFix', query: {id: scope.row.id, name: scope.row.name}}">
            <el-button size="small"
                       type="danger">装修
            </el-button>
          </router-link>
          <el-button size="small"
                     type="info"
                     class="btn btn-sm btn-info"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <!-- <el-button size="small" type="primary" @click="actionArtAssort(scope.row)">{{scope.row.enable == 0 ? '启用' : '禁用'}}</el-button> -->
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
        <el-form-item label="专题名称"
                      class="red-star">
          <el-input class="w30"
                    v-model="temp.name "></el-input>
        </el-form-item>
        <el-form-item label="商品边框">
          <el-upload :action="IMGUP_API"
                     :show-file-list="false"
                     :on-success="handleImgSuccess"
                     list-type="picture-card"
                     :before-upload="beforeHandleImg">
            <img v-if="temp.borderImg"
                 :src="temp.borderImg"
                 class="avatar"
                 width="148"
                 height="148">
            <i v-else
               class="avatar-uploader-icon el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="背景色">
          <el-input class="w30"
                    v-model="temp.bgColor "></el-input>
        </el-form-item>
        <el-form-item label="商品标题颜色">
          <el-input class="w30"
                    v-model="temp.titleColor"></el-input>
        </el-form-item>
        <el-form-item label="售价颜色">
          <el-input class="w30"
                    v-model="temp.priceColor"></el-input>
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
import { getTableData, addProject, updateProject } from "@/api/activity"

const ERR_OK = 0
export default {
  data() {
    return {
      loading: false,
      temp: {
        // 弹窗内容数据对象
        bgColor: null,
        borderImg: null,
        id: null,
        name: null,
        priceColor: null,
        titleColor: null
      },
      tableData: null, // 表格数据
      total: null, // 数据总数
      dialogFormVisible: false,
      dialogStatus: "",
      listQuery: {
        // 关键字查询，翻页等数据
        pageNumber: 1,
        pageSize: 20
      },
      textMap: {
        update: "编辑",
        create: "新增"
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
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
        this.temp.borderImg = res.data
      } else {
        this.$message.error("上传失败，请重试")
      }
    },
    goList(id) {
      // 跳转至功能列表
      this.$router.push({ path: "/community/fnlist", query: { id } })
    },
    getTableData() {
      this.loading = true
      getTableData("/goodsTopic/type", this.listQuery).then(res => {
        // 获取tableData数据
        if (res.code === 0) {
          let datas = res.data
          this.total = datas.total
          this.tableData = datas.data
          this.loading = false
        }
      })
    },
    resetTemp() {
      // 重置弹出表格
      this.temp = {
        // 清空内容数据对象
        bgColor: null,
        borderImg: null,
        id: null,
        name: null,
        priceColor: null,
        titleColor: null
      }
    },
    handleCreate() {
      // 点击创建新功能按钮
      this.resetTemp() // 清空原有表单
      this.dialogStatus = "create"
      this.dialogFormVisible = true
    },
    create() {
      // 创建新功能
      addProject(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("创建成功")
        }
      })
    },
    handleUpdate(row) {
      // 点击编辑功能按钮
      this.resetTemp()
      this.temp = Object.assign(this.temp, row)
      this.dialogStatus = "update"
      this.dialogFormVisible = true
    },
    update() {
      // 确认编辑此条信息
      updateProject(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("保存成功")
        }
      })
    }
  }
}
</script>
