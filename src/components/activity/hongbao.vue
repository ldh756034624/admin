<template>
  <div>
    <el-form-item label="中奖人数" label-width="130px">
      <div class="w50">
        <el-input v-model="realData.targetCount " placeholder="请输入中奖人数"></el-input>
      </div>
    </el-form-item>
    <el-form-item label="中奖比例（%）" label-width="130px">
      <div class="w50">
        <el-form-item v-for="(item, index)  in realData.targetRate" label-width="10px" style="margin-bottom: 5px;">
          <div>
            <span>第{{index + 1}}位</span>
            <el-input v-model="item.pos" class="w50" placeholder="请输入中奖比例"></el-input>
            <el-button type="primary" icon="plus" v-if="index === 0" @click="add"></el-button>
            <el-button type="primary" icon="minus" v-else @click="minus"></el-button>
          </div>
        </el-form-item>
      </div>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    name: 'hongbao',
    props: {
      data: {
        type: Object,
        default() {
          return {
            targetCount : null,
            targetRate: [
              {
                pos: null
              }
            ]
          }
        }
      }
    },
    data() {
      return {
        realData: this.data
      }
    },
    methods: {
      getData() {
        this.$emit('getProData', this.realData)
      },
      add() {
        this.realData.targetRate.push({
          pos: null
        })
      },
      minus() {
        this.realData.targetRate.pop()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .w50 {
    display: inline-block;
    width: 50%;
  }
</style>
