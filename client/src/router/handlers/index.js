import { getUser } from '../../plugins/auth'
import { handlePromiseError } from '../../plugins/errors'

export default {
  Profile: (config) => ({
    props: route => ({
      profile: route.meta.props.userProfile,
    }),
    beforeEnter: async (to, from, next) => {
      const user = getUser()
      console.log(">>>user", user)
      
      const url = `${process.env.VUE_APP_API_BASE}/auth/profile/${user.id}`
      console.log(">>>url", url)
      const userProfile = await fetch(url)
        .then(response => response.json())
        .then(payload => payload)
        .catch(handlePromiseError(`Unable to fetch user profile`))
      console.log(">>>props", {props: {userProfile}})

      Object.assign(to.meta, {props: {userProfile}});
      next();
    },
    ...config,
  }),
}
