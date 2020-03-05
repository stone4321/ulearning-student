import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '主页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Personal',
        component: () => import('@/views/personal/index'),
        meta: { title: '个人信息' }
      }
    ]
  },
  {
    path: '/select-course',
    component: Layout,
    redirect: '/select-course/index',
    children: [
      {
        path: 'index',
        name: 'select-course',
        component: () => import('@/views/selectCourse/index'),
        meta: { title: '学生选课', icon: 'yonghu' }
      }
    ]
  },
  {
    path: '/file-manage',
    component: Layout,
    meta: { title: '文件管理', icon: 'wenjian' },
    children: [
      {
        path: 'document-manage',
        name: 'DocumentManage',
        component: () => import('@/views/fileManage/documentManage'),
        meta: { title: '文件资料管理', icon: 'ziliao' }
      },
      {
        path: 'resource-manage',
        name: 'ResourceManage',
        component: () => import('@/views/fileManage/resourceManage'),
        meta: { title: '教学资源管理', icon: 'ziyuan' }
      }
    ]
  },
  /* {
    path: '/experiment',
    component: Layout,
    redirect: '/experiment/index',
    children: [
      {
        path: 'index',
        name: 'Experiment',
        component: () => import('@/views/experiment/index'),
        meta: { title: '实验管理', icon: 'shiyan' }
      }
    ]
  }, */
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router