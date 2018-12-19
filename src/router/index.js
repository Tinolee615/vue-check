import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AreaManage from '@/views/area/areamanage.vue'
import specification from '@/views/area/specification.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'areamanage',
      component: AreaManage
    },
    {
      path: '/goods',
      name: 'specification',
      component: specification
    },
  ]
})
