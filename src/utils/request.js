import axios from 'axios'
import { Message } from 'element-ui'
import state from '../store'
import router from '@/router'
import { getTimeStamp } from './auth'
import store from '../store'
const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  // 给每个请求都添加 token
  (config) => {
    if (store.getters.token) {
      if (IsCheckTimeOut()) {
        // 如果它为true表示过期了
        // token没用了 因为超时了
        store.dispatch('user/logout') // 登出操作
        // 跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
    }
    const token = state.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // axios默认加了一层data
    // console.log(response)
    const { success, message, data } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data
    } else {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  (err) => {
    // 通过状态码是否为401判断token过期
    if (err?.response?.status === 401) {
      // token失效
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('token过期，请重新登录') // 提示错误信息
      return Promise.reject(err)
    }
    Message.error(err.message) // 提示错误信息
    return Promise.reject(err) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
)

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  // console.log((currentTime - timeStamp) / 1000 > TimeOut)
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
