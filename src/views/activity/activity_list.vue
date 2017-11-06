<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="margin-left:10px" @click="handleCreate" icon="edit">新增
      </el-button>
    </div>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="活动ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动名称">
        <template scope="scope">
          <span>{{scope.row.activityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动预览">
        <template scope="scope">
          <span>{{scope.row.activityDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template scope="scope">
          <span>{{scope.row.startTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template scope="scope">
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button size="small" type="info" class="btn btn-sm btn-info" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="success" @click="handleActive(scope.row)">{{scope.row.enable == 0 ? '开启' : '关闭'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="getTableData"
        :current-page.sync="listQuery.pageNumber"
        :page-size="listQuery.pageSize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

    <!-- 弹出编辑或者新增窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="full">
      <el-form>
        <el-tabs type="border-card">
          <el-tab-pane label="活动设置">
            <el-form-item label="活动名称" label-width="80px">
              <div class="w50">
                <el-input v-model="temp.activityName" placeholder="请输入活动名称"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="关键字" label-width="80px">
              <div class="w50">
                <el-input v-model="temp.code" placeholder="请输入关键字"></el-input>
                <el-checkbox v-model="temp.isPush" true-label="1" false-label="0">回复关键字推送活动</el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="活动时间" label-width="80px">
              <div class="w50">
                <el-date-picker
                  v-model="dateRange"
                  @change="dateRangeChange"
                  type="daterange"
                  placeholder="选择日期范围">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="手机号" label-width="80px">
              <div class="w50">
                <div class="checkitem">
                  <el-radio class="radio" v-model="temp.needPhone" label="1">需要</el-radio>
                  <el-radio class="radio" v-model="temp.needPhone" label="0">不需要</el-radio>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="短信验证" label-width="80px">
              <div class="w50">
                <div class="checkitem">
                  <el-radio class="radio" v-model="temp.needSms" label="1">需要</el-radio>
                  <el-radio class="radio" v-model="temp.needSms" label="0">不需要</el-radio>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="活动规则" label-width="80px">
              <div class="w50">
                <el-input v-model="temp.activityDesc" type="textarea" placeholder="请输入活动规则"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="活动状态" label-width="80px">
              <div class="w50">
                <div class="checkitem">
                  <el-radio class="radio" v-model="temp.enable" label="1">开启</el-radio>
                  <el-radio class="radio" v-model="temp.enable" label="0">关闭</el-radio>
                </div>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="参与设置">
            <el-form-item label="每人总次数" label-width="150px">
              <div class="w50">
                <el-input v-model="temp.personTotalNumber" placeholder="请输入活动规则"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="每人每天次数" label-width="150px">
              <div class="w50">
                <el-input v-model="temp.personDailyNumber" placeholder="请输入活动规则"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="每人每天中奖次数" label-width="150px">
              <div class="w50">
                <el-input v-model="temp.personDailyTargetNumber" placeholder="请输入活动规则"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="中奖时间间隔" label-width="150px">
              <div class="w50">
                <el-input v-model="temp.targetPeriod" placeholder="请输入活动规则"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="参与频率" label-width="150px">
              <div class="w50">
                <el-input v-model="temp.participationFrequency" placeholder="请输入活动规则"></el-input>
              </div>
            </el-form-item>
          </el-tab-pane>
          <!--todo 以后有高级设置再加上-->
          <!--<el-tab-pane label="高级设置">-->
            <!--<hongbao :data="proData" ref="hongbao" @getProData="getProData"></hongbao>-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="create">提交</el-button>
        <el-button v-else type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getTableData, addGame, updateGame, activeGame} from '@/api/activity'
  import {isPhone} from '@/utils/validate'
//  import Hongbao from '@/components/activity/hongbao'

  const ERR_OK = 0
  export default {
    data() {
      return {
        proData: null,    // 高级设置的值
        enable: '1',
        dateRange: null,  // 时间范围
        temp: {           // 弹窗内容数据对象
          activityDesc: null,
          activityName: null,
          code: null,
          enable: '1',
          endTime: null,
          isPush: '0',
          needPhone: '1',
          needSms: '1',
          participationFrequency: null,
          personDailyNumber: null,
          personDailyTargetNumber: null,
          personTotalNumber: null,
          startTime: null,
          targetCount: null,
          targetPeriod: null,
          targetRate: null
        },
        tableData: null,    // 表格数据
        total: null,        // 数据总数
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
          code: [{required: true, message: '请输入标识', trigger: 'blur'}]
        },
        listQuery: {  // 关键字查询，翻页等数据
          pageNumber: 1,
          pageSize: 20,
        },
        textMap: {
          update: '编辑',
          create: '新增'
        }
      }
    },
    created() {
      this.getTableData()
    }
    ,
    methods: {
      handleActive(row) {  // 开启关闭活动
        let id = row.id
        let desc = row.enable == 0 ? '开启' : '关闭'
        this.$confirm(`是否${desc}活动?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          activeGame(id).then(res => {
            if (res.code === ERR_OK) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTableData()
            }
          })
        })
      },
      dateRangeChange() {      // 获取时间范围
        this.temp.startTime = new Date(this.dateRange[0]).getTime()
        this.temp.endTime = new Date(this.dateRange[1]).getTime()
      }
      ,
      getTableData() {
        getTableData('/community/activity/page', this.listQuery).then(res => {   // 获取tableData数据
          if (res.code === 0) {
            let datas = res.data
            this.total = datas.total
            this.tableData = datas.data
          }
        })
      }
      ,
      handleCreate() {    // 点击创建新功能按钮
        this.resetTemp()    // 清空原有表单
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      }
      ,
      handleUpdate(row) {   // 点击编辑功能按钮
        this.dateRange = []
        this.dateRange.push(new Date(row.startTime))   // 初始化时间
        this.dateRange.push(new Date(row.endTime))
        let stringArr = ['isPush', 'needPhone', 'needSms', 'enable']  // 转为string
        stringArr.forEach(item => {
          row[item] =row[item].toString()
        })
//        let proData = {
//          targetRate: row.targetRate,
//          targetCount: row.targetCount
//        }
//        this.proData = proData
        this.temp = row   // 赋值
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      }
      ,
      resetTemp() {   // 重置弹出表格
        this.proData = null
        this.temp = {           // 弹窗内容数据对象
          activityDesc: null,
          activityName: null,
          code: null,
          enable: '1',
          endTime: null,
          isPush: '0',
          needPhone: '1',
          needSms: '1',
          participationFrequency: null,
          personDailyNumber: null,
          personDailyTargetNumber: null,
          personTotalNumber: null,
          startTime: null,
          targetCount: null,
          targetPeriod: null,
          targetRate: null
        }
      }
      ,
      getProData(data) {   // 获取红包的高级配置
        this.proData = data
      }
      ,
      create() {    // 创建新功能
        if (!this.temp.startTime || !this.temp.endTime) {
          this.$message.error('请选择时间范围')
          return
        }
        this.$refs.hongbao.getData()   // 获取数据
        let data = Object.assign(this.temp, this.proData)
        console.log('data', data)
        console.log(JSON.stringify(data))
        addGame(data).then(res => {
          if (res.code === ERR_OK) {
            this.getTableData()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          }
        })
      }
      ,
      update() {  // 编辑此条信息
        if (!this.temp.startTime || !this.temp.endTime) {
          this.$message.error('请选择时间范围')
          return
        }
        updateGame(this.temp).then(res => {
          if (res.code === ERR_OK) {
            this.$message.success('保存成功')
            this.getTableData()
            this.dialogFormVisible = false
          }
        })
      }
    }
    ,
    components: {
//      Hongbao
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .w50 {
    display: inline-block;
    width: 50%;
  }
</style>
