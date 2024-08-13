//分类相关数据ts类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//分类ts类型
export interface CategoryObj {
    id: number | string,
    name: string,
    category1Id?: number,
    category2Id?: number
}

//接口总类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

//属性值对象ts类型
export interface AttrValue {
    id?: number,
    valueName: string,
    attrId?: number,
    flag?: boolean
}
//存储属性值的数组类型
export type AttrValueList = AttrValue[]
//属性对象
export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number | string,
    categoryLevel: number,
    attrValueList: AttrValueList
}
//存储属性的数组类型
export type AttrList = Attr[]
//属性接口返回属性
export interface AttrResponseData extends ResponseData {
    data: Attr[]
}