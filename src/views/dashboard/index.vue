<template>
  <div class="dashboard-container">
    <div class="hd">我的代办事项</div>
    <div class="bd">
      <ul>
        <router-link :to="{ path: '/loan/apply'}">
          <li>
            <div class="num">{{info.waitSubmit}}</div>
            <div class="name">待提交</div>
          </li>
        </router-link>
        <router-link :to="{ path: '/loan/approval'}">
          <li>
            <div class="num">{{info.waitAudit}}</div>
            <div class="name">待审批</div>
          </li>
        </router-link>
        <router-link :to="{ path: '/loan/recheack'}">
          <li>
            <div class="num">{{info.waitRecheck}}</div>
            <div class="name">待复审</div>
          </li>
        </router-link>
        <router-link :to="{ path: '/loan/deal'}">
          <li>
            <div class="num">{{info.waitDispose}}</div>
            <div class="name">待处理</div>
          </li>
        </router-link>
        <router-link :to="{ path: '/loan/audit'}">
          <li>
            <div class="num">{{info.waitDisposeApprove}}</div>
            <div class="name">待处理审核</div>
          </li>
        </router-link>
        <router-link :to="{ path: '/loan/review'}">
          <li>
            <div class="num">{{info.waitLaw}}</div>
            <div class="name">待法律审查</div>
          </li>
        </router-link>

        <router-link :to="{ path: '/loan/lend'}">
          <li>
            <div class="num">{{info.waitMakeLoan}}</div>
            <div class="name">待放款</div>
          </li>
        </router-link>

        <router-link :to="{ path: '/manage/firstcheck'}">
          <li>
            <div class="num">{{info.waitCheck}}</div>
            <div class="name">待检查</div>
          </li>
        </router-link>

        <router-link :to="{ path: '/manage/checkaudit'}">
          <li>
            <div class="num">{{info.waitExamineCheck}}</div>
            <div class="name">待检查审核</div>
          </li>
        </router-link>

        <router-link :to="{ path: '/repay/repayment'}">
          <li>
            <div class="num">{{info.aboutToExpire}}</div>
            <div class="name">即将到期</div>
          </li>
        </router-link>

        <!-- <router-link :to="{ path: '/repay/repayment'}"> -->
          <li @click="goTody">
            <div class="num">{{info.todayExpire}}</div>
            <div class="name">今日到期</div>
          </li>
        <!-- </router-link> -->

        <!-- <li>
          <div class="num">{{info.waitPeriodAudit}}</div>
          <div class="name">待审批展期</div>
        </li>
        <li>
          <div class="num">{{info.waitAudit}}</div>
          <div class="name">待复审展期</div>
        </li>
        <li>
          <div class="num">{{info.waitPeriodDispose}}</div>
          <div class="name">待处理展期</div>
        </li>
        <li>
          <div class="num">{{info.waitAudit}}</div>
          <div class="name">待处理审核展期</div>
        </li>
        <li>
          <div class="num">{{info.waitPeriodLaw}}</div>
          <div class="name">待法律审查展期</div>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import { getDashboard } from '@/api/login'
import { parseTime } from '@/utils/index'
    export default {
      name: 'dashboard',
      data() {
        return {
          info: {}
        }
      },
      mounted() {
        this.getInit();
      },
      methods: {
        getInit() {
          getDashboard().then(res => {
            console.log('dashbord', res)
            const data = res.data;
            this.info = data;
          })
        },
        goTody() {
          const today = parseTime(new Date(), '{y}-{m}-{d}');
          this.$router.push({ path: '/repay/repayment', query: { start_time: today, end_time: today } })
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-container {
    margin: 30px;
    ul {
      margin-left: -20px;
      font-size: 14px;
      li {
        list-style: none;
        float:left;
        width: 120px;
        margin-bottom:40px;
        .num {
          border: 1px solid #ccc;
          border-radius: 20px;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin-bottom: 10px;
        }
      }
    }
  },
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
