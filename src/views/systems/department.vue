<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">添加</el-button>
    </div>
    <el-table :data="list" v-loading="loading" element-loading-text="拼命加载中" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="人数">
        <template scope="scope">
          <span>{{scope.row.users_count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  size="full">
      <el-form :model="temp" ref="temp" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name" >
          <el-input v-model="temp.name"></el-input>
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
  import { getDepartmentList, addDepartment, updateDepartment, deleteDepartment } from '@/api/system';
  export default {
    data() {
      return {
        loading: false,
        list: null,
        total: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {
          name: '',
          id: ''
        },
        rules: {
          name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
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
    methods: {
      getList() {
        this.listLoading = true;
        getDepartmentList().then(response => {
          this.list = response.data;
          this.listLoading = false;
        });
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.temp = {
          name: row.name,
          id: row.id
        }
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleDelete(row) {
        deleteDepartment(row.id).then(response => {
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
      resetTemp() {
        this.temp = {
          name: '',
          id: ''
        };
      },
      create() {
        addDepartment(this.temp).then(() => {
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
        updateDepartment(this.temp, this.temp.id).then(() => {
          this.getList();
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    }
  }
</script>
