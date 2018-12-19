import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AreaManage from '@/views/area/areamanage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'areamanage',
      component: AreaManage
    },
  ]
})
