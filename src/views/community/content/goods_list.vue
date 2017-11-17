<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品编码">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品类型">
        <template scope="scope">
          <span>{{scope.row.goodsType.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品价格">
        <template scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存">
        <template scope="scope">
          <span>{{scope.row.stock}}</span>
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
      <el-table-column align="center" label="商品状态">
        <template scope="scope">
          <span>{{scope.row.status === 0 ? '下架' : '上架'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.status === 0" size="small" type="success" @click="changeStatus(scope.row.id, 1)">上架
          </el-button>
          <el-button v-else size="small" type="danger" @click="changeStatus(scope.row.id, 0)">下架
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
      <el-form :model="temp" ref="temp" :rules="rules" label-width="100px" class="form30">
        <el-form-item label="名称" class="red-star">
          <el-input class="w30" v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="编码" class="red-star">
          <el-input class="w30" v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item label="类型" class="red-star">
          <el-select v-model="temp.goodsTypeId" placeholder="活动区域">
            <el-option v-for="item in select" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" class="red-star">
          <el-upload
            :action="IMGUP_API"
            :show-file-list="false"
            :on-success="handleImgSuccess"
            list-type="picture-card"
            :before-upload="beforeHandleImg">
            <img v-if="temp.img" :src="temp.img" class="avatar" width="148" height="148">
            <i v-else class="avatar-uploader-icon el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="原价" class="red-star">
          <el-input class="w30" v-model="temp.realPrice"></el-input>
        </el-form-item>
        <el-form-item label="价格" class="red-star">
          <el-input class="w30" v-model="temp.price"></el-input>
        </el-form-item>
        <el-form-item label="V币兑换" class="red-star">
          <el-input class="w30" v-model="temp.vCoinsRate"></el-input>
        </el-form-item>
        <el-form-item label="内容" class="red-star">
          <el-input class="w30" type="textarea" v-model="temp.description"></el-input>
        </el-form-item>
        <el-form-item label="上架时间">
          <el-date-picker
            v-model="dateRange"
            @change="dateRangeChange"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="库存" class="red-star">
          <el-input class="w30" v-model="temp.stock" v-number-only></el-input>
        </el-form-item>
        <el-form-item label="状态" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" v-model="temp.status" :label="1">上架</el-radio>
            <el-radio class="radio" v-model="temp.status" :label="0">下架</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>
        <el-button v-else type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getTableData, addGoods, upadateGoods, changeGoodsStatus} from '@/api/community_content'

  const ERR_OK = 0
  export default {
    data() {
      return {
        select: [
          {
            label: '手机卡',
            val: 1
          },
          {
            label: '滴滴卡',
            val: 2
          },
          {
            label: '实物',
            val: 3
          },
          {
            label: 'V币',
            val: 4
          },
        ],
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          img: null,
          code: null,
          name: null,
          description: null,
          goodsTypeId: 1,
          id: null,
          price: null,
          realPrice: null,
          status: 1,
          stock: null,
          vCoinsRate: null
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
    },
    methods: {
      changeStatus(id, type) { // 物品上下架
        let desc = type === 0 ? '下架' : '上架'
        this.$confirm(`是否${desc}此商品?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeGoodsStatus(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: `${desc}成功!`
              })
              this.getTableData()
            }
          })
        })
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
          this.$message.success('上传头像成功')
          this.temp.img = res.data
          console.log(res.data)
        } else {
          this.$message.error('上传失败，请重试')
        }
      },
      handleDele(id) { // 删除当前条目
        this.$confirm('此操作将永久删除该条, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFunction(id).then(res => {
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
      dateRangeChange() {      // 获取时间范围
        this.temp.startTime = new Date(this.dateRange[0]).getTime()
        this.temp.endTime = new Date(this.dateRange[1]).getTime()
      },
      getTableData() {
        getTableData('/community/goods/page', this.listQuery).then(res => {   // 获取tableData数据
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
        this.dateRange = []
        this.dateRange.push(new Date(row.startTime))   // 初始化时间
        this.dateRange.push(new Date(row.endTime))
        row.goodsTypeId = row.goodsType.id
        this.temp = Object.assign(this.temp, row)   // 赋值

        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      resetTemp() {   // 重置弹出表格
        this.dateRange = []
        this.temp = {      // 清空内容数据对象
          img: null,
          name: null,
          description: null,
          goodsTypeId: 1,
          id: null,
          price: null,
          code: null,
          realPrice: null,
          status: 1,
          stock: null,
          vCoinsRate: null
        }
      },
      create() {    // 创建新功能
        addGoods(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      },
      update() {  // 确认编辑此条信息
        upadateGoods(this.temp).then(res => {
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

<style lang="scss">
</style>
