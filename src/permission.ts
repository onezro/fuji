import router from './router'
import { useAppStoreWithOut } from '@/stores/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/useTitle'
import { getToken } from "@/utils/auth";
import { useNProgress } from '@/hooks/useNProgress'
import { usePermissionStoreWithOut } from '@/stores/modules/permission'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { getMenu, getInfo } from '@/api/permiss'
// import { asyncRouterMap, constantRouterMap } from '@/router'

const { start, done } = useNProgress()

router.beforeEach(async (to, from, next) => {
  start()
  const permissionStore = usePermissionStoreWithOut()
  const appStore = useAppStoreWithOut()
  const userStore = useUserStoreWithOut()
  const hasUser = getToken()
  if (hasUser) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // const employeeId = localStorage.getItem("OPCENTER_ROLE");
      const roleRouters = userStore.getRoleRouters || []
      // console.log(roleRouters);

      if (permissionStore.getIsAddRouters) {
        next()
        return
      }
      await getInfo().then(async (data: any) => {
        userStore.setUserInfo(data.content);
        if (data.code == 100200) {
          if (roleRouters.length == 0) {
            await getMenu().then(async (data: any) => {
              if (data.code == 100200) {
                const routerArr = JSON.parse(data.content) || []
                const systemRouter = routerArr.filter((v: any) => v.MenuName == "Portal")
                // console.log(systemRouter);
                if(systemRouter.length==0){
                  await permissionStore.generateRoutes('static')
                }else{
                  userStore.setRoleRouters(systemRouter[0].childMenu)
                  await permissionStore.generateRoutes('server', systemRouter[0].childMenu)
                }
              }
              else {
                await permissionStore.generateRoutes('static')
              }
              permissionStore.getAddRouters.forEach((route: any) => {
                // console.log(route);
                router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
              })
              // console.log(router.getRoutes())
            })
          }
        } else {
          permissionStore.generateRoutes('static')
          permissionStore.getAddRouters.forEach((route: any) => {
            router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
          })
        }

      })

      //是否使用动态路由
      // if (appStore.getDynamicRouter) {
      //   appStore.serverDynamicRouter
      //     ? await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])
      //     : await permissionStore.generateRoutes('frontEnd', roleRouters as string[])
      // } else {
      //   // console.log(111)
      // await permissionStore.generateRoutes('static')
      // }

      // permissionStore.getAddRouters.forEach((route: any) => {
      //   console.log(route)
      //   router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      // })

      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)

    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      // console.log(to.path);
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
})
