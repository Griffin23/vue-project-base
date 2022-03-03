/***
 * 使用方法：<组件 :style="scaleStyle" />
 *
 * 主要用于：单页可视化屏自适应
 */
export default {
  data () {
    return {
      screenScaleMixin: {
        scaleX: 1,
        scaleY: 1,
        uiFileWidth: 1920,
        uiFileHeight: 1080
      }
    }
  },
  computed: {
    scaleStyle () {
      return {
        transform: `scale(${this.screenScaleMixin.scaleX}, ${this.screenScaleMixin.scaleY})`
      }
    }
  },
  mounted () {
    this.initScaleEvent()
  },
  beforeDestroy () {
    this._removeScaleEvent()
  },
  methods: {
    initScaleEvent () {
      this._scale()
      window.addEventListener('resize', this._scale)
    },
    _removeScaleEvent () {
      window.removeEventListener('resize', this._scale)
    },
    _scale () {
      this.screenScaleMixin.scaleX = window.innerWidth / this.screenScaleMixin.uiFileWidth
      this.screenScaleMixin.scaleY = document.body.clientHeight / this.screenScaleMixin.uiFileHeight
    }
  }
}
