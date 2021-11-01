import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 白名单
const whiteList = ['/login', '/404']

// 前置路由守卫
router.beforeEach(async function(to, from, next) {
  // 获取token
  const token = store.getters.token
  NProgress.start() // 开启进度条
  if (token) {
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 关闭进度条
})

// 后置路由守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
