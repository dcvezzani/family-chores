import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Secret from '../components/Secret.vue'
import { logout, login, authorize } from '../services'
import { Cookies } from '../cookies'
import { handlePromiseError } from '../errors'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/token',
    name: 'Token',
    beforeEnter: async (to, from, next) => {
      const pathParts = to.fullPath.split('?')
      const search = (pathParts.length > 1) ? `${pathParts[1]}` : ''
      console.log(">>>search", search)
      
      let url = `${process.env.VUE_APP_API_TOKEN}${search}`
      const state = await fetch(url)
      .then(response => response.json())
      .then(user => {
        login(user)

        // if (window.location.href.includes(`chores.vezzaniphotography.com`)) {
        //   const search = Object.keys(user).reduce((params, attr) => {
        //     const value = user[attr]
        //     params.push(`${attr}=${value}`)
        //     return params
        //   }, [])
        //   window.location = `https://chores-local.vezzaniphotography.com?${search.join("&")}`
        // }
      })
      .catch(err => console.error(`Unable to authorize`, err))

      const redirectPath = localStorage.getItem('redirectPath');
      if (redirectPath) {
        localStorage.removeItem('redirectPath');
        return next(redirectPath)
      }
      
      next('/')
    }
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: async (to, from, next) => {
      await authorize({force: true})
      .catch(handlePromiseError(`Unable to sign in user`, null))
      next('/')
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: async (to, from, next) => {
      logout()
      next('/')
    }
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
