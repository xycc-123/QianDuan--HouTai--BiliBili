//SPU管理模块接口
import request from "@/utils/request";
// 引入ts类型
import type { HasSpuResponseData, SpuData, SkuData, SkuInfoData } from "./type";
enum API {
    //获取已有的SPU数据
    HASSPU_URL = '/admin/product/',
    //获取全部品牌的数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    //获取某个SPU下全部售卖商品的图片数据
    IMAGE_URL = '/admin/product/spuImageList/',
    //获取一个SPU下全部属性接口地址
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    //整个项目的全部销售属性
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    //添加SPU接口地址
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    //修改。。。。。
    UPDATE_URL = '/admin/product/updateSpuInfo',
    //获取SKU接口地址
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    //查看某个已有的SPU下的全部商品
    SKUINFO_URL = '/admin/product/findBySpuId/',
    //删除已有spu
    REMOVESPU_URL = '/admin/product/deleteSpu/'
}

//获取三级分类下的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
//获取全部spu品牌数据
export const reqAllTradeMark = () => request.get<any, any>(API.ALLTRADEMARK_URL)
//获取某个SPU下全部售卖商品的图片地址
export const reqSpuImageList = (spuId: number) => request.get<any, any>(API.IMAGE_URL + spuId)
//获取一个SPU下全部销售属性
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, any>(API.SPUHASSALEATTR_URL + spuId)
//整个项目的全部销售属性
export const reqAllSaleAttr = () => request.get<any, any>(API.ALLSALEATTR_URL)
//添加或者更新
export const reqAddOrUpdateSpu = (data: SpuData) => {
    if (data.id) {
        return request.post<any, any>(API.UPDATE_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}
//添加SKU
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
//获取sku数据
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
//删除已有的spu
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuId)