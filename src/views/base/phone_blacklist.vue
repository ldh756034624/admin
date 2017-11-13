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
      <el-table-column align="center" label="手机串号">
        <template scope="scope">
          <span>{{scope.row.imei || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关联账号数">
        <template scope="scope">
          <span>{{scope.row.relevanceCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="加入时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="解禁时间">
        <template scope="scope">
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="原因" width="100">
        <template scope="scope">
          <span>{{scope.row.cause}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleDeblocking(scope.row.imei)">解禁
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
  </div>
</template>

<script>
  import {getTableData, phoneToBlacklist} from '@/api/base'

  const ERR_OK = 0
  export default {
    data() {
      return {
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20
        }
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      handleCreate() {  // 跳转新增黑名单列表
        this.$router.push({path: '/base/addPhoneBlacklist'})
      },
      getTableData() {
        getTableData('/account/black/imei/list', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleDeblocking(imei) { // 解禁
        this.$confirm(`确定解禁?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            imeis: [imei],
            status: 2
          }
          phoneToBlacklist(data).then((res) => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          })
        })
      }
    }
  }
</script>
