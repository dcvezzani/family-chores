import Auth from './components/Auth.vue'

const plugin = {
  install (Vue, options) {
    Vue.component(Auth.name, Auth)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
export { Auth }
export * from './cookies';
export * from './services';
export { default as routes } from './router';

