//用户小仓库
import { defineStore } from "pinia";
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
//引入数据类型
import { LoginFormData, loginResponseDate, userInfoResponseDate } from "@/api/user/type";
// import type { loginForm, loginResponseDate } from "@/api/user/type";
import type { UserState } from "./types/type";
//token存储和获得方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token";
//引入常量路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
import router from "@/router";
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep';

//过滤需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
    return asyncRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true;
        }
    })
}

//创建用户小仓库
let useUserStore = defineStore('User', {
    //存储数据
    state: (): UserState => {
        return {
            token: GET_TOKEN(),//用户唯一标识
            menuRoutes: constantRoute,//仓库存储生产菜单所需要的数组（路由）
            username: '',
            avatar: '',
            buttons: [],
        }
    },
    //异步|逻辑的地方
    actions: {
        //用户登录方法
        async userLogin(data: LoginFormData) {
            //登录请求
            const result: loginResponseDate = await reqLogin(data);
            //成功 200->token
            //失败 201->错误信息
            if (result.code == 200) {
                //pinia仓库存储token
                //由于pinia存储利用js对象，不能长久保存
                this.token = result.data as string;
                //本地存储一份
                SET_TOKEN(result.data as string)
                //
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data))
            }
        },
        //获取用户信息方法
        async userInfo() {
            const result: userInfoResponseDate = await reqUserInfo();
            if (result.code == 200) {
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                this.buttons = result.data.buttons
                //计算当前用户要展示的异步路由
                const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes);
                //菜单的数据
                this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
                //计算完异步路由，动态添加
                [...userAsyncRoute, anyRoute].forEach((route: any) => {
                    router.addRoute(route)
                });
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message));
            }
        },
        //退出登录方法
        async userLogout() {
            let result: any = await reqLogout();
            if (result.code == 200) {
                this.token = '';
                this.username = '';
                this.avatar = '';
                REMOVE_TOKEN();
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message));
            }
        },
    },
    getters: {

    }
}
)
//对外暴露
export default useUserStore