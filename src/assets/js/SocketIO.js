import {guid, getTheTruth, EventBus, urlJoin} from './tools'

/**
 * 参数创建
 * new SocketIO({
 *   // socket地址，传入这个属性后 ip 和 port 可不传
 *   url?: 'ws:IP:PORT',
 *   // api地址
 *   path: '/xxx'
 *   // 当没有传入url时 需要将ip 和 port 单独传入，实例会进行拼接
 *   ip?: 'xxx.xxx.x.x'
 *   port?: xxxx
 *   // 是否支持https, 默认支持。当设置为false时，仅使用ws协议。设置为true后会自动将协议转为wss 端口转为443
 *   supportHttps?: true
 *   // 重连时间间隔(毫秒)。避免频繁重连
 *   reconnectInterval?: 5000
 *   // 是否开启心跳检测
 *   supportHeartCheck?: false
 *   // 发送心跳检测请求的时间间隔(毫秒)
 *   heartCheckPingInterval?: 300000
 *   // 心跳检测响应超时时间(毫秒)。服务端不在此时间段内响应，则认为连接死了。继而触发重连
 *   heartCheckPongTimeoutInterval?: 10000
 *   // 心跳检测请求发送的内容
 *   heartCheckPingMsg?: 'ping'
 *   // 心跳检测响应返回的内容。若为该内容，不会触发用户注册的onmessage事件。
 *   heartCheckPongMsg?: ''
 * })
 */
export default class SocketIO extends EventBus {
  constructor(options = {}) {
    super()
    const uid = guid()
    this.options = options || {}
    this.options.supportHttps = this.options.supportHttps || true // 是否支持https, 默认支持
    this.options.reconnectInterval = this.options.reconnectInterval || 5000 // 重连间隔-默认值(毫秒)
    if (this.options.supportHeartCheck) {
      this.options.heartCheckPingInterval = this.options.heartCheckPingInterval || 300000 // 发送心跳检测请求的时间间隔-默认值(毫秒)
      this.options.heartCheckPongTimeoutInterval = this.options.heartCheckPongTimeoutInterval || 10000 // 心跳检测响应超时时间-默认值(毫秒)
      this.options.heartCheckPingMsg = this.options.heartCheckPingMsg || 'ping' // 心跳检测请求发送的内容-默认值
    }
    this.socket = null // 存放websocket实例
    this.isClose = true // 启停状态
    this.eventName = `__message_${uid}` // 消息名称
    this.readyName = `__ready_${uid}` // 初始化名称
    this.heartCheckPingTimerId = null // 心跳检测发送请求定时器id
    this.heartCheckPongTimerId = null // 心跳检测接收响应定时器id
    this.lockReconnect = false // 重连 锁 防止重连请求过于频繁
    this.connect()
  }

  get isHttps() {
    if (!this.options.supportHttps) return false
    return location.protocol.startsWith('https')
  }

  get protocol() {
    return this.isHttps ? 'wss://' : 'ws://'
  }

  get port() {
    return this.isHttps ? ':443' : `:${this.options.port}`
  }

  get target() {
    const {path} = this.options
    if (this.options.url) return urlJoin(`${this.options.url}/${path}`)
    return urlJoin(`${this.protocol}${this.options.ip}${this.port}/${path}`)
  }

  connect() {
    if (!this.socket) {
      this.socket = new WebSocket(this.target)
      this.isClose = false
      this.events()
    }
  }

  close() {
    if (this.socket && !this.isClose) {
      this.socket.close()
      this.socket = null
      this.disconnect = true
    }
  }

  heartCheck() {
    clearTimeout(this.heartCheckPingTimerId)
    clearTimeout(this.heartCheckPongTimerId)
    this.heartCheckPingTimerId = setTimeout(() => {
      console.log(`【${this.target}】发送心跳检测请求`)
      this.send(this.options.heartCheckPingMsg)

      // 设置定时器检测响应，若在超时时间内收到响应，会触发onmessage，onmessage会触发heartCheck，会清除该定时器
      // 若未在超时时间内收到响应，触发重连
      this.heartCheckPongTimerId = setTimeout(() => {
        console.log(`【${this.target}】未在限定时间内收到心跳检测响应请求`)
        this.tryReconnect()
      }, this.options.heartCheckPongTimeoutInterval)

    }, this.options.heartCheckPingInterval)
  }

  tryReconnect() {
    this.showMessage = false
    if (this.socket) {
      if (this.lockReconnect) return
      this.lockReconnect = true
      this.socket = null
      // 若没连接上会一直频繁重连，这里设置延迟避免重连请求过多
      setTimeout(() => {
        this.connect()
        this.lockReconnect = false
      }, this.options.reconnectInterval)
    }
  }

  /**
   * 订阅socket消息
   * @param cb
   */
  message(fn) {
    if (fn) {
      this.$on(this.eventName, fn)
    }
  }

  test(data) {
    this.$emit(this.eventName, getTheTruth(data))
  }

  /**
   * 发送消息给服务
   * @param data
   */
  send(data) {
    if (this.socket) {
      this.socket.send(data)
    }
  }

  /**
   * 初始化完成后回调
   * @param cb
   */
  ready(cb) {
    if (cb) {
      this.$on(this.readyName, cb)
    }
  }

  events() {
    const self = this

    const listeners = {
      open() {
        console.log(`【${self.target}】连接正常`)
        self.$emit(self.readyName, self)
        if (self.options.supportHeartCheck) {
          self.heartCheck()
        }
      },

      onerror() {
        console.log(`【${self.target}】连接异常，正在重连`)
        this.isClose = true
        self.tryReconnect()
      },

      close() {
        if (this.disconnect) {
          console.log(`【${self.target}】主动关闭`)
          this.isClose = true
        } else {
          console.log(`【${self.target}】连接关闭，正在重连`)
          this.isClose = true
          self.tryReconnect()
        }
      },

      message({data}) {
        try {
          // 空字符串为无效消息
          if (!data) {
            console.log(`【${self.target}】无效消息: `, data)
            return false
          }
          if (self.options.supportHeartCheck) {
            self.heartCheck()
            // 如果消息是心跳检测响应消息，不进行emit
            if (self.options.heartCheckPongMsg
              && data === self.options.heartCheckPongMsg) {
              console.log(`【${self.target}】收到心跳检测响应消息`)
              return
            }
          }
          // 中文消息一般是后端给的一个链接成功的测试消息，打印即可
          // 这个根据实际场景修改，在本项目中和以往的使用中是这样的
          if (/^[\u4e00-\u9fa5]/.test(data)) return false
          if (!this.showMessage) {
            this.showMessage = true
            console.log(`【${self.target}】收到消息`)
          }
          // 发布消息事件，调用者可以通过message方法订阅
          self.$emit(self.eventName, getTheTruth(data))
        } catch (e) {
          console.error('SocketError: %o', e)
        }
      }
    }
    window.onbeforeunload = function () {
      this.socket && this.socket.close()
    }
    if (this.socket) {
      for (const event in listeners) {
        this.socket.addEventListener(event, listeners[event])
      }
    }
  }
}
