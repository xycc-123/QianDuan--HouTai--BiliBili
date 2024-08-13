//数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//SPU数据TS类型
export interface SpuData {
    id?: number,
    spuName: string,
    description: string,
    category3Id: number | string,
    tmId: number | string,
    spuSaleAttrList: null | any,
    spuImageList: null | any,
}
/*category3Id
description
id
spuImageList
spuName
spuPosterList
spuSaleAttrList
tmId
*/
//已有元素数组
export type Records = SpuData[];
//定义已有的Spu属性接口返回的ts类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number,
    }
}

export interface Attr {
    attrId: string | number,
    valueld: string | number,
}

export interface saleArr {
    saleAttrId: string | number,
    saleAttrValueId: string | number,
}

export interface SkuData {
    category3Id: string | number,
    spuId: string | number,
    tmId: string | number,
    skuName: string,
    price: string | number,
    weight: string | number,
    skuDesc: string,
    skuAttrValueList?: Attr[],
    skuSaleAttrValueList?: saleArr[],
    skuDefaultImg: string
}

export interface SkuInfoData extends ResponseData {
    data: SkuData[]
}