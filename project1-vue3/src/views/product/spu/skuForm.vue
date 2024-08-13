<template>
    <el-form label-width="100px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParmas.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuParmas.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="重量(g)" type="number" v-model="skuParmas.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParmas.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true">
                <el-form-item style="width: 200px;" v-for="(item, index) in attrArr" :key="item.id"
                    :label="item.attrName">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option :value="`${item.id}:${attrValue.id}`"
                            v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id"
                            :label="attrValue.valueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item style="width: 200px;" v-for="(item, index) in saleAttr" :key="item.id"
                    :label="item.saleAttrName">
                    <el-select v-model="item.saleIdAndvalueId">
                        <el-option :value="`${item.id}:${saleAttrValue.id}`"
                            v-for="(saleAttrValue, indux) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #="{ row, $index }">
                        <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{ row, $index }">
                        <el-button type="success" plain @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr/intex';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import { ref, reactive } from 'vue';
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';

let attrArr = ref<any>([]);
let saleAttr = ref<any>([]);
let imgArr = ref<any>([])
//获取table组件操作实例vc
let table = ref<any>()
//收集Sku参数
let skuParmas = reactive<SkuData>({
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName: '',
    price: '',
    weight: '',
    skuDesc: '',
    skuAttrValueList: [
        // {
        //     attrId: '',
        //     valueld: '',
        // }
    ],
    skuSaleAttrValueList: [
        // {
        //     saleAttrId: '',
        //     saleAttrValueId: '',
        // }
    ],
    skuDefaultImg: ''
})

//定义方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
    //收集数据
    skuParmas.category3Id = spu.category3Id;
    skuParmas.spuId = spu.id;
    skuParmas.tmId = spu.tmId;
    //平台属性
    let result: any = await reqAttr(c1Id, c2Id, spu.category3Id);
    //对应的销售属性
    let result1: any = await reqSpuHasSaleAttr(spu.id);
    //对应照片
    let result2: any = await reqSpuImageList(spu.id);
    //存储数据
    attrArr.value = result.data;
    saleAttr.value = result1.data;
    imgArr.value = result2.data;
}

const handler = (row: any) => {
    //改变复选框状态
    imgArr.value.forEach((item: any) => {
        table.value.toggleRowSelection(item, false);
    });
    //选中的图片才勾选
    table.value.toggleRowSelection(row, true);
    //收集图片地址
    skuParmas.skuDefaultImg = row.imgUrl;
}

const save = async () => {
    //整理参数
    //平台属性
    skuParmas.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueld] = next.attrIdAndValueId.split(':')
            prev.push({
                attrId,
                valueld
            })
        }
        return prev;
    }, []);
    //销售属性
    skuParmas.skuSaleAttrValueList = saleAttr.value.reduce((prev: any, next: any) => {
        if (next.saleIdAndvalueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndvalueId.split(':')
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev;
    }, []);
    //发请求
    let result: any = await reqAddSku(skuParmas);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SPU成功'
        })
        $emit('ChangeScene', { flag: 0, params: '' })
    } else {
        ElMessage({
            type: 'error',
            message: '添加SPU失败'
        })
    }
}
//
let $emit = defineEmits(['ChangeScene'])
const cancel = () => {
    $emit('ChangeScene', { flag: 0, params: '' })
}

defineExpose({
    initSkuData
})
</script>

<style scoped></style>