<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="手机号">
          <el-input type="text" v-model="listQuery.phone"></el-input>
        </el-form-item>
        <el-form-item label="兑奖码">
          <el-input type="text" v-model="listQuery.code"></el-input>
        </el-form-item>
        <el-form-item label="中奖状态">
          <el-select v-model="listQuery.status" placeholder="请选择">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="getTableData" icon="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑奖码">
        <template scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID">
        <template scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ip">
        <template scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="经纬度">
        <template scope="scope">
          <span>{{scope.row.longitude}},{{scope.row.latitude}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleDetail(scope.row)">详情
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

    <!-- 详情窗口 -->
    <el-dialog title="详情" :visible.sync="dialogFormVisible" size="full">
      <el-form :model="temp" label-width="100px">
        <el-form-item label="用户ID">
          <span>{{temp.userId}}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{temp.phone}}</span>
        </el-form-item>
        <el-form-item label="中奖金额(元)">
          <span>{{temp.money}}</span>
        </el-form-item>
        <el-form-item label="经纬度">
          <span>{{temp.longitude}},{{temp.latitude}}</span>
        </el-form-item>
        <el-form-item label="IP">
          <span>{{temp.ip}}</span>
        </el-form-item>
        <el-form-item label="手机品牌">
          <span>{{temp.phoneType || '无'}}</span>
        </el-form-item>
        <el-form-item label="版本">
          <span>{{temp.version}}</span>
        </el-form-item>
        <el-form-item label="时间">
          <span>{{temp.createTime | formatDateTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {addFn, upadateFn, getTableData} from '@/api/community_content'
  import {isPhone} from '@/utils/validate'

  const ERR_OK = 0
  export default {
    data() {
      return {
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
          phone: null,
          code: null,
          status: 0
        },
        temp: {
          urserId: null,
          latitude: null,
          longitude: null,
          phone: null,
          money: null,
          ip: null,
          phoneType: null,
          version: null,
          createTime: null
        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
      }
    },
    created() {
      if (this.$route.query.code) {
        this.listQuery.code = this.$route.query.code
      }
      this.getTableData()
    },
    methods: {
      getTableData() {
        getTableData('/activity/lottery/flow/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      },
      handleDetail(row) {   // 查看详情
        this.temp = row
        this.dialogFormVisible = true
      }
    }
  }
</script>
