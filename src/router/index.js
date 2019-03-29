import Vue from 'vue'
import Router from 'vue-router'
import Component from 'vue-class-component'

import container from '../di'
import { USER_DETAILS_SERVICE } from '../services/api/userDetails'

let AdminView = () => import('../views/admin')
let HomeView = () => import('../views/home')
let MyRewardsView = () => import('../views/my-rewards')
let MyTeamsView = () => import('../views/my-teams')
let TeamDataView = () => import('../views/team-data')

export function createRouter (vueInstance = Vue) {
  Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate'
  ])

  vueInstance.use(Router)

  let routes = [
    {
      path: '/:pid',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
        title: 'Home'
      }
    },
    {
      path: '/:pid/my-rewards',
      name: 'rewards',
      component: MyRewardsView,
      meta: {
        requiresAuth: true,
        pageCategory: 'rewards',
        title: 'Home'
      }
    },
    {
      path: '/:pid/redeem-rewards',
      name: 'redeem',
      component: HomeView,
      meta: {
        requiresAuth: true,
        pageCategory: 'rewards',
        title: 'Home'
      }
    },
    {
      path: '/:pid/my-teams',
      name: 'teams',
      component: MyTeamsView,
      meta: {
        requiresAuth: true,
        pageCategory: 'teams',
        title: 'Home'
      }
    },
    {
      path: '/:pid/team/:teamId',
      name: 'teamDetails',
      component: TeamDataView,
      meta: {
        requiresAuth: true,
        pageCategory: 'teams',
        title: 'Home'
      }
    },
    {
      path: '/:pid/configure-rewards',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true,
        pageCategory: 'admin',
        title: 'Home'
      }
    },
    {
      path: '*',
      redirect: '/1234'
    }
  ]

  let router = new Router({
    mode: 'history',
    routes
  })

  router.beforeEach(async function (to, from, next) {
    if (to.meta.requiresAuth) {
      let userDetailsService = container.get(USER_DETAILS_SERVICE)
      let isUserAuthorized = await userDetailsService.isUserAuthorized(to.meta.pageCategory)
      console.log(isUserAuthorized)
      isUserAuthorized ? next() : next({ name: 'home', params: { pid: from.params.pid } })
    } else {
      next()
    }
  })

  return router
}
