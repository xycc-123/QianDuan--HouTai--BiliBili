<template>
    <div>
        <el-card class="box-card">
            <el-button type="primary" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">添加品牌</el-button>
            <!-- 表格组件，展示已有品牌数据 -->
            <!-- 
            table
            ---border:表格纵向是否有边框
            table-column
            ---label:列表名
            ---align:设置这列对齐方式
         -->
            <el-table style="margin: 10px 0px" border :data="trademarkArr">
                <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
                <el-table-column label="品牌名称" prop="tmName"></el-table-column>
                <el-table-column label="品牌LOGO">
                    <template #="{ row, $index }">
                        <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="品牌操作">
                    <template #="{ row, $index }">
                        <el-button type="warning" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
                        <el-popconfirm :title="`你确定删除${row.tmName}?`" width="250px" icon="Delete"
                            @confirm="removeTradeMark(row.id)">
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 
        分页器 
        v-model:current-page:分页器默认页吗
        v-model:page-size:每页数据数量
        :page-sizes:下拉菜单数据
        layout:子组件布局调整
         -->
            <el-pagination @size-change="sizeChange" @current-change="getHasTrademark" v-model:current-page="pageNo"
                v-model:page-size="limlt" :page-sizes="[3, 5, 7, 9]" :background="true"
                layout=" prev, pager, next, jumper,->,sizes,total" :total="total" />
        </el-card>
        <!-- 
        对话框组件 
        v-model:控制显示与隐藏
         -->
        <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
            <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="80px" prop="tmName">
                    <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">
                    <!-- 
                    action:图片上传路径，前面加/api
                    :show-file-list：是否展示上传的文件列表
                    :before-upload：上传前钩子，可以限制文件类型和大小
                    -->
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="confirm">
                    确定
                </el-button>
                <el-button @click="cancel">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import { ref, onMounted, reactive, nextTick } from 'vue';
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type';
import { ElMessage, type UploadProps } from 'element-plus';
//默认页码
let pageNo = ref<number>(1);
//每页数据数量
let limlt = ref<number>(3);
//存储数据总数
let total = ref<number>(0);
//存储已有品牌数据
let trademarkArr = ref<Records>([]);
let dialogFormVisible = ref<boolean>(false)
//收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
    tmName: '',
    logoUrl: ''
})

let formRef = ref();
//获取已有品牌的接口封装为一个函数
const getHasTrademark = async (pager = 1) => {
    pageNo.value = pager;
    let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limlt.value);
    if (result.code == 200) {
        total.value = result.data.total;
        trademarkArr.value = result.data.records;
    }
}

onMounted(() => {
    getHasTrademark();
})
//分页器当前页码变化时触发
//会回传当前页码
// const changepageNo = () => {
//     getHasTrademark();
// }

//每页数据量改变时触发
const sizeChange = () => {
    getHasTrademark();
}

const addTrademark = () => {
    dialogFormVisible.value = true;
    //清空数据
    trademarkParams.id = 0
    trademarkParams.tmName = ''
    trademarkParams.logoUrl = ''

    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
    // formRef.value?.clearValidate('tmName')
}

const updateTrademark = (row: TradeMark) => {
    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
    dialogFormVisible.value = true;
    //ES6语法合并对象
    Object.assign(trademarkParams, row);
    // trademarkParams.id = row.id;
    // trademarkParams.tmName = row.tmName;
    // trademarkParams.logoUrl = row.logoUrl;
}

const cancel = () => {
    dialogFormVisible.value = false;
}
const confirm = async () => {
    //发送请求前进行校验，全部通过再执行后面
    await formRef.value.validate();

    let result: any = await reqAddOrUpdateTrademark(trademarkParams);
    //添加成功
    if (result.code == 200) {
        dialogFormVisible.value = false;
        ElMessage({
            type: 'success',
            message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
        });
        //再次发送请求获取全部品牌数量
        getHasTrademark(trademarkParams.id ? pageNo.value : 1);
    } else {
        //失败 
        dialogFormVisible.value = false;
        ElMessage({
            type: 'error',
            message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
        });
    }

}
//上传之前触发钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件大小应小于4M',
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件只能是png、jpg、gif',
        })
        return false;
    }
}
//上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    //response为上传图片post请求返回的数据
    //收集上传的图片地址，新加品牌时带给服务器
    trademarkParams.logoUrl = response.data;
    formRef.value.clearValidate('logoUrl')
}
//表单校验规则
const validatortmName = (rule: any, value: any, callback: any) => {
    //自定义校验规则
    if (value.trim().length >= 1) {
        callback();
    } else {
        callback(new Error('品牌名称至少一位'))
    }
}

const validatorlogoUrl = (rule: any, value: any, callback: any) => {
    if (value) {
        callback();
    } else {
        callback(new Error('LOGo图片必须上传'))
    }
}

//表单校验规则对象
const rules = {
    tmName: [
        { requird: true, trigger: 'blur', validator: validatortmName }
    ],
    logoUrl: [
        { requird: true, validator: validatorlogoUrl }
    ]
}

//气泡确认框回调
const removeTradeMark = async (id: number) => {
    //点击确认就删除
    let result = await reqDeleteTrademark(id);
    console.log(result);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        });
        //更新品牌数量
        getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        });
    }
}
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>