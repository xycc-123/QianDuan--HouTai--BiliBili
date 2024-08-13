<template>
    <el-card>
        <el-table border style="margin: 10px 0px;" :data="skuArr">
            <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
            <el-table-column label="名称" show-overflow-tooltip width="200px" prop="skuName"></el-table-column>
            <el-table-column label="描述" show-overflow-tooltip width="200px" prop="skuDesc"></el-table-column>
            <el-table-column label="图片" width="200px">
                <template #="{ row, $index }">
                    <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="重量" width="200px" prop="weight"></el-table-column>
            <el-table-column label="价格" width="200px" prop="price"></el-table-column>
            <el-table-column label="操作" fixed="right" width="250px">
                <template #="{ row, $index }">
                    <el-button :type="row.isSale == 1 ? 'info' : 'primary'" size="small"
                        :icon="row.isSale == 1 ? 'Bottom' : 'Top'" @click="updateSale(row)"></el-button>
                    <el-button type="warning" size="small" icon="Edit" title="编辑" @click="updatesku"></el-button>
                    <el-button type="info" size="small" icon="InfoFilled" title="查看" @click="findsku(row)"></el-button>
                    <el-popconfirm :title="`确定要删除${row.skuName}吗？`" width="200px" @confirm="removesku(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete" title="删除"></el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasSku" @size-change="handler" />
        <!-- 抽屉组件，展示商品详情 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h3>商品详情</h3>
            </template>
            <template #default>
                <el-row style="margin: 10px 0px;">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuinfo.skuName }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0px;">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuinfo.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0px;">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuinfo.price }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0px;">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18">
                        <el-tag style="margin: 5px 5px;" v-for="item in skuinfo.skuAttrValueList" :key="item.id">{{
                            item.valueName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0px;">
                    <el-col :span="6">销售属性</el-col>
                    <el-col :span="18">
                        <el-tag type="success" style="margin: 5px 5px;" v-for="item in skuinfo.skuSaleAttrValueList"
                            :key="item.id">
                            {{ item.saleAttrValueName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0px;">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="item in skuinfo.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
        </el-drawer>
    </el-card>
</template>


<script setup lang="ts">
import { reqSkuList, reqSaleSku, reqCancelSale, reqskuInfo, reqskuRemove } from '@/api/product/sku';
import { ref, onMounted } from 'vue';
import type { SkuResponseData, SkuData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(0)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
//控制抽屉
let drawer = ref<boolean>(false)

let skuinfo = ref<any>([])

onMounted(() => {
    getHasSku();
})

const getHasSku = async (pager = 1) => {
    pageNo.value = pager;
    let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
    if (result.code == 200) {
        total.value = result.data.total;
        skuArr.value = result.data.records;
    } else {

    }
}

const handler = (pageSize: number) => {
    getHasSku();
}

const updateSale = (row: SkuData) => {
    if (row.isSale == 1) {
        reqCancelSale((row.id as number));
        ElMessage({
            type: 'success',
            message: '下架成功'
        })
        getHasSku(pageNo.value)
    } else {
        reqSaleSku((row.id as number));
        ElMessage({
            type: 'success',
            message: '上架成功'
        })
        getHasSku(pageNo.value)
    }
}

const updatesku = () => {
    ElMessage({
        type: 'success',
        message: '模块正在开发中...'
    })
}

const findsku = async (row: SkuData) => {
    drawer.value = true;
    let result = await reqskuInfo((row.id as number))
    skuinfo.value = result.data
}

const removesku = async (id: number) => {
    let result: any = await reqskuRemove((id))
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>