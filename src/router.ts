import Vue from "vue"
import Router from "vue-router"
import login from "./views/login"
import store from "@/store"

import { ensureMyJobsSynced, updateCurrentJobStore } from '@/helpers/jobs'

import { RouteList } from 'simsalabim-design'
import { RouteConfig } from 'vue-router'

Vue.use(Router)

export const routes: RouteList = [
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: '/make-money',
    alias: '/',
    name: 'makeMoney',
    component: () => import(/* webpackChunkName: "makeMoney" */ './views/makeMoney'),
    meta: {
      iconEmoji: '💸',
      friendlyName: 'Make Money',
      translationKey: 'routes.makeMoney',
      topLevel: true,
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/make-money/current-job',
    name: 'currentJob',
    component: () => import(/* webpackChunkName: "currentJob" */ './views/currentJob'),
    meta: {
      requiresAuth: true,
      layout: 'default',
      hideJobBadge: true,
    }
  },
  {
    path: '/get-things',
    name: 'getThings',
    component: () => import(/* webpackChunkName: "getThings" */ './views/getThings'),
    meta: {
      iconEmoji: '🙏',
      friendlyName: 'Get Things',
      translationKey: 'routes.getThings',
      topLevel: true,
      requiresAuth: true,
      layout: 'default'
    },
  },
  {
    path: '/get-things/new',
    name: 'newJob',
    component: () => import(/* webpackChunkName: "newJob" */ './views/getThings/new'),
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/get-things/:id',
    name: 'jobView',
    component: () => import(/* webpackChunkName: "jobView" */ './views/jobView'),
    meta: {
      requiresAuth: true,
      layout: 'default',
      hideJobBadge: true,
    }
  },
  {
    path: '/you',
    name: 'you',
    component: () => import(/* webpackChunkName: "you" */ './views/you'),
    meta: {
      iconEmoji: '🤠',
      friendlyName: 'You',
      translationKey: 'routes.you',
      topLevel: true,
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/permissions',
    name: 'pems',
    component: () => import(/* webpackChunkName: "permissions" */ './views/permissions'),
    meta: {
      requiresAuth: true,
      layout: 'plain'
    },
  },
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: <RouteConfig[]>routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentPermissions = store.getters['permissions/currentPermissions']
  if (!currentPermissions.checked) await store.dispatch('permissions/updatePermissions')
  const allPermissionsGranted = store.state.permissions.data.allRequiredGranted

  if (!requiresAuth) next()
  else if (
    requiresAuth &&
    store.state.profile.data.loggedIn == false &&
    to.path !== '/login'
    ) next('login')
  else if (
    requiresAuth &&
    !allPermissionsGranted &&
    to.path !== '/permissions'
  ) {
    console.log('forwarding to /permissions')
    await ensureMyJobsSynced()
    await updateCurrentJobStore(store.getters.uid)
    next('/permissions')
  } else {
    await ensureMyJobsSynced()
    await updateCurrentJobStore(store.getters.uid)

    if (!store.getters['permissions/notificationsInitialized']) {
      await store.dispatch('permissions/initializeNotifications')
    }

    next()
  }
})

export default router;
