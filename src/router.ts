import Vue from "vue"
import Router from "vue-router"
import login from "./views/login"
import store from "@/store"

import { RouteList } from 'simsalabim-design'
import { RouteConfig } from 'vue-router'

Vue.use(Router);

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
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: <RouteConfig[]>routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (!requiresAuth) next()
  else if (
    requiresAuth &&
    store.state.profile.data.loggedIn == false
    ) next("login")
  else next()
});

export default router;
