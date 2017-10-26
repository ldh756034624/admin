<template>
  <div class="app-container">
    <sticky :className="'sub-navbar '">
      <template>
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
      <el-tab-pane label="公司信息">
        <tab-customer :formData="formData" :bank="bank" :fileslist="filesList"></tab-customer>
      </el-tab-pane>
      <el-tab-pane label="财务信息">
        <tab-sheet :assets="assets" :profit="profit" :cash="cash" :year="formData.year" :id="companyId"></tab-sheet>
      </el-tab-pane>
      <el-tab-pane label="背景调查">
        <tab-bgsurvey-extension :business-info="businessInfo"></tab-bgsurvey-extension>
      </el-tab-pane>
      <el-tab-pane label="合同借据">
        <tab-contract-extension :business-info="businessInfo"></tab-contract-extension>
      </el-tab-pane>
      <el-tab-pane label="还款计划" name="还款计划">
        <tab-plan-extension :business-info="businessInfo"></tab-plan-extension>
      </el-tab-pane>
      <el-tab-pane label="放款记录">
        <tab-grant :business-info="businessInfo"></tab-grant>
      </el-tab-pane>
      <el-tab-pane label="业务进展" name="业务进展">
        <tab-progress :business-info="businessInfo"></tab-progress>
      </el-tab-pane>
      <el-tab-pane label="展期情况" name="展期情况">
        <el-form>
          <table class="table table-bordered table-info2">
            <thead>
              <tr>
                <td>业务进展</td>
                <td>审批意见</td>
                <td>结论</td>
                <td>处理人</td>
                <td>指派</td>
                <td>时间</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list">
                <td>{{item.nodename}}</td>
                <td>{{item.remark}}</td>
                <td>{{item.statusname}}</td>
                <td>{{item.user.name}}</td>
                <td><span v-if="item.assign_user != null">{{item.assign_user.name}}</span></td>
                <td>{{item.created_at}}</td>
              </tr>
            </tbody>
          </table>
        </el-form>
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
import TabBgsurveyExtension from '@/components/Info/tabBgsurveyExtension'
import TabContractExtension from '@/components/Info/tabContractExtension'
import TabPlanExtension from '@/components/Info/tabPlanExtension'
import TabProgress from '@/components/Info/tabProgress'
import TabGrant from '@/components/Info/tabGrant'
import { getSearchDetail } from '@/api/extension';
import { editEnterpriseDetail } from '@/api/customer'
export default {
  components: { Sticky, TabCustomer, TabSheet, TabBusiness, TabAssure, TabBgsurveyExtension, TabContractExtension, TabPlanExtension, TabProgress, TabGrant },
  props: {
    id: {
      type: Number
    },
    companyId: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      list: null,
      userList: null,
      labelName: '展期情况',
      dialogFormVisible: false,
      dataForm: {
        remark: '',
        status: '1'
      },
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
      cash: { main: {}, supplement: {} },
      progressList: [] // 业务进展
      /*  tab查看信息定义结束 */
    }
  },
  mounted() {
    this.getInit();
    this.getCustomerDetail();
  },
  methods: {
    getInit() {
      getSearchDetail(this.id).then(response => {
        const datas = response.data;
        this.list = datas.periodProgress;
        this.businessInfo = datas;
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
    handleBack() {
      this.$emit('handle-back');
    }
  }
}
</script>