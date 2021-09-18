export default {
  data () {
    return {
      wsMixin: {
        websocket: null,
        wsOptions: {
          wsUrl: '',
          onMessageHandler: () => {},
          heartCheckPingMsg: ''
        },
        heartCheckOptions: {
          startSendPingTimeoutMs: 300000, // 发送心跳请求的时间间隔
          serverPongTimeoutMs: 10000, // 服务端不在此时间内响应，则认为死了
          sendPingTimeoutId: null, // 发送心跳请求，timeout id
          serverPongTimeoutId: null // 服务端响应请求，timeout id
        },
        lockReconnect: false, // 避免重复连接
        lockReconnectTimeoutId: null,
        reconnectTimeoutMs: 4000
      }
    }
  },
  beforeDestroy () {
    this.websocket.close()
  },
  methods: {
    createWebsocket ({ wsUrl, onMessageHandler, heartCheckPingMsg }) {
      try {
        this._logWhenDev('create ws')
        // 初始化 ws option
        wsUrl && (this.wsMixin.wsOptions.wsUrl = wsUrl)
        typeof onMessageHandler === 'function' && (this.wsMixin.wsOptions.onMessageHandler = onMessageHandler)
        heartCheckPingMsg && (this.wsMixin.wsOptions.heartCheckPingMsg = heartCheckPingMsg)
        this.wsMixin.websocket = new WebSocket(this.wsMixin.wsOptions.wsUrl)
        // 设置ws监听回调
        this._initWebsocketListeners()
      } catch (e) {
        console.error('create ws error: ', e)
        this._reconnectWebsocket()
      }
    },
    _reconnectWebsocket () {
      if (this.wsMixin.lockReconnect) return
      this.wsMixin.lockReconnect = true
      clearTimeout(this.wsMixin.lockReconnectTimeoutId)
      // 没连接上会一直重连，设置延迟避免请求过多
      this.wsMixin.lockReconnectTimeoutId = setTimeout(() => {
        this._logWhenDev('reconnect ws')
        this.createWebsocket()
        this.wsMixin.lockReconnect = false
      }, this.wsMixin.reconnectTimeoutMs)
    },
    _initWebsocketListeners () {
      this.wsMixin.websocket.onclose = () => {
        this._logWhenDev('ws onclose')
      }
      this.wsMixin.websocket.onerror = () => {
        this._logWhenDev('ws onerror')
        this._reconnectWebsocket()
      }
      this.wsMixin.websocket.onopen = () => {
        this._logWhenDev('ws onopen')
        this._startHeartCheck()
      }
      this.wsMixin.websocket.onmessage = (event) => {
        this._logWhenDev('ws onmessage')
        this._logWhenDev(event.data)
        !this._isHeartCheckResponse(event) && this.wsMixin.wsOptions.onMessageHandler(event)
        this._startHeartCheck()
      }
    },
    // region 心跳检测
    _startHeartCheck () {
      this._logWhenDev('start heart check')
      const heartCheckPingMsg = this.wsMixin.wsOptions.heartCheckPingMsg || 'ping'
      const {
        startSendPingTimeoutMs,
        serverPongTimeoutMs
      } = this.wsMixin.heartCheckOptions

      clearTimeout(this.wsMixin.heartCheckOptions.sendPingTimeoutId)
      clearTimeout(this.wsMixin.heartCheckOptions.serverPongTimeoutId )
      this.wsMixin.heartCheckOptions.sendPingTimeoutId = setTimeout(() => {
        this._logWhenDev('ws send ping')
        this.wsMixin.websocket.send(heartCheckPingMsg)
        this.wsMixin.heartCheckOptions.serverPongTimeoutId = setTimeout(() => {
          this._logWhenDev('ws no pong received')
          // 服务端若在超时时间内响应了，会触发onmessage，进而触发心跳检测，会清除该定时器
          // 若未响应，触发reconnect
          this._reconnectWebsocket()
        }, serverPongTimeoutMs)
      }, startSendPingTimeoutMs)
    },
    _isHeartCheckResponse (event) {
      return event.data === 'pong'
    },
    // endregion
    _logWhenDev (msg) {
      process.env.NODE_ENV === 'development' && console.log(`********** ${msg} **********`)
    }
  }
}
