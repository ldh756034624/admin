import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 20 * 1000,                  // 请求超时时间
  validateStatus: (status => {
    return status < 500
  })
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非0是抛错 可结合自己业务进行修改
     */
    if (response.status === 200) {   // 状态为200 并且code = 0的时候为请求成功
      const res = response.data
      if (res.code === 401 || res.code === 402) {  // 402:其他客户端登录了  401:Token 过期了
        MessageBox.confirm('登陆失效，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
        return response
      } else if (res.code === 0) {    // 如果正常，返回
        return res
      } else {  // 其他都有异常
        Message.error(res.msg)
        return res
      }
    }
    else if (response.status === 422) {  // 状态为422为校验没有通过
      const resObjs = response.data
      for (const obj in resObjs) {
        const name = response.data[obj][0]
        Message({
          message: name,
          type: 'error',
          duration: 10 * 1000
        })
      }

      return Promise.reject('error')
    } else {
      return Promise.reject('error')
    }
  },
  error => {
    console.log(error)// for debug
    Message({
      message: error.message || error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
