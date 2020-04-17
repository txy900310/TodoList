import Vue from 'vue'
import Router from 'vue-router'
import MainMenu from '@/components/MainMenu'
import Lists from '@/components/Lists'
import SingleList from '@/components/SingleList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: MainMenu
    },
    {
      path: '/lists',
      name: 'Lists',
      component: Lists,
      children: [
        {
          path: ':id',
          name: 'SingleList',
          component: SingleList
        }
      ]
    }
  ]
})
