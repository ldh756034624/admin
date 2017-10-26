<template>
  <div class="app-container">
    <sticky :className="'sub-navbar '">
      <template>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="handleSave">保存
        </el-button>
        <el-button v-loading="loading" type="warning" @click="handleBack">返回</el-button>
      </template>
    </sticky>
    <el-tabs type="border-card" v-model="labelName">
      <el-tab-pane label="业务信息">
        <tab-business :business-info="businessInfo"></tab-business>
      </el-tab-pane>
      <el-tab-pane label="担保信息">
        <tab-assure :business-info="businessInfo"></tab-assure>
      </el-tab-pane>
      <el-tab-pane label="客户信息">
        <tab-customer :formData="formData" :bank="bank" :fileslist="filesList"></tab-customer>
      </el-tab-pane>
      <el-tab-pane label="财务信息">
        <tab-sheet :assets="assets" :profit="profit" :cash="cash" :year="formData.year" :id="companyId"></tab-sheet>
      </el-tab-pane>
      <el-tab-pane label="背景调查">
        <detail-file-list :id="3" :fileslist="bgFileList" name="原背景调查"></detail-file-list>
        <add-file-list :id="9" :fileslist="extensionbgFileList" name="展期背景调查" ref="add_file"></add-file-list>
      </el-tab-pane>
      <el-tab-pane label="合同借据">
        <tab-contract :business-info="businessInfo"></tab-contract>
      </el-tab-pane>
      <el-tab-pane label="还款计划" name="还款计划">
        <el-form>
          <table class="table table-bordered table-info2">
            <thead>
            <tr>
              <td>还款计划编号</td>
              <td>还款日期</td>
              <td>应还本金（元）</td>
              <td>应还利息</td>
              <td>本息合计</td>
              <td>状态</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ editInfo.code }}</td>
              <td>{{ editInfo.date }}</td>
              <td>{{ editInfo.money }}</td>
              <td>{{ editInfo.interest }}</td>
              <td>{{ editInfo.money_interest }}</td>
              <td>{{ editInfo.statusString }}</td>
            </tr>
            </tbody>
          </table>
        </el-form>
        <el-form>
          <table class="table table-bordered table-info2">
            <thead>
            <tr>
              <td>原还款计划编号</td>
              <td>展期还款日期</td>
              <td>应还本金（元）</td>
              <td>应还利息</td>
              <td>本息合计</td>
              <td>状态</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ editInfo.code }}</td>
              <td><el-date-picker type="date" v-model="editInfo.reDate" placeholder="选择日期"></el-date-picker></td>
              <td><el-input v-model="editInfo.reMoney"></el-input></td>
              <td><el-input v-model="editInfo.reIntrest"></el-input></td>
              <td><el-input v-model="editInfo.reMoneyIntre"></el-input></td>
              <td>正在创建</td>

            </tr>
            </tbody>
          </table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="放款记录">
        <tab-grant :business-info="businessInfo"></tab-grant>
      </el-tab-pane>
      <el-tab-pane label="业务进展" name="业务进展">
        <tab-progress :business-info="businessInfo"></tab-progress>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import TabCustomer from '@/components/Info/tabCustomer'
import TabSheet from '@/components/Info/tabSheet'
import TabBusiness from '@/components/Info/tabBusiness'
import TabAssure from '@/components/Info/tabAssure'
import TabBgsurvey from '@/components/Info/tabBgsurvey'
import TabContract from '@/components/Info/tabContract'
import TabProgress from '@/components/Info/tabProgress'
import TabGrant from '@/components/Info/tabGrant'
import { editEnterpriseDetail } from '@/api/customer'
import { saveEditApply, saveCreatedApply, getApplyDetail, getApplyCreateDetail } from '@/api/extension'
import AddFileList from '@/components/File/addFileList'
import DetailFileList from '@/components/File/detailFileList'
import { parseTime } from '@/utils/index'

export default {
  components: { AddFileList, DetailFileList, Sticky, TabCustomer, TabSheet, TabBusiness, TabAssure, TabBgsurvey, TabContract, TabProgress, TabGrant },
  props: {
    id: {
      type: Number
    },
    companyId: {
      type: Number
    },
    editInfo: {
      type: Object
    },
    status: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      loading: false,
      list: null,
      userList: null,
      labelName: '还款计划',
      dataForm: {
        assign_user_id: '',
        remark: '',
        status: 1
      },
      bgFileList: [],  // 背景调查文件列表
      extensionbgFileList: [],  // 背景调查文件列表
      /*  tab查看信息定义开始 */
      bank: [{}],
      formData: {
        user: {}
      },
      businessInfo: {
        applyRet: {},
        collateral: [],
        guarantee: [],
        impawn: []
      },   // 业务信息
      filesList: [],
      assets: { debt: {}, property: {} },
      profit: { main: {}, supplement: {} },
      cash: { main: {}, supplement: {} }
      /*  tab查看信息定义结束 */
    }
  },
  mounted() {
    this.getCustomerDetail();
    console.log(this.status)
    if (this.status === 'apply') {   // 如果带过来的status = apply就是新增
      this.getCreateInit();
    } else {   // 否则就是编辑
      this.getInit();
    }
  },
  methods: {
    getInit() {
      getApplyDetail(this.id).then(response => {
        const datas = response.data;
        this.list = datas.periodProgress;
        this.businessInfo = datas;
        this.editInfo = {
          code: datas.repaymentRet.code,
          date: datas.repaymentRet.date,
          money: datas.repaymentRet.money,
          interest: datas.repaymentRet.interest,
          money_interest: datas.repaymentRet.money_interest,
          statusString: datas.repaymentRet.statusString,
          reDate: datas.periodRet.date,
          reMoney: datas.periodRet.money,
          reIntrest: datas.periodRet.interest,
          reMoneyIntre: datas.periodRet.money_interest
        };
        this.bgFileList = datas.periodBackgroundFile.filelist;
      })
    },
    getCreateInit() {
      getApplyCreateDetail(this.id).then(response => {
        const datas = response.data;
        this.businessInfo = datas;
        this.extensionbgFileList = datas.backgroundFile.filelist;
      })
    },
    getCustomerDetail() {
      editEnterpriseDetail(this.companyId).then(response => {
        const datas = response.data.data;
        this.assets = datas.assets_list;
        this.cash = datas.cash_list;
        this.profit = datas.profit_list;
        this.bank = datas.bank;
        this.formData = datas.extend;
        this.formData.name = datas.name;
        this.formData.person_name = datas.person.name;
        this.formData.person_id = datas.person_id;
        this.formData.client_type = datas.client_type;   // 客户类型
        this.formData.id_card = datas.person.id_card;
        this.formData.year = response.data.year;
        this.filesList = response.data.video_file.filelist;
      })
    },
    handleSave() {
      const date = parseTime(this.editInfo.reDate, '{y}-{m}-{d}')    // 时间格式化
      const data = {
        date: date,
        money: parseFloat(this.editInfo.reMoney),
        interest: parseFloat(this.editInfo.reIntrest),
        money_interest: parseFloat(this.editInfo.reMoneyIntre),
        file_id: this.$refs['add_file'].file_id,
        file_type: this.$refs['add_file'].file_type_id
      }
      if (this.status === 'apply') {
        data.repayment_id = this.id;
        saveCreatedApply(data).then(res => {
          if (res.code === 0) {
            this.$message.success('保存成功')
            this.$emit('handle-success')
          } else {
            this.$message.error('保存失败')
          }
        })
      } else {
        saveEditApply(data, this.id).then(res => {
          if (res.code === 0) {
            this.$message.success('保存成功')
            this.$emit('handle-success')
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    handleBack() {
      this.$emit('handle-back');
    }
  }
}
</script>
