<template>
  <div class="app-container">
    <el-table :data="list" v-loading="loading" element-loading-text="拼命加载中" border fit highlight-current-row style="width: 100%">
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
      <el-table-column align="center" label="图标" width="80" data-hide="phone,tablet">
        <template scope="scope">
          <span>{{scope.row.icon}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由" data-hide="phone,tablet">
        <template scope="scope">
          <span>{{scope.row.route}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组件名称" data-hide="phone,tablet">
        <template scope="scope">
          <span>{{scope.row.route_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="允许参数" width="80">
        <template scope="scope">
          <span>{{scope.row.params}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template scope="scope">
          <span v-if="scope.row.deleted_at != null">禁用</span>
          <span v-else>启用</span>
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
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="full">
      <el-form :model="temp" ref="temp" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="route">
          <el-input v-model="temp.route"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="route">
          <el-input v-model="temp.route_name"></el-input>
        </el-form-item>
        <el-form-item label="参数">
          <el-input v-model="temp.params"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="temp.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parent_id">
          <el-select v-model="temp.parent_id" placeholder="请选择父级菜单" style="width:100%">
            <el-option v-for="item in list" :label="item.name" :key="item.id" :value="item.id">
              <span v-if="item.level == 1">&nbsp;&nbsp;┗&nbsp;&nbsp;{{item.name}}</span>
              <span v-if="item.level == 2">&nbsp;&nbsp;&nbsp;&nbsp;┗&nbsp;&nbsp;{{item.name}}</span>
              <span v-if="item.level == 3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┗&nbsp;&nbsp;{{item.name}}</span>
              <span v-if="item.level == 4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┗&nbsp;&nbsp;{{item.name}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
         <el-button @click="dialogFormVisible = false">取消</el-button>
         <el-button v-if="dialogStatus == 'create'" type="primary" @click="create('temp')">提交</el-button>
         <el-button v-else type="primary" @click="update('temp')">提交</el-button>
       </el-form-item>
     </el-form>
   </el-dialog>
 </div>
</template>

<script>
  import { getMenusList, storeMenus, updateMenus, deleteMenus, checkStatus } from '@/api/system';
  import store from '@/store';
  export default {
    data() {
      return {
        loading: false,
        list: null,
        listLoading: null,
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {
          name: '',
          icon: '',
          route: '',
          route_name: '',
          parent_id: '',
          sort: 0,
          params: '',
          id: ''
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          route: [{ required: true, message: '请输入路由', trigger: 'blur' }],
          parent_id: [{ type: 'number', required: true, message: '请选择父级菜单', trigger: 'change' }]
        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
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
        getMenusList().then(response => {
          this.listLoading = false;
          this.list = response.data;
          for (let i = 0; i < this.list.length; i++) {
            const length = this.list[i].level;
            this.list[i].levels = new Array(length - 1);
          }
        })

        store.dispatch('GetRouterInfo').then(res => {
          const routers = res.data;
          store.dispatch('SetAdminMenus',{ routers })
        });
      },
      handleCreate(id) {
        this.resetTemp();
        this.temp.parent_id = id;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.temp = {
          name: row.name,
          icon: row.icon,
          route: row.route,
          route_name: row.route_name,
          parent_id: row.parent_id,
          sort: row.sort,
          params: row.params,
          id: row.id
        };

            // this.temp = Object.assign({},row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      resetTemp() {
        this.temp = {
          name: '',
          icon: '',
          route: '',
          route_name: '',
          parent_id: '',
          sort: 0,
          params: '',
          id: ''
        };
      },
      create(formname) {
        console.log(this.temp);
        this.$refs[formname].validate(valid => {
          if (valid) {
            storeMenus(this.temp).then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
            })
          } else {
            return false;
          }
        });
      },
      update(formname) {
        this.$refs[formname].validate(valid => {
          console.log(JSON.stringify(this.temp))
          if (valid) {
            updateMenus(this.temp).then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      handleStatus(row) {
        checkStatus(row.id).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            type: 'success',
            message: '更新成功',
            duration: 2000
          })
        })
      },
      handleDelete(row) {
        deleteMenus(row.id).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        });
      }
    }
  }
</script>
<style scoped>
  .icon {
    display: inline-block;
    width: 16px;
    height: 18px;
    vertical-align: top;
    overflow: hidden;
  }
  .current_icon {
    font-size: 12px;
    background: url(../../assets/tree_icons.png) no-repeat -192px 0;
  }
  .sencond_icon {
    background: url(../../assets/tree_icons.png) no-repeat -176px 0;
  }
</style>
