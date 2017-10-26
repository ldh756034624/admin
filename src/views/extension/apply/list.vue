<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="客户名称">
          <el-input type="text" v-model="listQuery.company_name"></el-input>
        </el-form-item>
        <el-form-item label="原业务编号">
          <el-input type="text" v-model="listQuery.code"></el-input>
        </el-form-item>
        <el-form-item label="展期状态">
          <el-select v-model="listQuery.node">
            <el-option value="" label="请选择">请选择</el-option>
            <el-option :value="item.value" :label="item.name" v-for="item in nodeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker type="date" v-model="listQuery.start_time" placeholder="开始时间"></el-date-picker>
        </el-form-item>
         <el-form-item label="">
          <el-date-picker type="date" v-model="listQuery.end_time" placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleSearch" icon="search">查询</el-button>
          <el-button class="filter-item" type="primary" @click="handleExtensionApply" icon="time">展期申请</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--table-->
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
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
          <el-button size="small" type="success" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="primary" @click="handleSubmit(scope.row)">提交</el-button>
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

    <!-- 编辑窗口 -->
    <el-dialog :title="status | filterStatus" :visible.sync="dialogFormVisible" v-if="dialogFormVisible"  size="full">
      <edit :id="id" :companyId="companyId" :editInfo="editInfo" :status="status" @handle-success="handleSuccess" @handle-back="handleBack"></edit>
    </el-dialog>

    <!--todo 提交弹窗-->
    <el-dialog title="提交申请" :visible.sync="dialogShow2" v-if="dialogShow2"  size="small">
      <el-form>
        <el-form-item label="审批人">
          <el-select v-model="appUserId">
            <el-option v-for="item in usersList" :value="item.id" :label="item.name" :key="item.id">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <div class="btn-wrap"><el-button size="small" type="info" @click="handleSave">确认</el-button></div>
      </el-form>
    </el-dialog>

    <!--todo 展期申请窗口-->
    <el-dialog title="展期申请" :visible.sync="dialogExtensionVisible">
      <el-form>
        <table class="table table-bordered table-info">
          <tbody>
          <tr>
            <td>业务编号：</td>
            <td>
              <el-autocomplete
                class="inline-input"
                v-model="bizNo"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleBizNo"
              ></el-autocomplete>
            </td>
            <td>还款计划编号：</td>
            <td>
              <el-select v-model="rePaySelectCode" placeholder="请选择" v-if="bizInfo" @change="repaymentChange">
                <el-option
                  v-for="item in planNoList"
                  :label="item.code"
                  :value="item.code">
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>客户名称：</td>
            <td>
              <span v-if="bizInfo">{{bizInfo.companyName}}</span>
            </td>
            <td>应还款日：</td>
            <td>
              <span v-if="bizInfo">{{bizInfo.date}}</span>
            </td>
          </tr>
          <tr>
            <td>应还本金：</td>
            <td>
              <span v-if="bizInfo">{{bizInfo.money}}</span>
            </td>
            <td>应还利息：</td>
            <td>
              <span v-if="bizInfo">{{bizInfo.interest}}</span>
            </td>
          </tr>
          <tr>
            <td>展期还款日：</td>
            <td>
              <el-date-picker type="date" v-model="bizInfo.reDate" placeholder="选择日期"></el-date-picker>
            </td>
            <td>展期应还本金：</td>
            <td><el-input v-model="bizInfo.reMoney"></el-input></td>
          </tr>
          <tr>
            <td>展期应还利息：</td>
            <td><el-input v-model="bizInfo.reIntrest"></el-input></td>
            <td>展期应还本息：</td>
            <td><el-input v-model="bizInfo.reMoneyIntre"></el-input></td>
          </tr>
          </tbody>
        </table>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="submitApply">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getApplyList, createApplyList, getUserList, postUserSubmit } from '@/api/extension';
  import Edit from './edit'
  export default {
    components: { Edit },
    data() {
      return {
        rowId: '',          // 当前提交审批列表id
        appUserId: '',      // 审批人id
        usersList: [],        // 审批人列表
        dialogShow2: false,     // 提交弹窗
        rePaySelectCode: '',      // 还款计划编号查询
        editInfo: null,         // 编辑时候带进去的参数
        bizInfo: {            // 申请展期创建时的所有信息,提交用
          code: '',           // 展期code
          date: '',           // 展期还款日期
          money: '',          // 应还本金（元）
          interest: '',       // 应还利息（元）
          reDate: '',
          reMoney: '',
          reIntrest: '',
          reMoneyIntre: '',
          repayment_id: ''    // 还款计划ID
        },
        planNoList: [],   // 单个业务下，计划编号列表
        bizList: [],    // 所有业务编号列表
        bizNo: '',      // 业务编号
        dialogExtensionVisible: false,    // 展期申请弹窗
        nodeList: '',     // 选择下拉框
        list: null,
        total: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogCreateVisible: false, // 创建申请弹框
        listQuery: {
          page: 1,
          limit: 10,
          company_name: '',
          code: '',
          node: '',
          start_time: '',
          end_time: ''
        },
        id: '',
        companyId: '',
        status: 'eidt'
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getApplyList(this.listQuery).then(response => {
          const datas = response.data;
          this.nodeList = datas.node
          this.list = datas.list.data;
          this.total = datas.list.total;
          this.listLoading = false;
        });
      },
      handleSearch() {
        this.getList();
      },
      handleEdit(item) {
        this.id = item.id;
        this.companyId = item.repayment.loan.company_id;
        this.editInfo = null;
        this.status = 'edit';
        this.dialogFormVisible = true;
      },
      handleSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handleBack() {
        this.dialogFormVisible = false;
      },
      handleSubmit(row) {     // 列表提交
        this.rowId = row.id
        getUserList(this.rowId).then(res => {
          this.usersList = res.data.userList
          this.dialogShow2 = true
        })
      },
      handleSave() {     // 选好审批人提交
        const data = {
          assign_user_id: this.appUserId
        }
        postUserSubmit(this.rowId, data).then(res => {
          if (res.code === 0) {
            this.$message.success('提交申请成功')
            this.dialogShow2 = false
            this.getList()     // 刷新列表
          }
        })
      },
      handleExtensionApply() {     // 打开申请展期
        createApplyList().then(res => {
          res.data.list.forEach(item => {   // 生成编号
            this.bizList.push({
              value: item.code,
              company_id: item.company_id,
              companyName: item.companyName,
              repayment: item.repayment
            })
          })
          this.dialogExtensionVisible = true
        })
      },
      querySearch(queryString, cb) {
        const bizList = this.bizList;
        const results = queryString ? bizList.filter(this.createFilter(queryString)) : bizList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (list) => {
          return (list.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleBizNo(item) {
        this.planNoList = item.repayment
        this.bizInfo.companyName = item.companyName
        this.companyId = item.company_id;
      },
      submitApply() {      // 提交展期申请
        const info = JSON.parse(JSON.stringify(this.bizInfo))
        info.reDate = this.bizInfo.reDate
        if (info.reDate && info.reMoney && info.reIntrest && info.reMoneyIntre) {
          this.editInfo = info
          this.id = this.bizInfo.repayment_id; // 赋值还款id
          this.bizInfo = {  // 还原
            date: '',
            money: '',
            interest: '',
            reDate: '',
            reMoney: '',
            reIntrest: '',
            reMoneyIntre: '',
            repayment_id: ''
          }
          this.bizNo = ''
          this.rePaySelectCode = ''
          this.status = 'apply'
          this.dialogFormVisible = true
          this.dialogExtensionVisible = false
        } else {
          this.$message.error('请输入完整的内容')
        }
      },
      repaymentChange(val) {    // 计划编号变更
        this.planNoList.forEach((item) => {
          if (item.code === val) {
            this.bizInfo.statusString = item.statusString
            this.bizInfo.code = item.code
            this.bizInfo.date = item.date
            this.bizInfo.money = item.money
            this.bizInfo.interest = item.interest
            this.bizInfo.money_interest = item.money_interest
            this.bizInfo.repayment_id = item.id
          }
        })
      }
    },
    watch: {
      dialogShow2(newVal, oldVal) {    // 重置已选审批人
        if (newVal === false) {
          this.appUserId = ''
          this.rowId = ''
        }
      }
    },
    filters: {
      filterStatus(status) {
        const typeMap = {
          'edit': '展期编辑',
          'apply': '展期新增'
        };
        return typeMap[status];
      }
    }
  }
</script>
