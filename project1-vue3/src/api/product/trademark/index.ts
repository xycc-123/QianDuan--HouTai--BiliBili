//书写品牌管理模块接口
import request from "@/utils/request";

import type { TradeMarkResponseData, TradeMark } from "./type";
//品牌管理接口模块地址
enum API {
    //获取已有品牌
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    //添加品牌
    ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
    //修改品牌
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    //删除品牌
    DELETE_URL = '/admin/product/baseTrademark/remove/',
}

//获取已有品牌的接口方法
//page：获取第几页
//limit：获取几个
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`);

//添加与修改品牌接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
    if (data.id) {
        //已有的品牌
        return request.put<any, any>(API.UPDATETRADEMARK_URL, data);
    } else {
        //新增品牌
        return request.post<any, any>(API.ADDTRADEMARK_URL, data);
    }
}

//删除品牌方法
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETE_URL + id);