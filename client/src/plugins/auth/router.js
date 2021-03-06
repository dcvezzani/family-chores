import { logout, login, authorize } from './index'
import { handlePromiseError } from '../errors'

export default [
  {
    path: '/token',
    name: 'Token',
    beforeEnter: async (to, from, next) => {
      const pathParts = to.fullPath.split('?')
      const search = (pathParts.length > 1) ? `${pathParts[1]}` : ''
      console.log(">>>search", search)
      
      let url = `${process.env.VUE_APP_API_TOKEN}${search}`
      console.log(">>>/token, url", url)
      const state = await fetch(url)
      .then(response => response.json())
      .then(user => {
        login(user)
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
      // await authorize({force: true})
      await authorize()
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
]


