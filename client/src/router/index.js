import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

window.localDevelopment = false
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
      const search = (pathParts.length > 1) ? `?${pathParts[1]}` : ''
      console.log(">>>search", search)
      
      let url = `https://chores.vezzaniphotography.com/api/chores/token${search}`
      const state = await fetch(url)
      .then(response => response.json())
      .then(user => {
        console.log(">>>user", user)

        if (window.localDevelopment === true && window.location.href.includes(`chores.vezzaniphotography.com`)) {
          const search = Object.keys(user).reduce((params, attr) => {
            const value = user[attr]
            params.push(`${attr}=${value}`)
            return params
          }, [])
          window.location = `https://chores-local.vezzaniphotography.com?${search.join("&")}`
        }
      })
      .catch(err => console.error(`Unable to authorize`, err))

      next('/')
    }
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: async (to, from, next) => {
      window.location = `https://www.facebook.com/v9.0/dialog/oauth?client_id=107962317902323&redirect_uri=https://chores.vezzaniphotography.com/token&state=xxt&scope=email`
      next('/')
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
