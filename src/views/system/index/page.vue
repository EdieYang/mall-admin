<template>
  <d2-container>
    <el-card class="card">
      <div slot="header"
           class="clearfix">
        <span>总体统计</span>
      </div>
      <div class="statistic-cover">
        <div class="statistic-item">
          <p class="item-title">成功领养总数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="successAdoptCountTotal"
                      :options="options" />
          </p>
        </div>
        <div class="statistic-item">
          <p class="item-title">发布领养总数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="adoptCountTotal"
                      :options="options" />
          </p>
        </div>
        <div class="statistic-item">
          <p class="item-title">申请领养总数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="applyCountTotal"
                      :options="options" />
          </p>
        </div>
      </div>
    </el-card>
    <el-card class="card">
      <div slot="header"
           class="clearfix">
        <span>周统计</span>
      </div>
      <div class="statistic-cover">
        <div class="statistic-item">
          <p class="item-title">一周内发布领养数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="adoptCountInWeek"
                      :options="options" />
          </p>
        </div>
        <div class="statistic-item">
          <p class="item-title">一周内粉丝增长数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="fansCountInWeek"
                      :options="options" />
          </p>
        </div>
        <div class="statistic-item">
          <p class="item-title">一周内领养申请数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="applyCountInWeek"
                      :options="options" />
          </p>
        </div>
      </div>
    </el-card>

    <el-card class="card">
      <div slot="header"
           class="clearfix">
        <span>月统计</span>
      </div>
      <div class="statistic-cover">
        <div class="statistic-item">
          <p class="item-title">一个月内成功领养数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="successAdoptCountInMonth"
                      :options="options" />
          </p>
        </div>
        <div class="statistic-item">
          <p class="item-title">一个月内上传照片数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="galleryCountInMonth"
                      :options="options" />
          </p>
        </div>
        <div class="statistic-item">
          <p class="item-title">一个月内发布活动数</p>
          <p class="item-val">
            <ICountUp :delay="delay"
                      :endVal="activityCountInMonth"
                      :options="options" />
          </p>
        </div>
      </div>
    </el-card>

  </d2-container>
</template>
<script>
import ICountUp from 'vue-countup-v2';
import { getOrgStatistic } from '@/api/statistic/statisticApi.js'
import util from '@/libs/util'

var orgId = ''

export default {
  components: {
    ICountUp
  },
  data () {
    return {
      delay: 2000,
      activityCountInMonth: 0,
      adoptCountInWeek: 0,
      adoptCountTotal: 0,
      applyCountInWeek: 0,
      applyCountTotal: 0,
      fansCountInWeek: 0,
      fansCountTotal: 0,
      galleryCountInMonth: 0,
      successAdoptCountInMonth: 0,
      successAdoptCountTotal: 0,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      }
    }
  },
  methods: {
    getOrgStatistic () {
      getOrgStatistic(orgId).then(res => {
        console.log(res)
        this.activityCountInMonth = res.activityCountInMonth
        this.adoptCountInWeek = res.adoptCountInWeek
        this.adoptCountTotal = res.adoptCountTotal
        this.applyCountInWeek = res.applyCountInWeek
        this.applyCountTotal = res.applyCountTotal
        this.fansCountInWeek = res.fansCountInWeek
        this.fansCountTotal = res.fansCountTotal
        this.galleryCountInMonth = res.galleryCountInMonth
        this.successAdoptCountInMonth = res.successAdoptCountInMonth
        this.successAdoptCountTotal = res.successAdoptCountTotal

      }).catch(err => {
        // 异常情况
      })
    }
  },
  mounted: function () {
    orgId = util.cookies.get("orgId")
    if (orgId == '' || orgId == null || typeof orgId == 'undefined') {
      this.$router.push({
        name: 'login'
      })
      return
    }
    this.getOrgStatistic()
  }
}
</script>
<style scoped>
.card {
  margin-bottom: 30px;
}
.statistic-cover {
  display: flex;
  flex-direction: row;
  width: 90%;
  margin-left: 5%;
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: space-evenly;
  align-items: center;
}
.statistic-item {
  width: 33.33%;
  display: flex;
  flex-direction: column;
}
.item-title {
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.item-val {
  font-size: 44px;
  color: #258cf7;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

