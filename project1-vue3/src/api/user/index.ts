//统一项目用户相关接口
import request from "@/utils/request";

import { LoginFormData, loginResponseDate, userInfoResponseDate } from "./type";
//统一管理接口，enum API声明了一个名为 API 的枚举。
enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout'
}

//暴露请求函数
//登录接口方法
//第一个泛型参数<any> 表示请求数据的类型,第二个泛型参数 <loginResponseDate> 表示响应数据的类型
export const reqLogin = (data: LoginFormData) => request.post<any, loginResponseDate>(API.LOGIN_URL, data);
//用户信息接口方法
export const reqUserInfo = () => request.get<any, userInfoResponseDate>(API.USERINFO_URL);
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)