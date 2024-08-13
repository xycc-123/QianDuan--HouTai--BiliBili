//路由鉴权：鉴权，项目当中路由能不能被访问的权限的设置
import router from "./router";
import setting from "./setting";
//@ts-ignore
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false });

import pinia from "./store";
import useUserStore from "./store/modules/user";
let useStore = useUserStore(pinia);
//全局守卫：项目中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    document.title = `${setting.title}-${to.meta.title}`;
    //to:你要访问的路由
    //from:你从哪个路由访问
    //next:路由放行函数
    nprogress.start();
    //获取token，判断用户登录状态
    let token = useStore.token;
    let username = useStore.username;
    //登录判断
    if (token) {
        //登录成功，不能访问login，指向首页
        if (to.path == '/login') {
            next({ path: '/' });
        } else {
            //登录成功访问其余六个页面
            //有用户信息
            if (username) {
                next();
            } else {
                //没有用户信息，守卫先获取再放行
                try {
                    //获取用户信息
                    await useStore.userInfo();
                    //有可能获取到用户信息，异步路由还没加载完，出现空白
                    next({ ...to });
                } catch (error) {
                    //token过期
                    //用户手动修改本地token
                    //退出登录,清空数据
                    await useStore.userLogout();
                    next({ path: '/login', query: { redirct: to.path } })
                }
            }
        }
    } else {
        //未登录
        if (to.path == '/login') {
            next();
        } else {
            next({ path: '/login', query: { redirct: to.path } });
        }
    }
})
//全局前置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done();
})

//实现进度条----nprogress
//路由鉴权（路由访问权限的设置）

//未登录：只可以访问login
//登录成功：不能访问login【重定向到首页】，其余可以访问