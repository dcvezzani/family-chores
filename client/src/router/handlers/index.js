import { getUser } from '../../plugins/auth'
import { handlePromiseError } from '../../plugins/errors'

export default {
  ChoreWorkSheet: (config) => ({
    props: route => ({
      zoneName: route.meta.props.zoneName,
      zone: route.meta.props.zone,
    }),
    beforeEnter: async (to, from, next) => {
      const md = to.params.zone.match(/chore-sheet-([^\.]+).json/)
      // console.log(">>>md", md)
      const zoneName = (md && md[1]) || 'xxx'
      const user = getUser()

      // https://chores-api-local.vezzaniphotography.com/api/chores/templates/vacuum/123
      const url = `${process.env.VUE_APP_API_BASE}/templates/${zoneName}/${user.id}`
      console.log(">>>url", url)
      const zone = await fetch(url)
        .then(response => response.json())
        .then(payload => payload)
        .catch(handlePromiseError(`Unable to fetch templates`, []))
      console.log(">>>props", {props: {zone, zoneName}})

      Object.assign(to.meta, {props: {zone, zoneName}});
      next();
    },
    ...config,
  }),
  ChoreZones: (config) => ({
    props: route => ({
      zones: route.meta.props.zones,
    }),
    beforeEnter: async (to, from, next) => {
      const url = `${process.env.VUE_APP_API_BASE}/templates`
      // console.log(">>>url", url)
      const zones = await fetch(url)
      .then(response => response.json())
      .then(payload => payload.files)
      .catch(handlePromiseError(`Unable to fetch templates`, []))
      // console.log(">>>templates", templates)

      Object.assign(to.meta, {props: {zones}});
      next();
    },
    ...config,
  }),
}
