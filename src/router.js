import Vue from 'vue'
import Router from 'vue-router'
import dashboard from './views/dashboard.vue'
import createProposal from './views/createProposal.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: dashboard
    },
    {
      path: '/createProposal',
      name: 'createproposal',
      component: createProposal
    }

  ]
})
