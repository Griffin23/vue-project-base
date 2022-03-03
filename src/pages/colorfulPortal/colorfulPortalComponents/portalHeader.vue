<template>
  <div class="header-container">
    <div class="left-info-container">
      <div v-if="userName">
        姓名：{{ userName }}
      </div>
      <div v-if="orgName">
        部门：{{ orgName }}
      </div>
    </div>
    <div class="title-container">
      北京航空航天大学智慧交通平台
    </div>
    <div class="right-info-container">
      <div>
        {{ timeResult }}
      </div>
      <div>
        <span class="logout" @click="logout">注销</span>
      </div>
    </div>
  </div>
</template>
<script>
const dayjs = require('dayjs')
require('dayjs/locale/zh-cn')

export default {
  name: 'PortalHeader',
  data () {
    return {
      userName: '',
      orgName: '',
      timeFormat: 'YYYY年MM月DD日 dddd'
    }
  },
  computed: {
    timeResult () {
      return dayjs().locale('zh-cn').format(this.timeFormat)
    }
  },
  async mounted () {
    await this.getDataFromApi()
  },
  methods: {
    logout () {
      const partialUrl = `https://${window.location.hostname}`
      window.location.href = `${partialUrl}/portal/cas/ajax/logout.do?service=${partialUrl}`
    },
    async getDataFromApi () {
      let data = 'await api.getUserInfo()'
      // mock
      if (process.env.NODE_ENV === 'development') {
        data = {
          code: '0',
          data: {
            userName: '张三',
            orgName: '文化部'
          }
        }
      }
      if (data.code === '0') {
        this.userName = data.data?.userName
        this.orgName = data.data?.orgName
      } else {
        this.$message.error('获取用户数据失败')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  font-size: 22px;
  color: #ADC2E4;
  letter-spacing: 0;
  line-height: 34px;

  .title-container {
    width: 863px;
    height: 85px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    background-image: url("../colorfulPortalImgs/title-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-size: 40px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 40px;
    text-shadow: 0 2px 3px rgba(0, 0, 0, 0.50);
  }

  .logout {
    color: #00A5E3;
    cursor: pointer;
  }
}
</style>
