<template>
    <div>
        <Category :scene='scene' />
        <el-card style="margin: 10px 0px;">
            <div v-show="scene == 0">
                <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                    @click="addAttr">添加属性</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">{{
                                item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #="{ row, $index }">
                            <el-button type="warning" plain icon="Edit" size="small"
                                @click="updataAttr(row)"></el-button>
                            <el-popconfirm :title="`确定要删除${row.attrName}吗?`" width="200px"
                                @confirm="deleteAttr(row.id)">
                                <template #reference>
                                    <el-button type="danger" plain icon="Delete" size="small"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene == 1">
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary"
                    icon="Plus">添加属性值</el-button>
                <el-button @click="cancel">取消</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag"
                                @blur="toLook(row, $index)" placeholder="输入属性值" v-model="row.valueName"></el-input>
                            <div @click="toEdit(row, $index)" v-else>{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{ row, $index }">
                            <el-button type="danger" plain icon="Delete" size="small"
                                @click="attrParams.attrValueList.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="save"
                    :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category';
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import { reqAttr, reqAddOrupdateAttr, reqRemoveAttr } from '@/api/product/attr/intex';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore();
//定义card组件内容切换变量
let scene = ref<number>(0)//0时展示table，1时展示修改页面
let attrArr = ref<Attr[]>([]);
let attrParams = reactive<Attr>({
    attrName: "",//新增的属性名
    attrValueList: [],//新增的属性值数组
    categoryId: '',//三级分类ID
    categoryLevel: 3,
})
//准备一个数组，存储对应的组件实例el-input
let inputArr = ref<any>([]);
//监听三级分类Id变化
watch(() => categoryStore.c3Id, () => {
    //清空上次的属性与属性值
    attrArr.value = [];
    //保证三级分类有再发请求
    if (!categoryStore.c3Id) return;
    //获取分类id
    getAttr();
})
//封装方法
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore;
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
    if (result.code == 200) {
        attrArr.value = result.data;
    }
}
const addAttr = () => {
    //每次点击先清空再收集
    Object.assign(attrParams, {
        attrName: "",//新增的属性名
        attrValueList: [//新增的属性值数组
        ],
        categoryId: categoryStore.c3Id,//三级分类ID
        categoryLevel: 3,
    })
    //切换页面
    scene.value = 1
}
const updataAttr = (row: Attr) => {
    //切换页面
    scene.value = 1
    //将已有的属性对象赋值给atterParams
    //深拷贝
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)));

}
const cancel = () => {
    //切换页面
    scene.value = 0
}
//添加属性值的回调
const addAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: '',
        flag: true//控制属性值编辑模式和查看模式切换
    });
    //获取最后一个组件
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus();
    })
}
//保存按钮回调
const save = async () => {
    let result: any = await reqAddOrupdateAttr(attrParams);
    //添加|修改后返回
    if (result.code == 200) {
        scene.value = 0;
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功'
        });
        //重新获取
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败'
        })
    }
}
//属性值失去焦点回调
const toLook = (row: AttrValue, $index: number) => {
    //非法判断
    //trim() 方法用于去除字符串两端的空白字符（包括空格、制表符、换行符等）
    if (row.valueName.trim() == '') {
        //删除值为空的元素
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能为空',
        })
        return;
    };
    //非法2
    let repeat = attrParams.attrValueList.find((item) => {
        if (item != row) {
            return item.valueName === row.valueName;
        }
    })
    if (repeat) {
        attrParams.attrValueList.splice($index, 1);
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        return;
    }
    row.flag = false;
}
//div点击回调
const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true;

    nextTick(() => {
        inputArr.value[$index].focus();
    })
}
//删除属性
const deleteAttr = async (attrId: number) => {
    let result = await reqRemoveAttr(attrId);
    //删除成功
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        });
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
//路由组件销毁时，清空仓库
onBeforeUnmount(() => {
    categoryStore.$reset();
})
</script>

<style scoped></style>