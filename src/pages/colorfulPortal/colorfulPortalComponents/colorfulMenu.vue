<template>
  <div class="colorful-menu-container-outer">
    <div class="colorful-menu-container">
      <div
        v-for="(menuData, index) in menuDataArr"
        :key="`container-${menuData.name}`"
        class="colorful-menu-item-container"
        :style="menuItemContainerStyle"
        @click="handleClick(index)"
      >
        <div :style="getLevel1MenuItemStyle(index, menuDataArr.length)" class="menu-item">
          <div class="menu-item-title">
            {{ menuData.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div v-if="isShowChildMenu" class="mask" @click="handleMaskClick($event)">
      <div class="child-menu-list-title">{{ currChildMenuListTitle }}</div>
      <!-- 二级菜单 -->
      <div ref="childMenuContainer" class="child-menu-container">
        <el-row>
          <el-col
            v-for="menuData in currChildMenuArr"
            :key="`child-container-${menuData.name}`"
            :span="'4-8'"
            class="child-menu-item-container"
            @click.native="handleChildMenuClick(menuData)"
          >
            <div>
              <img
                :src="menuData.icon || defaultChildMenuIcon"
                class="child-menu-item-icon"
              >
            </div>
            <div class="child-menu-item-title">
              {{ menuData.name }}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
// region 图片资源
import level1ItemDefaultBg from '../colorfulPortalImgs/level1-item-bg.png'
import level1ItemDefaultBg1 from '../colorfulPortalImgs/level1-item-bg1.png'
import level1ItemDefaultBg2 from '../colorfulPortalImgs/level1-item-bg2.png'
import level1ItemDefaultBg3 from '../colorfulPortalImgs/level1-item-bg3.png'
import level1ItemDefaultBg4 from '../colorfulPortalImgs/level1-item-bg4.png'
import level1ItemDefaultBg5 from '../colorfulPortalImgs/level1-item-bg5.png'
import defaultChildMenuIcon from '../colorfulPortalImgs/child-menu-icon-default.png'
// endregion

import customizeMenuItemMargin from '../colorfulPortalJs/customizeMenuItemMargin.js'

export default {
  name: 'ColorfulMenuPortalPage',
  data () {
    return {
      menuDataArr: [
        // {
        //   name: '',
        //   introduction: '',
        //   icon: '',
        //   url: '',
        //   children: []
        // }
      ],
      isShowChildMenu: false,
      currChildMenuArr: [],
      currChildMenuListTitle: '',
      // 一级菜单图表默认背景图
      itemBgArr: [
        level1ItemDefaultBg,
        level1ItemDefaultBg1,
        level1ItemDefaultBg2,
        level1ItemDefaultBg3,
        level1ItemDefaultBg4,
        level1ItemDefaultBg5
      ],
      OPEN_TYPE_ENUM: {
        THIS_WINDOW: 1,
        NEW_WINDOW: 2
      },
      // 一级菜单项margin值配置，为了实现更好的视觉效果
      customizeMenuItemMargin,
      defaultChildMenuIcon
    }
  },
  computed: {
    menuItemContainerStyle () {
      let width
      if (this.menuDataArr && this.menuDataArr.length !== 0) {
        width = `${1 / this.menuDataArr.length * 100}%`
      }
      return {
        width
      }
    }
  },
  async mounted () {
    await this.getMenuDataFromApi()
  },
  methods: {
    async getMenuDataFromApi () {
      const useMock = true || process.env.NODE_ENV === 'development'
      if (useMock) {
        const cdiPlatformHomePageUrl = `https://${window.location.hostname}/portal/home/appCenter`
        this.menuDataArr = [
          {
            name: '办案平台',
            introduction: '描述',
            icon: require('../colorfulPortalImgs/level1-item-bg.png'),
            url: '',
            children: [
              {
                name: '内网办案',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/内网办案.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '谈话讯问',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/谈话讯问.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl,
                children: [
                  {
                    name: '三级菜单1-1',
                    introduction: '描述',
                    icon: '',
                    url: ''
                  },
                  {
                    name: '三级菜单1-2',
                    introduction: '描述',
                    icon: '',
                    url: ''
                  },
                  {
                    name: '三级菜单1-3',
                    introduction: '描述',
                    icon: '',
                    url: ''
                  }
                ]
              },
              {
                name: '指挥研判',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/指挥研判.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '系统会商',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/系统会商.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '电子数据',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/电子数据.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '同步刻录',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/同步刻录.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '办案日志',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/办案日志.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              }
            ]
          },
          {
            name: '看护平台',
            introduction: '描述',
            icon: require('../colorfulPortalImgs/level1-item-bg1.png'),
            url: '',
            children: [
              {
                name: '环境监测',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/环境监测.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '留置人员管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/留置人员管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '健康管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/健康管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '饮食管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/饮食管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '行为分析',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/行为分析.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '人员定位',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/人员定位.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '录音录像',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/录音录像.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '异常告警',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/异常告警.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '看护日志',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/看护日志.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              }
            ]
          },
          {
            name: '监管平台',
            introduction: '描述',
            icon: require('../colorfulPortalImgs/level1-item-bg2.png'),
            url: '',
            children: [
              {
                name: '案管监控',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/案管监控.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '安全员监控',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/安全员监控.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '设备监控',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/设备监控.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '武警监控',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/武警监控.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '安防监控',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/安防监控.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              }
            ]
          },
          {
            name: '服务平台',
            introduction: '描述',
            icon: require('../colorfulPortalImgs/level1-item-bg3.png'),
            url: '',
            children: [
              {
                name: '登记管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/登记管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '餐饮管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/餐饮管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '住宿管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/住宿管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '车辆管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/车辆管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '物品管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/物品管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '物业管理',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/物业管理.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              },
              {
                name: '基地安防',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/基地安防.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              }
            ]
          },
          {
            name: '研判平台',
            introduction: '描述',
            icon: require('../colorfulPortalImgs/level1-item-bg4.png'),
            url: '',
            children: [
              {
                name: '可视化',
                introduction: '描述',
                icon: require('../colorfulPortalImgs/可视化.png'),
                openType: this.OPEN_TYPE_ENUM.NEW_WINDOW,
                url: cdiPlatformHomePageUrl
              }
            ]
          }
        ]
        return
      }
      console.log('调菜单接口 ... ')
    },

    // region 一级菜单
    /***
     * 点击一级菜单图标
     */
    handleClick (itemIndex) {
      const linkUrl = this.menuDataArr[itemIndex].url
      if (linkUrl) {
        this.linkTo(linkUrl)
      } else {
        const title = this.menuDataArr[itemIndex].name
        this.showChildMenuItems({
          itemIndex,
          title
        })
      }
    },
    /***
     * 一级菜单项style
     */
    getLevel1MenuItemStyle (itemIndex, totalLen) {
      return Object.assign(
        {
          width: `${totalLen <= 5 ? 16 * totalLen : '80'}%`,
          height: '100%',
          backgroundImage: `url(${this.menuDataArr[itemIndex].icon || this.itemBgArr[itemIndex] || this.itemBgArr[0]})`,
          backgroundSize: '100% 100%'
        },
        this.genMenuItemTransformStyle(itemIndex),
        this.genMenuItemMarginStyle(itemIndex)
      )
    },
    /***
     * 根据index自动生成css transform属性值，实现透视 + 旋转效果
     * @param itemIndex
     */
    genMenuItemTransformStyle (itemIndex) {
      // 数组长度
      const len = this.menuDataArr.length
      // 基准
      const pivotIndex = (len - 1) / 2
      const diff = itemIndex - pivotIndex
      return {
        transform: `rotateY(${diff * -5}deg) translateZ(${Math.pow(Math.abs(diff), 2) * 5}px)`
      }
    },
    /***
     * 根据index自动生成css margin
     * @param itemIndex
     */
    genMenuItemMarginStyle (itemIndex) {
      return this.customizeMenuItemMargin[this.menuDataArr.length] &&
        this.customizeMenuItemMargin[this.menuDataArr.length][itemIndex]
    },
    // endregion

    // region 二级菜单
    /***
     * 显示二级菜单弹窗
     */
    showChildMenuItems ({
      itemIndex,
      title
    }) {
      this.currChildMenuArr = this.menuDataArr[itemIndex].children
      this.currChildMenuListTitle = title
      this.isShowChildMenu = true
    },
    /***
     * 隐藏二级菜单弹窗
     */
    hideChildMenuItems () {
      this.isShowChildMenu = false
    },
    /***
     * 遮罩层点击事件
     */
    handleMaskClick (event) {
      if (!this.$refs.childMenuContainer.contains(event.target)) {
        this.hideChildMenuItems()
      }
    },
    /***
     * 二级菜单图标点击事件
     * @param childMenuData
     */
    handleChildMenuClick (childMenuData) {
      this.linkTo(childMenuData)
    },
    // endregion

    linkTo ({
      url,
      openType = this.OPEN_TYPE_ENUM.THIS_WINDOW
    }) {
      if (openType === this.OPEN_TYPE_ENUM.NEW_WINDOW) {
        window.open(url)
      } else {
        window.location.href = url
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.colorful-menu-container-outer {
  height: 380px;
  width: 1653px;
  box-sizing: border-box;

  .colorful-menu-container {
    height: 100%;

    .colorful-menu-item-container {
      display: inline-flex;
      justify-content: center;
      height: 100%;
      perspective: 200px;
      cursor: pointer;

      &:hover {
        opacity: 0.9;
      }

      .menu-item {
        display: flex;
        justify-content: center;

        .menu-item-title {
          position: absolute;
          color: white;
          font-size: 34px;
          top: 58%;
        }
      }
    }
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  //width: 100vw;
  //height: 100vh;
  width: 100%;
  height: 100%;
  /* 默认情况下的样式，如：不支持 backdrop-filter 甚至不支持 @supports 的情况下 应用此效果 */
  background-color: rgba(0, 0, 0, 0.7);
  @supports (-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px)) {
    background-color: transparent;
    /* firefox ie chrome<76版本 不支持 */
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  .child-menu-list-title {
    margin-top: 170px;
    font-size: 40px;
    color: #B8E1FC;
    letter-spacing: 0;
    text-align: center;
    line-height: 32px;
  }

  .child-menu-container {
    margin: 0 auto;
    color: red;
    overflow-y: scroll;
    margin-top: 40px;
    width: 1382px;
    height: 560px;
    background-image: url("../colorfulPortalImgs/child-menu-bg-default.png");
    background-size: 100% 100%;

    // region 二级菜单滚动条
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px
    }

    &::-webkit-scrollbar-thumb {
      background: #6445B9;
      border-radius: 16px;
      box-shadow: inset 2px 2px 2px hsla(0, 0%, 100%, .25), inset -2px -2px 2px rgba(0, 0, 0, .25)
    }

    &::-webkit-scrollbar-track {
      //background: linear-gradient(90deg,#434343,#434343 1px,#111 0,#111)
    }

    // endregion

    .child-menu-item-container {
      margin-top: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      &:hover {
        opacity: 0.9;
      }

      .child-menu-item-title {
        margin-top: 21px;
        font-size: 34px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        line-height: 32px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.30);
      }

      .child-menu-item-icon {
        width: 120px;
        height: 120px;
      }
    }
  }
}

.el-col-4-8 {
  width: 20%;
  box-sizing: border-box;
  float: left;
}
</style>
