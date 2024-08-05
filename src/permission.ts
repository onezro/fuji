import router from './router'
import { useAppStore } from '@/stores/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/useTitle'
import { getToken } from "@/utils/auth";
import { useNProgress } from '@/hooks/useNProgress'
import { usePermissionStoreWithOut } from '@/stores/modules/permission'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { getMenu, getInfo, getMenuOPUI } from '@/api/permiss'
// import { asyncRouterMap, constantRouterMap } from '@/router'
import { updateParentMenus } from "@/utils/routerAata"

const { start, done } = useNProgress()

router.beforeEach(async (to, from, next) => {
  start()
  const permissionStore = usePermissionStoreWithOut()
  const appStore = useAppStore()
  const userStore = useUserStoreWithOut()
  const hasUser = getToken()
  if (hasUser) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const roleRouters = userStore.getRoleRouters || []
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }
      await getInfo().then(async (data: any) => {
        userStore.setUserInfo(data.content);
        if (data.code == 100200) {
          if (roleRouters.length == 0) {
            if (appStore.getSystemType) {
              await getMenuOPUI().then(async (data: any) => {
                const routerArr = JSON.parse(data.content) || []
                let routerData = routerArr[0].childMenu.map((v: any) => {
                  let data = updateParentMenus([v])
                  return data
                })
                // console.log(routerData);
                userStore.setRoleRouters(routerData)
                await permissionStore.generateRoutes('server', routerData)
              })

              // permissionStore.generateRoutes('static')
              permissionStore.getAddRouters.forEach((route: any) => {
                router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
              })
            } else {
              await getMenu().then(async (data: any) => {
                if (data.code == 100200) {
                  const routerArr = JSON.parse(data.content) || []
                  const systemRouter = routerArr.filter((v: any) => v.MenuName == 'Portal')
                  if (systemRouter.length == 0) {
                    await permissionStore.generateRoutes('static')
                  } else {
                    userStore.setRoleRouters(systemRouter[0].childMenu)
                    await permissionStore.generateRoutes('server', systemRouter[0].childMenu)
                    // console.log(permissionStore.getAddRouters)
                  }
                }
                else {
                  await permissionStore.generateRoutes('static')
                }
                permissionStore.getAddRouters.forEach((route: any) => {
                  router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
                })
              })
            }
          }
        } else {
          permissionStore.generateRoutes('static')
          permissionStore.getAddRouters.forEach((route: any) => {
            router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
          })
        }

      })
      // const query=from.query.redirect==null||from.query.redirect==undefined?to.path:from.query.redirect
      const redirectPath = appStore.getSystemType ? localStorage.getItem('OPUI') : from.query.redirect||to.path
      // const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      // console.log(to.path,to.path,query)
      next(nextData)
    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      if (appStore.getSystemType && localStorage.getItem('OPUI')) {
        let routestr = localStorage.getItem('OPUI') || '/'
        next(`/login?redirect=${routestr}`)
      } else {
        next(`/login?redirect=${to.path}`)
      }
      // next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
})
