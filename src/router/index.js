import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser,
} from '@/auth/utils'

import masterdata from './routes/masterdata'
// import { canNavigate } from '@/libs/acl/routeProtection'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/account-setting/AccountSetting.vue'),
      meta: {
        pageTitle: 'Account Setting',
        breadcrumb: [
          {
            text: 'Account Setting',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
      },
    },
    ...masterdata,
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()
  let userData = null
  if (isLoggedIn) {
    userData = getUserData()
    store.dispatch('auth/setUser', userData)
    store.dispatch('masterdata/loadRoles')
  } else if (to.name !== 'login') {
    next({ name: 'login' })
  }

  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    return next(
      getHomeRouteForLoggedInUser(userData ? userData.role.name : null)
    )
  }

  // if (!canNavigate(to)) {
  //   // Redirect to login if not logged in

  //   // If logged in => not authorized
  //   return next({ name: 'misc-not-authorized' })
  // }
  // Redirect if logged in

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
