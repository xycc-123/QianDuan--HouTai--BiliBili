//SKU接口
import request from "@/utils/request";
import type { SkuResponseData } from "./type";

enum API {
    //获取已有的商品数据
    SKU_URL = '/admin/product/list/',
    //上架
    SALE_URL = '/admin/product/onSale/',
    //下架
    CANCELSALE_URL = '/admin/product/cancelSale/',
    //获取商品信息
    SKUINFO_URL = '/admin/product/getSkuInfo/',
    //删除sku
    REMOVESKU_URL = '/admin/product/deleteSku/'
}

//获取商品SKU接口
export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
//上架接口
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
//下架接口
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
//获取商品时的接口
export const reqskuInfo = (skuId: number) => request.get<any, any>(API.SKUINFO_URL + skuId)
//删除sku接口
export const reqskuRemove = (skuId: number) => request.delete<any, any>(API.REMOVESKU_URL + skuId)