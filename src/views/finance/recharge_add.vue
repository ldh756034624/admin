<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-upload
  class="upload-demo"
  :action="fileURL+'/batch/recharge/file'"
  :headers="{token:token}"
            :show-file-list="false"
            :on-success="handleImgSuccess"
  name = "file"
  accept = ".xls,.xlsx" style="float: left;">
  <el-button size="small" type="primary">导入</el-button>
  <div slot="tip" class="el-upload__tip">只能上传xls,xlsx文件</div>
</el-upload>
<el-button class="filter-item" type="primary" @click="ondown" style="margin-left: 50px;">导入模板下载</el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="序号">
        <template scope="scope">
          <span>{{scope.row.index}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值金额">
        <template scope="scope">
          <span>{{scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template scope="scope">
          <span>{{scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
  <el-form-item label="批次号" prop="batchNo">
    <el-input v-model="form.batchNo"></el-input>
  </el-form-item>
  <el-form-item label="备注">
    <el-input v-model="form.remark" type="textarea"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')" v-loading="loading">确定</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
  import {getTableData, batchImport} from '@/api/finance'
  import store from '@/store';
  const ERR_OK = 0
  export default {
    data() {
      return {
        loading: false,
        token: store.getters.token,
        form: {
          cacheId: '',
          batchNo: '',
          remark: ''
        },
        fileURL: process.env.BASE_API,
        rules: {
          batchNo: [
            { required: true, message: '请输入批次号', trigger: 'blur' }
          ]
        },
        tableData: null    // 表格数据
      }
    },
    created() {
    },
    methods: {
      handleImgSuccess(res, file) {      // 图片上传成功后
        if (res.code === 0) {
          this.$message.success('上传成功')
          this.form.cacheId = res.data.cacheId
          this.tableData = res.data.rechargeData
        } else {
          this.$message.error('上传失败，请重试')
        }
      },
      submitForm(formName) {
        const self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!self.form.cacheId) {
              self.$message.error('您还未上传文件')
              return
            }
            self.loading = true
            batchImport(self.form).then(res => {
              if (res.code === 0) {
                this.$message.success('导入成功')
                setTimeout(() => {
                  self.$router.push({ path: '/finance/recharge', replace: true })
                }, 1500)
              }
            })
          } else {
            return false;
          }
        });
      },
      ondown () {
        getTableData('/batch/template').then(res => {   // 获取tableData数据
          if (res.code === 0) {
            window.open(res.msg)
          }
        })
      }
    }
  }
</script>
<style type="text/css" scoped>
  .ruleForm {
    margin-top: 40px;
    width: 50%;
  }
</style>