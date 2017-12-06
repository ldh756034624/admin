<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-select v-model="listQuery.type" placeholder="请选择操作类型">
        <el-option v-for="(item,index) in typeArr" :value="index" :key="index" :label="item">{{item}}</el-option>
      </el-select>

      <el-cascader :options="options" :props="defaultProps"></el-cascader>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.admin_id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作类型" width="80">
        <template scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="影响数据">
        <template scope="scope">
          <span v-html="scope.row.content"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" width="80">
        <template scope="scope">
          <span>{{scope.row.realname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template scope="scope">
         <span>{{scope.row. created_at}}</span>
       </template>
     </el-table-column>
     <el-table-column align="center" label="登录ip">
      <template scope="scope">
        <span>{{scope.row.ip}}</span>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container" v-show="!listLoading"><el-pagination
    @current-change="getList"
    :current-page.sync="listQuery.page"
    :page-size="listQuery.pageSize"
    layout="total, prev, pager, next"
    :total="total">
  </el-pagination></div>
</div>
</template>

<script>
  import { getLogsList } from '@/api/system';
  export default {
    data() {
      return {
        list: null,
        total: null,
        typeArr: null,
        options: [],
        defaultProps: {
          value: 'id',
          label: 'name',
          children: 'userslist'
        },
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          type: '',
          admin_id: ''
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getLogsList(this.listQuery).then(response => {
          this.listLoading = false;
          const datas = response.data.data;
          this.list = datas.logs.data;
          this.typeArr = datas.type_arr;
          this.options = datas.roles;
          this.total = datas.logs.total;
          this.listQuery.pageSize = datas.logs.per_page;
        });
      },
      handleFilter() {
        this.getList();
      }
    }
  }
</script>
