<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="filter-container">
        <el-form inline>
          <el-form-item label="回复名">
            <el-input type="text" v-model="listQuery.orderName"></el-input>
          </el-form-item>
          <el-form-item label="匹配类型">
            <el-select v-model="listQuery.matchStrategy">
              <el-option v-for="item in querySelect1" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="listQuery.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              :row-class-name="tableRowClassName"
              style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规则名">
        <template scope="scope">
          <span>{{scope.row.orderName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规则类型">
        <template scope="scope">
          <span>{{scope.row.matchStrategy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关键词">
        <template scope="scope">
          <span>{{scope.row.keyWord || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回复内容">
        <template scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回复内容类型">
        <template scope="scope">
          <span>{{scope.row.contentType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.status === 1 ? '使用中' : '禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="primary" class="btn btn-sm btn-info" @click="handleUpdate(scope.row.id)">编辑
          </el-button>
          <el-button size="small" :type="scope.row.status == 2 ? 'success' : 'warning'"
                     @click="handleEnable(scope.row.id,scope.row.status)">{{scope.row.status == 2 ? '启用' : '禁用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="getTableData"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

    <!-- 弹出编辑和新增窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="full">
      <el-form label-width="100px">
        <el-form-item label="规则名" class="red-star">
          <el-input v-model="temp.orderName"></el-input>
        </el-form-item>
        <el-form-item label="规则类型" class="red-star">
          <el-select v-model="temp.matchStrategy" placeholder="请选择">
            <el-option v-for="item in querySelect2" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词" class="red-star">
          <el-input v-model="temp.keyWord"></el-input>
        </el-form-item>
        <el-form-item label="回复类型" class="red-star">
          <el-select v-model="temp.contentType" placeholder="请选择" @change="mediaChange">
            <el-option
              v-for="item in selectMediaList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" v-if="materialQuery.type && materialQuery.type!== 'text'" @click="getMaterialList">
            更改
          </el-button>
        </el-form-item>
        <el-form-item label="回复内容" class="red-star">
          <el-input v-model="temp.content"></el-input>
        </el-form-item>
        <el-form-item label="排序" class="red-star">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="red-star">
          <div class="checkitem">
            <el-radio class="radio" :label="1" v-model="temp.status">启用</el-radio>
            <el-radio class="radio" :label="2" v-model="temp.status">禁用</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>
        <el-button v-else type="primary" @click="update">提交</el-button>
      </div>
    </el-dialog>

    <!--弹出回复类型素材选择框-->
    <el-dialog title="素材选择" :visible.sync="materialDialog" size="full">
      <el-table :data="materialList" border fit highlight-current-row
                style="width: 100%">
        <el-table-column align="center" label="文件名">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="素材最后更新时间">
          <template scope="scope">
            <span>{{scope.row.update_time | formatDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="选择">
          <template scope="scope">
            <el-button size="small" type="primary" class="btn btn-sm btn-info"
                       @click="handleMaterial(scope.row.media_id)">选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @current-change="getMaterialList"
          :current-page.sync="materialQuery.page"
          :page-size="materialQuery.limit"
          layout="total, prev, pager, next"
          :total="materialTotal">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="materialDialog = false">关闭</el-button>
        <!--<el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>-->
        <!--<el-button v-else type="primary" @click="update">提交</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getTableData,
    postTableData,
    changeWxReplyStatus,
    getMediaList,
    getRegList,
    addWxreply,
    updateReply
  } from '@/api/base'
  import {dataSelectProcessing} from '@/utils/data'

  const ERR_OK = 0
  export default {
    created() {
      this.getTableData()
      this.getSelectMediaList()
      this.getSelectRegList()
    },
    data() {
      return {
        firstEdit: false,  // 第一次进来编辑，hack change
        materialDialog: false, // 选择素材弹出框
        materialList: [], // 素材列表
        materialQuery: {  // 关键字查询，翻页等数据
          page: 1,
          limit: 20,
          type: ''
        },
        materialTotal: null,
        loading: false,
        temp: {           // 弹窗内容数据对象
          contentType: '', // 内容类型
          orderName: null,
          matchStrategy: null,
          keyWord: null,
          content: null,
          sort: null,
          status: 1,
        },
        fileList: [], // 文件上传暂存列表
        dateRange: null,  // 时间范围
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        listQuery: {  // 关键字查询，翻页等数据
          page: 1,
          limit: 20,
          orderName: null,
          matchStrategy: null,
          status: null
        },
        querySelect1: [], // 列表-规则的下拉数据
        querySelect2: [], // 编辑-规则的下拉数据
        textMap: {
          update: '编辑',
          create: '新增'
        },
        selectMediaList: [], // 编辑框媒体类型选择
      }
    },
    methods: {
      // 选择素材
      handleMaterial(id) {
        this.temp.content = id
        this.materialDialog = false
      },
      // 获取素材列表
      getMaterialList() {
        postTableData('/wx/reply/matter', this.materialQuery).then(res => {
          if (res.code === ERR_OK) {
            let data = res.data
            this.materialTotal = data.total_count
            this.materialList = data.item
            this.materialDialog = true
          }
        })
      },
      // 选择媒体类型时
      mediaChange(value) {
        if (this.firstEdit) {  // 第一次编辑不要弹窗
          this.firstEdit = false
          return
        }
        if (value === 'text' || !value) {
          this.temp.content = ''
          this.materialDialog = false
        } else {
          this.materialQuery.type = value
          this.materialQuery.page = 1
          this.temp.content = ''
          this.getMaterialList()
        }
      },
      // 获取tableData数据
      getTableData() {
        this.loading = true
        postTableData('/wx/reply/list', this.listQuery).then(res => {
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
            this.loading = false
          }
        })
      },
      // 控制每行table的颜色状态
      tableRowClassName(row, index) {
        if (row.status === 2) {
          return 'err-row'
        }
      },
      // 点击创建新功能按钮
      handleCreate() {
        this.resetTemp()    // 清空原有表单
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      // 重置弹出表格
      resetTemp() {
        this.temp = {
          contentType: '',
          orderName: null,
          matchStrategy: null,
          keyWord: null,
          content: null,
          sort: null,
          status: 1,
          id: ''
        }
        this.materialQuery = {
          page: 1,
          limit: 20,
          type: ''
        }
      },
      // 创建新功能
      create() {
        addWxreply(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.$message.success('创建成功')
            this.getTableData()
            this.dialogFormVisible = false
          }
        })
      },
      // 点击编辑功能按钮
      handleUpdate(id) {
        this.resetTemp()
        this.temp.id = id
        getTableData(`/wx/reply/detail/${id}`).then(res => {
          res.data.matchStrategy = res.data.matchStrategy.toString()
          this.firstEdit = true
          this.materialQuery.type = res.data.contentType
          this.temp = Object.assign(this.temp, res.data)

          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        })
      },
      // 编辑此条信息
      update() {
        updateReply(this.temp.id, this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.$message.success('保存成功')
            this.getTableData()
            this.dialogFormVisible = false
          }
        })
      },
      // 启用禁用
      handleEnable(id, status) { // 禁用公告
        this.$confirm(status === 1 ? `确定禁用?` : `确定启用?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeWxReplyStatus(id).then(res => {
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
      // 获取框媒体类型列表
      getSelectMediaList() {
        getMediaList().then(res => {
          let data = res.data
          this.selectMediaList = dataSelectProcessing(data, 'key', 'val')
        })
      },
      // 获取匹配规则下拉列表
      getSelectRegList() {
        getRegList().then(res => {
          let data = res.data
          this.querySelect2 = dataSelectProcessing(data, 'key', 'val')
          this.querySelect1 = dataSelectProcessing(data, 'key', 'val')
          this.querySelect1.unshift({
            label: '全部',
            value: ''
          })
        })
      }
    },
  }
</script>

<style lang="scss">
  .el-table .success-row {
    background: #D9FFFF;
  }

  .el-table .err-row {
    background: #FFB5B5;
  }
</style>
