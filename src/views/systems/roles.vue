<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增</el-button>
    </div>
    <el-table :data="list" v-loading="loading" element-loading-text="拼命加载中" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="人数">
        <template scope="scope">
          <span>{{scope.row.users_count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拥有此角色">
        <template scope="scope">
          <span v-for="item in scope.row.users">{{item.name}},</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if="dialogFormVisible"  size="full">
      <el-form :model="temp" ref="temp" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name" >
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="权限菜单" >
          <el-tree :data="permsDatas" :props="defaultProps" ref="tree" node-key="id" show-checkbox></el-tree>
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
  import { getRoleList, StoreAddRole, updateRole, deleteRole, getAddRole, getEidtRole } from '@/api/system';
  export default {
    data() {
      return {
        loading: false,
        list: null,
        permsDatas: null,  // 权限的数据
        total: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {
          name: '',
          p: [],
          id: ''
        },
        rules: {
          name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
        },
        textMap: {
          update: '编辑',
          create: '新增'
        },
        defaultProps: {
          label: 'name',
          children: 'child'
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getRoleList().then(response => {
          this.list = response.data;
          this.listLoading = false;
        });
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        // this.$refs.tree.setCheckedKeys([]);    //清空权限菜单树
        getAddRole().then(response => {
          const datas = response.data;
          this.permsDatas = datas.permission;
          this.listLoading = false;
        });
      },
      handleUpdate(row) {
        this.resetTemp();
        getEidtRole(row.id).then(response => {
          const datas = response.data;
          this.permsDatas = datas.menus;
          this.doc = datas.doc;
          this.temp = {
            name: datas.role.name,
            id: row.id,
            p: datas.myrole
          }

          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        })
      },
      resetTemp() {
        this.temp = {
          name: '',
          p: [],
          id: ''
        };
      },
      handleDelete(row) {
        deleteRole(row.id).then(() => {
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      create() {
        this.temp.p = this.$refs.tree.getCheckedKeys();
        StoreAddRole(this.temp).then(() => {
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      update() {
        this.temp.p = this.$refs.tree.getCheckedKeys();
        updateRole(this.temp).then(() => {
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleNodeChild(data) {
        console.log(data)
      }
    }
  }
</script>
