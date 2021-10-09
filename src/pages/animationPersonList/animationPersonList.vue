<template>
  <div class="page-container">
    <div class="title-container">
      <h1 class="title">入场人员列表</h1>
    </div>
    <div class="content-container">
      <transition-group tag="p" name="transition-list" ref="transition-group">
        <div style="width: 33%; display: inline-block;" v-for="item in personInfoListToShow" :key="`${item.personName}${item.eventTime}`"
                class="item-container-outer transition-list-item">
          <div class="item-container item-container-font-size">
            <div class="photo-container">
              <img :src="item.identityCardUri" alt="">
              <img :src="item.picUri" alt="">
            </div>
            <div class="name-container">
              {{ item.personName }}
            </div>
            <div class="info-container">
              <div class="entry-time-container">
            <span class="entry-time-title-container">
              <span class="title-alarm-icon"></span>
              <span class="entry-time-title">
                进入时间
              </span>
            </span>
                <span class="entry-time-info">
              {{ item.eventTime }}
            </span>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <!-- 遮罩层 -->
    <div class="mask" v-if="isShowNewItem" ref="mask">
      <div class="item-container" ref="mask-item-container">
        <div class="photo-container">
          <img :src="newItem.identityCardUri" alt="">
          <img :src="newItem.picUri" alt="">
        </div>
        <div class="name-container">
          {{ newItem.personName }}
        </div>
        <div class="info-container">
          <div class="entry-time-container">
            <span class="entry-time-title-container">
              <span class="title-alarm-icon"></span>
              <span class="entry-time-title">
                进入时间
              </span>
            </span>
            <span class="entry-time-info">
              {{ newItem.eventTime }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'personListAnimation',
  data () {
    return {
      isShowAnimation: true, // 是否动效展示新入场记录
      personInfoList: [],
      lastPollingQueryTime: '', // 上一次查询的时间
      isHandlingQueue: false, // 是否正在处理
      newEntryInfoQueue: [], // 新入场记录队列：时间升序
      isShowNewItem: false,
      newItem: {},
      mockDataIndex: 0,
      // region option
      maxShowCount: 15, // 最大展示数量
      pollingIntervalMs: 2000, // 轮询接口时间间隔
      showNewItemAnimationDurationMs: 1000, // 新记录弹窗出现的动画时间 注：css中有耦合值，修改请注意
      newItemDialogStopDurationMs: 1000, // 弹窗停留时间
      hideNewItemAnimationDurationMs: 1500 // 弹窗隐藏动画时间
      // endregion
    }
  },
  mounted () {
    this.getInitialList()
  },
  computed: {
    personInfoListToShow () {
      return this.personInfoList.slice(0, this.maxShowCount)
    }
  },
  methods: {
    getInitialList () {
      const result = this.mockGetPersonInfoListFromAPI({})
      this.personInfoList = this._get(result, 'data', [])
      this.pollingQueryNew()
    },
    mockGetPersonInfoListFromAPI ({ startTime }) {
      let recordCount = startTime ? 10 : 21

      const personName = '李书香'
      const tempRecord = {
        eventTime: '2020-01-01 12:12:12',
        identityCardUri: 'https://img.xiaoba365.com/uploads/allimg/20201219/ggbkxs4blhp.jpg',
        picUri: 'http://img.72qq.com/file/202102/22/a99922af3c.jpg',
        eventTimeUTC: 'eventTimeUTC'
      }
      const arr = []
      for (let i = 0; i < recordCount; i++) {
        tempRecord.personName = personName + this.mockDataIndex++
        arr.push(JSON.parse(JSON.stringify(tempRecord)))
      }
      return {
        code: '0',
        msg: 'SUCCESS',
        data: arr.reverse()
      }
    },
    // 轮询查询门禁新进入记录
    pollingQueryNew () {
      setTimeout(() => {
        const result = this.mockGetPersonInfoListFromAPI({
          startTime: this.lastPollingQueryTime
        })
        this.lastPollingQueryTime = this._get(result, 'data[0].eventTimeUTC', this.lastPollingQueryTime)
        this.newEntryInfoQueue = this.newEntryInfoQueue.concat(this._get(result, 'data', []).reverse())
        if (!this.isHandlingQueue) {
          this.handleNewEntryInfoQueue()
        }
        this.pollingQueryNew()
      }, this.pollingIntervalMs)
    },
    // 处理门禁新进入记录
    handleNewEntryInfoQueue () {
      if (!this.isShowAnimation) {
        // 不展示动画的情况，直接把请求到的数据赋给列表
        this.addToList(this.newEntryInfoQueue.reverse())
        this.newEntryInfoQueue = []
        this.isHandlingQueue = false
      } else {
        // 展示动画的情况
        if (this.newEntryInfoQueue.length === 0) {
          this.isHandlingQueue = false
          return
        }
        this.isHandlingQueue = true
        // 每次处理一条数据
        this.newItem = this.newEntryInfoQueue.shift()
        this.showNewItem()
        setTimeout(() => {
          this.handleNewEntryInfoQueue()
        }, this.showNewItemAnimationDurationMs + this.newItemDialogStopDurationMs + this.hideNewItemAnimationDurationMs + 1000)
      }
    },
    showNewItem () {
      this.isShowNewItem = true
      this.hideNewItemTimeoutId = setTimeout(() => {
        this.hideNewItem()
      }, this.showNewItemAnimationDurationMs + this.newItemDialogStopDurationMs)
    },
    hideNewItem () {
      this.genHideItemAnimation(this.hideNewItemAnimationDurationMs)
      this.addNewItemToListTimeoutId = setTimeout(() => {
        this.isShowNewItem = false
        this.addToList(this.newItem)
      }, this.hideNewItemAnimationDurationMs)
    },
    // 生成隐藏动画
    genHideItemAnimation (animationTimeMs) {
      // 弹窗 DOM
      const dialogDom = this.$refs['mask-item-container']
      const dialogDomRect = dialogDom.getBoundingClientRect()
      // 第一项 DOM
      const firstItemDom = this.$refs['transition-group'].$el.querySelector('.item-container')
      const firstItemDomRect = firstItemDom.getBoundingClientRect()
      // 隐藏动画 css className
      const hideItemCssClassName = 'go-hide'
      // 计算隐藏动画 css keyframe
      const currHtmlFontSize = Number.parseFloat(document.documentElement.style.fontSize)
      const baseFontSize = 100 // 基准font size
      const cssSizeChangeKeyFrame = `
        @keyframes hide-new-item-size-change {
          from {
            font-size: ${44.5 / baseFontSize}rem;
          }
          to {
            font-size: ${17.8 / baseFontSize}rem;
          }
        }
      `
      const cssPositionChangeKeyFrame = `
        @keyframes hide-new-item-position-change {
          from {
            position: absolute;
            left: ${dialogDomRect.left / currHtmlFontSize}rem;
            top: ${dialogDomRect.top / currHtmlFontSize}rem;
          }
          to {
            position: absolute;
            left: ${firstItemDomRect.left / currHtmlFontSize}rem;
            top: ${firstItemDomRect.top / currHtmlFontSize}rem;
          }
        }
      `
      // 使用key frame
      const cssSizeChangeRule = `
        .page-container .mask.${hideItemCssClassName} {
          animation: hide-new-item-size-change ${animationTimeMs}ms;
          font-size: ${17.8 / baseFontSize}rem;
        }
      `
      const cssPositionChangeRule = `
        .page-container .mask.${hideItemCssClassName} .item-container {
          animation: hide-new-item-position-change ${animationTimeMs}ms;
          position: absolute;
          left: ${firstItemDomRect.left / currHtmlFontSize}rem;
          top: ${firstItemDomRect.top / currHtmlFontSize}rem;
        }
      `
      // 插入style标签
      let styleDom = document.getElementById('style-hide-item-animation')
      if (!styleDom) {
        styleDom = document.createElement('style')
        styleDom.id = 'style-hide-item-animation'
        document.getElementsByTagName('head')[0].appendChild(styleDom)
      }
      // 指定style标签对应的css rule
      const targetSheet = [].find.call(document.styleSheets, (item) => item.ownerNode === styleDom)
      const ruleLen = targetSheet.rules.length
      for (let i = ruleLen - 1; i >= 0; i--) {
        targetSheet.deleteRule(i)
      }
      targetSheet.insertRule(cssSizeChangeKeyFrame, targetSheet.rules.length)
      targetSheet.insertRule(cssPositionChangeKeyFrame, targetSheet.rules.length)
      targetSheet.insertRule(cssSizeChangeRule, targetSheet.rules.length)
      targetSheet.insertRule(cssPositionChangeRule, targetSheet.rules.length)

      // 指定css className
      this.$refs.mask.className += ` ${hideItemCssClassName}`
    },
    addToList (item) {
      if (Array.isArray(item)) {
        this.personInfoList = item.concat(this.personInfoList)
      } else {
        this.personInfoList = [item].concat(this.personInfoList)
      }
    }
  }
}
</script>
<style>
.h-page {
  height: auto;
}
</style>
<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  //background-image: url("../../assets/images/personListAnimation/page-bg.png");
  background-size: 100% 100vh;

  .title-container {
    width: 100%;
    height: 133.33px;
    display: flex;
    align-items: center;
    justify-content: center;
    //background-image: url("../../assets/images/personListAnimation/title-bg.png");
    background-size: 100% 100%;

    .title {
      font-size: 51.26px;
      color: #FFFFFF;
      letter-spacing: 2.85px;
      text-align: center;
      text-shadow: 0 0 10.7px rgba(0, 0, 0, 0.50);
    }
  }

  .item-container-outer {
    margin-top: 89px;
    display: flex;
    justify-content: center;

    .item-container-font-size {
      font-size: 17.8px;
    }

  }

  .item-container {
    width: 32em;
    padding: 3em;
    //background-image: url("../../assets/images/personListAnimation/card-bg.png");
    background-size: 100% 100%;

    .photo-container {
      display: flex;
      justify-content: space-between;

      img {
        width: 12em;
        height: 12em;
      }
    }

    .name-container {
      //margin-top: 15px;
      margin-top: 0.625em;
      font-size: 2.4em;
      color: #2FD4FF;
      letter-spacing: 0;
      //line-height: 24px;
      line-height: 1em;
    }

    .info-container {
      margin-top: 1.5em;

      .entry-time-container {
        font-size: 1.6em;
        letter-spacing: 0;

        .entry-time-title-container {
          display: inline-flex;
          align-items: center;
          color: #CBEAFF;

          .title-alarm-icon {
            width: 1em;
            height: 1em;
            //background-image: url("../../assets/images/personListAnimation/alarm.png");
            background-size: 100% 100%;
          }

          .entry-time-title {
            margin-left: 0.5em;
          }
        }

        .entry-time-info {
          float: right;
          color: #2CE1FF;
        }
      }
    }
  }

  .mask {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    @keyframes show-new-item {
      from {
        font-size: 17.8px;
      }
      to {
        font-size: 44.5px;
      }
    }
    animation: show-new-item 1000ms;
    font-size: 44.5px;
  }
}

.transition-list-item {
  transition: all .8s ease;
}
</style>
