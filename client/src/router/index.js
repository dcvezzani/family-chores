import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Secret from '../components/Secret.vue'
import Profile from '../components/Profile.vue'
import { authorize, routes as authRoutes } from '../plugins/auth'
import { handlePromiseError } from '../plugins/errors'
import handlers from './handlers'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/secret',
    name: 'Secret',
    component: Secret,
    meta: { authorizationRequired: true }
  },
  handlers.Profile({
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { authorizationRequired: true }
  }),
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
  routes: [ ...authRoutes, ...routes], // auth
})

// auth
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.authorizationRequired)) {
    const _isAuthorized = await authorize({to})
    .catch(handlePromiseError(`Unable to determine if user is authorized`, false))

    if (_isAuthorized) return next()
  } else {
    next()
  }
})

export default router
