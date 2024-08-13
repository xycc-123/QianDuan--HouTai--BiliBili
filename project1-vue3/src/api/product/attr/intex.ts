import request from "@/utils/request";
import { CategoryResponseData, AttrResponseData, Attr } from './type';


enum API {
    //获取一级标题的api
    C1_URL = '/admin/product/getCategory1',
    //获取二级标题的api
    C2_URL = '/admin/product/getCategory2/',
    //获取三级标题api
    C3_URL = '/admin/product/getCategory3/',
    //获取属性和属性值
    ATTR_URL = '/admin/product/attrInfoList/',
    //添加或修改属性接口api
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    //删除的地址api
    DELETEATTR_URL = '/admin/product/deleteAttr/',
}

//获取一级标题接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);
//获取二级标题接口
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id);
//获取三级标题接口
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id);
//获取属性与属性值接口
export const reqAttr = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`);
//添加或修改
export const reqAddOrupdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATEATTR_URL, data)
//删除属性
export const reqRemoveAttr = (attrId: number) => request.delete<any, any>(API.DELETEATTR_URL + attrId)