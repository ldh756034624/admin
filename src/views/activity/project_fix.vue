<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div>

      </div>
      <div class="title">
        当前专题：
        <el-tag type="primary">{{name}}专场</el-tag>
      </div>
      <router-link to="/activity/project">
        <el-button type="primary"
                   @click="handleCreate"
                   icon="arrow-left">返回
        </el-button>
      </router-link>
      <el-button class="filter-item"
                 style="margin-left:10px"
                 type="primary"
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
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="图片">
        <template scope="scope">
          <span><img :src="scope.row.img"
                 height="50"></span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="商品数">
        <template scope="scope">
          <span>{{scope.row.goodsCount }}</span>
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
                     @click="handleUpdate(scope.row.topicModuleId)">编辑
          </el-button>
          <el-button size="small"
                     type="danger"
                     icon="delete"
                     @click="handleDel(scope.row.topicModuleId)">删除
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
               :rules="rules"
               ref="validateForm"
               label-width="100px">
        <el-form-item label="模块图片">
          <el-upload :action="IMGUP_API"
                     :show-file-list="false"
                     :on-success="handleImgSuccess"
                     list-type="picture-card"
                     :before-upload="beforeHandleImg">
            <img v-if="temp.img"
                 :src="temp.img"
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
                     @click="handleAddGoods">添加商品
          </el-button>
        </el-form-item>
        <el-form-item label="已添加商品"
                      class="w50">
          <el-table :data="addedGoodList"
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
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="排序">
              <template scope="scope">
                <el-input v-model.number="scope.row.sort"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template scope="scope">
                <el-button size="small"
                           icon="delete"
                           @click="handleDelGood(scope.row)"
                           type="danger">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="排序"
                      prop="sort"
                      class="red-star">
          <el-input class="w30"
                    v-model.number="temp.sort"></el-input>
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

    <!-- 弹出编辑和新增窗口1 -->
    <el-dialog title="商品列表"
               :visible.sync="dialogFormVisible1"
               size="small">
      <div class="filter-container">
        <el-form inline>
          <el-input type="text"
                    class="w30"
                    placeholder="商品名或者ID"
                    v-model="listQuery1.key"></el-input>
          <el-form-item>
            <el-button class="filter-item"
                       type="primary"
                       @click="getTableData1"
                       icon="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData1"
                border
                fit
                ref="goodsTable"
                row-key="id"
                @selection-change="handleSelectionChange"
                highlight-current-row
                style="width: 100%">
        <el-table-column type="selection"
                         :reserve-selection="true"
                         width="55">
        </el-table-column>
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
            <span>{{scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination @current-change="getTableData1"
                       :current-page.sync="listQuery1.pageNumber"
                       :page-size="listQuery1.pageSize"
                       layout="total, prev, pager, next"
                       :total="total1">
        </el-pagination>
      </div>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="handleCloseD1">取消</el-button>
        <el-button type="primary"
                   @click="handleConfirmD1">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getTableData,
  addProjectModule,
  updateProjectModule,
  delProjectModule
} from "@/api/activity"

import { z1 } from "@/utils/validate"

const ERR_OK = 0
export default {
  created() {
    this.id = this.$route.query.id // 专题id
    this.name = this.$route.query.name // 专题id
    this.getTableData()
  },
  data() {
    var validateSort = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入排序数字"))
      } else if (!z1(value)) {
        // 正整数
        callback(new Error("请输入正确的数字"))
      } else {
        callback()
      }
    }
    return {
      rules: {
        sort: [{ validator: validateSort, trigger: "blur" }]
      },
      testList: [], // todo test
      name: null, // 专题名称
      tempAddedGoodList: [], // 当前页暂存的添加的商品列表
      addedGoodList: [], // 当前模块已添加的商品列表
      loading: false,
      // 弹窗内容数据对象
      temp: {
        ids: [],
        img: null,
        sort: null,
        topicModuleId: null,
        topicTypeId: this.$route.query.id
      },
      tableData: null, // 表格数据
      tableData1: null,
      total: null, // 数据总数
      dialogFormVisible: false,
      listQuery: {
        // 关键字查询，翻页等数据
        pageNumber: 1,
        pageSize: 20
      },
      tableData1: null, // 表格数据
      total1: null, // 数据总数
      dialogFormVisible1: false, // 第二个弹窗
      listQuery1: {
        // 关键字查询，翻页等数据
        key: null,
        pageNumber: 1,
        pageSize: 10
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      }
    }
  },
  methods: {
    // 删除已添加的商品
    handleDelGood(row) {
      let index = this.addedGoodList.indexOf(row)
      this.addedGoodList.splice(index, 1)
    },
    // 关闭弹窗1
    handleCloseD1() {
      this.tempAddedGoodList = []
      this.dialogFormVisible1 = false
    },
    // 确认弹窗1
    handleConfirmD1() {
      this.tempAddedGoodList.forEach(item => {
        // 遍历临时添加的去重加入addedList
        let addedIds = this.addedGoodList.map(i => {
          return i.id
        })
        console.log("addedIds", addedIds)
        item.id = Number(item.id)
        if (addedIds.indexOf(item.id) === -1) {
          this.addedGoodList.push(item)
        }
      })
      this.setAddedGoodsProp(this.addedGoodList)
      this.tempAddedGoodList = []
      this.dialogFormVisible1 = false
    },
    // 动态设置添加的数据双相绑定
    setAddedGoodsProp(arr) {
      let self = this
      if (arr.length > 0) {
        arr.forEach(element => {
          self.$set(element, "sort", element.sort)
        })
      }
    },
    // 点击添加商品按钮时，弹出选择框
    handleAddGoods() {
      this.dialogFormVisible1 = true
      this.getTableData1()
      this.$nextTick(() => {
        this.$refs.goodsTable.clearSelection() // 清空之前的表格选择
      })
    },
    // 多选时执行
    handleSelectionChange(val) {
      this.tempAddedGoodList = val
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
        this.temp.img = res.data
      } else {
        this.$message.error("上传失败，请重试")
      }
    },
    getTableData() {
      let _this = this
      this.loading = true
      getTableData(`/goodsTopic/type/module/${this.id}`, this.listQuery).then(
        res => {
          // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        }
      )
    },
    getTableData1() {
      let _this = this
      getTableData(`/community/goods/query`, this.listQuery1).then(res => {
        // 获取tableData数据
        if (res.code === 0) {
          let datas = res.data
          this.total1 = datas.total
          this.tableData1 = datas.data
        }
      })
    },
    // 删除该模块
    handleDel(id) {
      this.$confirm(`是否删除该模块?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delProjectModule(id).then(res => {
          if (res.code === ERR_OK) {
            this.$message({
              type: "success",
              message: `删除成功!`
            })
            this.getTableData()
          }
        })
      })
    },
    handleCreate() {
      // 点击创建新功能按钮
      this.resetTemp() // 清空原有表单
      this.dialogStatus = "create"
      this.dialogFormVisible = true
    },
    handleUpdate(id) {
      // 点击编辑功能按钮
      getTableData(`/goodsTopic/module/${id}`).then(res => {
        if (res.code === ERR_OK) {
          this.resetTemp()
          this.addedGoodList = res.data.goodsList
          this.setAddedGoodsProp(this.addedGoodList)
          this.temp = Object.assign(this.temp, res.data)
          this.temp.topicModuleId = id
          this.dialogStatus = "update"
          this.dialogFormVisible = true
        }
      })
    },
    // 返回处理过的ids
    hasSorted(arr) {
      let ids = {} // 最终输出的ids
      // 用于判断是否有没写排序的商品
      function hasSort(elem) {
        return !elem.sort
      }
      // 按指定属性排序
      function sort(prop) {
        return function(a, b) {
          let v1 = Number(a[prop])
          let v2 = Number(b[prop])
          return v1 - v2
        }
      }
      if (arr.length > 0) {
        if (arr.some(hasSort)) {
          this.$message.error("请填写完整的商品排序")
          return false
        } else {
          let sortList = arr.sort(sort("sort"))
          sortList.forEach((el, index) => {
            ids[el.id] = el.sort
          })
        }
      }
      return ids
    },
    // 创建新功能
    create() {
      if (!this.validateForm()) {
        return
      }
      this.temp.ids = this.hasSorted(this.addedGoodList)
      if (!this.temp.ids) {
        return
      }
      addProjectModule(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("创建成功")
        }
      })
    },
    update() {
      // 确认编辑此条信息
      if (!this.validateForm()) {
        return
      }
      this.temp.ids = this.hasSorted(this.addedGoodList)
      if (!this.temp.ids) {
        return
      }
      updateProjectModule(this.temp).then(res => {
        if (res.code === ERR_OK) {
          this.getTableData()
          this.dialogFormVisible = false
          this.$message.success("保存成功")
        }
      })
    },
    // true可以  false不可以
    validateForm() {
      this.$refs["validateForm"].validate(valid => {
        if (valid) {
          return true
        } else {
          return false
        }
      })
    },
    resetTemp() {
      // 重置弹出表格
      this.addedGoodList = []
      this.temp = {
        // 清空内容数据对象
        ids: {},
        img: "",
        sort: null,
        topicModuleId: null,
        topicTypeId: this.$route.query.id
      }
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

