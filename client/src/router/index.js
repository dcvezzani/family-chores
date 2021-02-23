import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Secret from '../components/Secret.vue'
import { authorize } from '../services'
import authRoutes from './auth'
import { handlePromiseError } from '../errors'

Vue.use(VueRouter)

const routes = [
  ...authRoutes,
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/secret',
    name: 'Secret',
    component: Secret,
    beforeEnter: async (to, from, next) => {
      const _isAuthorized = await authorize({to})
      .catch(handlePromiseError(`Unable to determine if user is authorized`, false))

      if (_isAuthorized) return next()
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
