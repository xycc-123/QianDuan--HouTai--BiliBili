<template>
    <el-form label-width="80px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select style="width: 200px;" v-model="SpuParams.tmId">
                <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :value="item.id"
                    :label="item.tmName"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请输入描述" v-model="SpuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <!-- 
            v-model:file-list:展示默认图片
            action：上传图片的接口地址
            list-type：展示形式
            -->
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-uplode="handleUplode">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select v-model="saleAttrIdAndValueName" style="width: 200px;"
                :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'">
                <el-option v-for="(item, index) in unSelectSaleAttr" :key="item.id" :label="item.name"
                    :value="`${item.id}:${item.name}`"></el-option>
            </el-select>
            <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px;"
                type="primary" icon="Plus">添加销售属性</el-button>
            <el-table style="margin: 10px 0px;" border :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性名" width="120ox" prop="saleAttrName"></el-table-column>
                <el-table-column label="属性值">
                    <template #="{ row, $index }">
                        <el-tag style="margin: 0px 5px;" v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id"
                            closable @close="row.spuSaleAttrValueList.splice(index, 1)">
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input style="width: 200px;" @blur="toLook(row)" v-model="row.saleAttrValue"
                            v-if="row.flag == true" placeholder="请输入属性值"></el-input>
                        <el-button @click="toEdit(row)" v-else type="primary" class="button-new-tag" size="small"
                            icon="Plus">
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ row, $index }">
                        <el-button type="danger" class="button-new-tag" size="small" icon="Delete"
                            @click="saleAttr.splice($index, 1)">
                        </el-button>
                    </template>

                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save" :disabled="saleAttr.length > 0 ? false : true">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import type { SpuData } from '@/api/product/spu/type';
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu';
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

let $emit = defineEmits(['ChangeScene'])
const cancel = () => {
    $emit('ChangeScene', { flag: 0, params: 'updata' })
}

//存储获得的数据
let AllTradeMark = ref<any>([])
let imgList = ref<any>([])
let saleAttr = ref<any>([])
let allSaleAttr = ref<any>([])
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
    spuName: '',
    description: '',
    category3Id: '',
    tmId: '',
    spuSaleAttrList: [],
    spuImageList: [],
})
//控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')

let saleAttrIdAndValueName = ref<string>('')
//子组件写一个方法
const initHasSpuData = async (spu: SpuData) => {
    SpuParams.value = spu;
    //spu为父组件传来的row
    let result: any = await reqAllTradeMark();
    let result1: any = await reqSpuImageList((spu.id as number));
    let result2: any = await reqSpuHasSaleAttr((spu.id as number));
    let result3: any = await reqAllSaleAttr();

    //存储数据
    AllTradeMark.value = result.data;
    imgList.value = result1.data.map((item: any) => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    saleAttr.value = result2.data;
    allSaleAttr.value = result3.data;
}
//照片墙
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
}
const handleRemove = () => {

}
const handleUplode = (file: any) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '图片大小要小于3M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '图片类型必须为png/jpg/gif'
        })
        return false;
    }
}

//计算当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed<any>(() => {
    //过滤已有的，展示没有的
    let unSelectArr = allSaleAttr.value.filter((item: any) => {
        return saleAttr.value.every((item1: any) => {
            return item.name != item1.saleAttrName;
        })
    })
    return unSelectArr;
})

const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    //准备一个新的销售属性对象，传给服务器
    let newSaleAttr: any = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组中
    saleAttr.value.push(newSaleAttr)
    //清空收集的数据
    saleAttrIdAndValueName.value = "";
}

const toEdit = (row: any) => {
    //点击按钮时出input
    row.flag = true;
    row.saleAttrValue = ''
}

const toLook = (row: any) => {
    //整理收集的属性Id与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性形式
    let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue
    }
    //非法判断
    if (saleAttrValue.trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return;
    }
    let repeat = row.spuSaleAttrValueList.find((item: any) => {
        return item.saleAttrValueName == saleAttrValue
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    //切换为按钮
    row.flag = false
}
const save = async () => {
    //整理数据
    //照片墙数据重组
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    });
    //销售属性数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    let result = await reqAddOrUpdateSpu(SpuParams.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        //切换场景
        $emit('ChangeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }
}
//新方法
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(
        SpuParams.value, {
        spuName: '',
        description: '',
        category3Id: '',
        tmId: '',
        spuSaleAttrList: [],
        spuImageList: [],
    }
    )
    imgList.value = [];
    saleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    SpuParams.value.category3Id = c3Id;
    let result: any = await reqAllTradeMark();
    let result1: any = await reqAllSaleAttr();
    //存储数据
    AllTradeMark.value = result.data;
    allSaleAttr.value = result1.data;

}
//对外暴露，父组件可以调用
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>