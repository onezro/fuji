import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
// import { getParentLayout } from '@/utils/routerHelper'

export const constantRouterMap = [
  {
    path: '/',
    // component: Layout,
    redirect: '/dashboard',
    name: 'Root',
    meta: {
      hidden: true,

    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',

    }
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'House',
         hidden: true,
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Index',
        meta: {
          title: '首页',
          icon: 'House',
          affix: true
        }
      },

    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   name: 'permission',
  //   meta: {
  //     title: '系统管理',
  //   },
  //   children: [
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/permission/menu.vue'),
  //       name: 'Menu',
  //       meta: {
  //         title: '菜单管理',
  //         icon: 'Tickets'
  //       }

  //     },
  //     {
  //       path: 'empolyee',
  //       component: () => import('@/views/permission/empolyee.vue'),
  //       name: 'Empolyee',
  //       meta: {
  //         title: '员工管理',
  //         icon: 'User'
  //       }
  //     },
  //      {
  //       path: 'role',
  //       component: () => import('@/views/permission/role.vue'),
  //       name: 'role',
  //       meta: {
  //         title: '员工管理',
  //         icon: 'User'
  //       }
  //     },
  //   ]
  // },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
    }
  },
   {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
]

export const asyncRouterMap = [


]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRouterMap as RouteRecordRaw[]
})



export default router
