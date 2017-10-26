<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="客户名称">
          <el-input type="text" v-model="listQuery.company_name"></el-input>
        </el-form-item>
        <el-form-item label="业务编号">
          <el-input type="text" v-model="listQuery.code"></el-input>
        </el-form-item>
        <el-form-item label="展期状态">
          <el-select v-model="listQuery.node">
            <el-option value="" label="请选择">请选择</el-option>
            <el-option :value="item.value" :label="item.name" v-for="item in nodeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker type="date" v-model="listQuery.start_time" placeholder="开始时间"></el-date-picker>
        </el-form-item>
         <el-form-item label="">
          <el-date-picker type="date" v-model="listQuery.end_time" placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleSearch" icon="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65" prop="id">
      </el-table-column>
      <el-table-column align="center" label="业务编号" prop="repayment.loan.code">
      </el-table-column>
      <el-table-column align="center" label="还款计划编号" prop="repayment.code" width="120">
      </el-table-column>
      <el-table-column align="center" label="业务品种" prop="repayment.loan.businessTypeName">
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="repayment.loan.companyName">
      </el-table-column>
      <el-table-column align="center" label="贷款到期日" prop="repayment.date">
      </el-table-column>
      <el-table-column align="center" label="应还本金（元）" prop="repayment.money">
      </el-table-column>
      <el-table-column align="center" label="应还利息（%）" prop="repayment.interest">
      </el-table-column>
      <el-table-column align="center" label="展期后到期日">
        <template scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="展期应还本金（元）">
        <template scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="展期应还利息（元）">
        <template scope="scope">
          <span>{{scope.row.interest}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template scope="scope">
          <span>{{scope.row.statusString}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="success" @click="handleEdit(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="pagination-container" v-show="!listLoading"><el-pagination
      @current-change="getList"
      :current-page.sync="listQuery.page"
      :page-size="listQuery.limit"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination></div>

    <!-- 弹出窗口 -->
    <el-dialog title="查看" :visible.sync="dialogFormVisible" v-if="dialogFormVisible"  size="full">
      <edit :id="id" :companyId="companyId" @handle-success="handleSuccess" @handle-back="handleBack"></edit>
    </el-dialog>
  </div>
</template>

<script>
  import { getSearchList } from '@/api/extension';
  import Edit from './edit'
  export default {
    components: { Edit },
    data() {
      return {
        list: null,
        total: null,
        nodeList: null,
        businessTypeAry: null,
        listLoading: true,
        dialogFormVisible: false,
        listQuery: {
          page: parseInt(this.$route.query.page) || 1,
          limit: 20,
          code: '',
          company_name: '',
          node: '',
          start_time: '',
          end_time: ''
        },
        id: '',
        companyId: ''
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getSearchList(this.listQuery).then(response => {
          const datas = response.data;
          this.list = datas.list.data;
          this.total = datas.list.total;
          this.listQuery.limit = datas.list.per_page;
          this.nodeList = datas.node;
          this.listLoading = false;
        });
      },
      handleSearch() {
        this.getList();
      },
      handleEdit(item) {
        this.id = item.id;
        this.companyId = item.repayment.loan.company_id;
        this.dialogFormVisible = true;
      },
      handleSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handleBack() {
        this.dialogFormVisible = false;
      }
    }
  }
</script>