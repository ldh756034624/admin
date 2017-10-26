<template>
  <div class="row wrapper wrapper-content animated fadeInRight">
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="节点">
        <template scope="scope">
          <span>{{scope.row.node_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="节点值" width="80">
        <template scope="scope">
          <span>{{scope.row.node_value}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间(天)">
        <template scope="scope">
          <el-input size="small" v-model="scope.row.day"></el-input>
          <!-- <span>{{scope.row.day}}</span> -->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px;text-algin:center"><el-button type="primary" @click="handleUpdate">提交</el-button></div>
  </div>
</template>

<script>
  import { getNodeList, updateNode } from '@/api/system';
  export default {
    name: 'node',
    data() {
      return {
        list: null,
        listLoading: null
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getNodeList().then(response => {
          this.list = response.data.data;
          this.listLoading = false;
        });
      },
      handleUpdate() {
        const idArr = [], dayArr = [];
        for (let i = 0; i < this.list.length; i++) {
          idArr.push(this.list[i].id);
          dayArr.push(this.list[i].day);
        }
        const params = {
          id: idArr,
          day: dayArr
        };
        updateNode(params).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          });
        })
      }
    }
  }
</script>