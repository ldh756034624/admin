<template>
  <div class="app-container">
  	<!-- 搜索 -->
  	<div class="filter-container">
  		<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机号/实名" v-model="listQuery.keyword"></el-input>

  		<el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
  		<el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">添加</el-button>
  	</div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="用户ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实名">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template scope="scope">
          <span v-if="scope.row.department !== null">{{scope.row.department.name}}</span>
          <span v-else="scope.row.department == null">---</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template scope="scope">
        	<p v-for="(item,index) in scope.row.roles" :key="item.id">{{item.name}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template scope="scope" >
          <el-tag :type="scope.row.status | statusFilter">
            <span v-if="scope.row.deleted_at == null">启用</span>
            <span v-else>禁用</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.created_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登陆">
        <template scope="scope">
          <span>{{scope.row.updated_at}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" v-if="scope.row.deleted_at == null" type="warning" @click="handleModifyStatus(scope.row.id)">禁用
          </el-button>
          <el-button size="small" v-else type="warning" @click="handleModifyStatus(scope.row.id)">启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-show="!listLoading"><el-pagination
      @current-change=""
      :current-page.sync="listQuery.page"
      :page-size="listQuery.limit"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination></div>

    <!-- 弹出窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  size="full">
      <el-form :model="temp" ref="temp" :rules="rules" label-width="100px  ">
        <el-form-item label="手机号" prop="phone" >
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="实名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department_id">
          <el-select v-model="temp.department_id" placeholder="请选择部门" style="width:100%">
            <el-option v-for="(item,index) in department_list" :label="item.name" :key="item.id" :value="item.id">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select multiple v-model="temp.roles" placeholder="请选择">
           <el-option v-for="(item,index) in roles_list" :label="item.name" :value="item.id" :key="item.id">
           </el-option>
         </el-select>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisible = false">取消</el-button>
       <el-button v-if="dialogStatus == 'create'" type="primary" @click="create('temp')">提交</el-button>
       <el-button v-else type="primary" @click="update('temp')">提交</el-button>
     </div>
   </el-dialog>

 </div>
</template>

<script>
  import { getUserList, addUser, modifyStatus, getDatas, updateUser } from '@/api/system';
  import { isPhone } from '@/utils/validate';
  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
      return {
        list: null,
        total: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {
          department_id: '',
          email: '',
          phone: '',
          name: '',
          roles: [],
          user_id: ''
        },
        rules: {
          department_id: [{ type: 'number', required: true, message: '请选择部门', trigger: 'change' }],
          phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
          name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
          roles: [{ type: 'array', required: true, message: '请选择至少一个角色', trigger: 'change' }]
        },
        listQuery: {
          page: parseInt(this.$route.query.page) || 1,
          limit: 20,
          keyword: undefined
        },
        textMap: {
          update: '编辑',
          create: '新增'
        },
        department_list: null,
        roles_list: null,
        id: ''
      }
    },
    mounted() {
      this.getList();
      this.getDatas();
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
        getUserList(this.listQuery).then(response => {
          this.listLoading = false;
          const datas = response.data;
          console.log(datas)
          this.list = datas.list.data;
          this.total = datas.list.total;
          this.listQuery.limit = datas.list.per_page;
        });
      },
      getDatas() {
        getDatas().then(response => {
          const datas = response.data;
          this.department_list = datas.departments;
          this.roles_list = datas.roles;
        });
      },
      handleFilter() {
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.temp = {
          department_id: row.department_id,
          email: row.email,
          phone: row.phone,
          name: row.name,
          roles: []
        };
        this.id = row.id;
        for (let i = 0; i < row.roles.length; i++) {
          // this.temp.roles.push(row.roles[i].id);
          this.$set(this.temp.roles, i, row.roles[i].id)
        }
        this.temp.user_id = row.id;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      resetTemp() {
        this.temp = {
          department_id: '',
          email: '',
          phone: '',
          name: '',
          roles: [],
          user_id: ''
        };
      },
      create(formname) {
        this.$refs[formname].validate(valid => {
          if (valid) {
            console.log(this.temp)
            addUser(this.temp).then(() => {
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
            console.log('error submit!!');
            return false;
          }
        });
      },
      update(formname) {
        this.$refs[formname].validate(valid => {
          if (valid) {
            updateUser(this.temp, this.id).then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleModifyStatus(id) {
        modifyStatus(id).then((response) => {
          this.getList();
          const datas = response;
          this.getList()
          this.$message({
            message: datas.msg,
            type: 'success',
            duration: 2000
          });
        })
      }
    }
  }
</script>
