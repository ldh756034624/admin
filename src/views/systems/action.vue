<template>
  <div class="app-container">
    <table class="table-bordered el-table" cellspacing="0" cellpadding="0" border="0" v-loading.body="listLoading">
      <thead>
        <tr>
          <th class="cell is-center">菜单名称</th>
          <th class="cell is-center">路由</th>
          <th class="cell is-center">参数</th>
          <th class="cell is-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list">
          <td class="is-center">{{item.name}}</td>
          <td class="is-center">{{item.route}}</td>
          <td class="is-center">{{item.params}}</td>
          <td class="is-center">
            <el-button size="small" type="info" @click="handleUpdate(item)">编辑
            </el-button>
            <el-button size="small" type="danger"  @click="handleDelete(item)">删除
            </el-button>
          </td>
        </tr>
        <tr v-for="(item,index) in waitMethods">
          <td class="is-center"><el-input type="text" v-model="names[index]"></el-input></td>
          <td class="is-center">{{item}}</td>
          <td class="is-center"><el-input type="text" v-model="params[index]"></el-input></td>
          <td class="is-center">
            <el-button size="small" type="success" @click="handleAddAction(item,index)">新增
            </el-button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单名称" data-hide="phone,tablet">
        <template scope="scope">
          <span><i v-for="item in scope.row.levels" class="icon sencond_icon"></i><i v-if class="icon current_icon"></i>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由" data-hide="phone,tablet">
        <template scope="scope">
          <span>{{scope.row.route}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数" width="80">
        <template scope="scope">
          <span>{{scope.row.params}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="success" @click="handleCreate(scope.row.id)">添加</el-button>
          <el-button size="small" type="info" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="warning" @click="handleStatus(scope.row)" v-if="scope.row.deleted_at != null">启用</el-button>
          <el-button size="small" type="warning" @click="handleStatus(scope.row)" v-else>禁用</el-button>
          <router-link :to="{name:'actions',params: {id:scope.row.id}}">
            <el-button size="small" type="primary">绑定动作</el-button>
          </router-link>
          <el-button size="small" v-if="scope.row.id !== 1" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  size="full">
      <el-form :model="temp" ref="temp" label-width="100px">
        <el-form-item label="名称" prop="name" >
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="route" >
          <el-input v-model="temp.route"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="params" >
          <el-input v-model="temp.params"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      	<el-button @click="dialogFormVisible = false">取消</el-button>
      	<el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>
      	<el-button v-else type="primary" @click="update">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getActionList, updateAction, deleteAction, createAction } from '@/api/system';
  export default {
    data() {
      return {
        loading: false,
        list: null,
        waitMethods: null,
        listLoading: null,
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {
          name: '',
          route: '',
          params: '',
          id: ''
        },
        textMap: {
          update: '编辑',
          create: '新增'
        },
        id: this.$route.params.id,
        names: [],
        params: []
      }
    },
    created() {
      this.getList();
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'warning'
        };
        return statusMap[status];
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        getActionList(this.$route.params.id).then(response => {
          this.list = response.data.bindMethods;
          this.waitMethods = response.data.waitMethods;
          this.listLoading = false;
        });
      },
      handleCreate() {
        this.resetTemp();
        this.temp.name = name;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.temp = {
          name: row.name,
          route: row.route,
          params: row.params,
          id: row.id
        };
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      resetTemp() {
        this.temp = {
          name: '',
          route: '',
          params: '',
          id: ''
        };
      },
      create() {
        createAction(this.temp, this.id).then(() => {
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      update() {
        updateAction(this.temp, this.id, this.temp.id).then(() => {
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      handleDelete(row) {
        deleteAction(row.id).then(() => {
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        });
      },
      handleAddAction(item, index) {
        const formData = {
          route: item,
          name: this.names[index],
          params: this.params[index],
          id: this.id
        }
        createAction(formData, this.id).then(() => {
          this.names = [];
          this.params = [];
          this.getList();
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    }
  }
</script>
