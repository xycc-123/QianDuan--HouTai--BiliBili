<template>
    <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
        <el-table-column prop="name" label="名称" sortable></el-table-column>
        <el-table-column prop="code" label="权限值" sortable></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" sortable></el-table-column>
        <el-table-column prop="address" label="操作" sortable>
            <template #="{ row, $index }">
                <el-button @click="addPermission(row)" type="primary" size="small " icon="Plus"
                    :disabled="row.level == 4 ? true : false">{{
                        row.level ==
                            3 ? '添加功能' : '添加菜单' }}</el-button>
                <el-button @click="updatePermission(row)" size="small " icon="Edit"
                    :disabled="row.level == 1 ? true : false">编辑</el-button>
                <el-popconfirm :title="`你确定要删除${row.name}吗？`" width="220px" @confirm="removeMeun(row.id)">
                    <template #reference>
                        <el-button type="danger " size="small " icon="Delete"
                            :disabled="row.level == 1 ? true : false">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="meunData.id ? '更新菜单' : '添加菜单'">
        <el-form label-width="60px">
            <el-form-item label="名称">
                <el-input placeholder="请输入菜单名称" v-model="meunData.name" />
            </el-form-item>
            <el-form-item label="权限值">
                <el-input placeholder="请输入权限值" v-model="meunData.code" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reqAllPermission, reqAddOrUpdateMenu, reqDelete } from '@/api/acl/menu';
import { ElMessage } from 'element-plus';
import { onMounted, ref, reactive } from 'vue';

let PermissionArr = ref<any>([])
let dialogVisible = ref<boolean>(false)
let meunData = reactive<any>({
    code: '',
    level: 0,
    name: '',
    pid: 0
})

onMounted(() => {
    getHasPermission();
})
const getHasPermission = async () => {
    let result: any = await reqAllPermission()
    if (result.code == 200) {
        PermissionArr.value = result.data;
    }
}

const addPermission = (row: any) => {
    Object.assign(meunData, {
        id: 0,
        code: '',
        level: 0,
        name: '',
        pid: 0
    })
    dialogVisible.value = true;
    meunData.level = row.level + 1;
    meunData.pid = row.pid;
}
const updatePermission = (row: any) => {
    dialogVisible.value = true;
    Object.assign(meunData, row);
}

const save = async () => {
    let result: any = await reqAddOrUpdateMenu(meunData);
    if (result.code == 200) {
        dialogVisible.value = false;
        ElMessage({
            type: 'success',
            message: meunData.id ? '更新成功' : '添加成功'
        })
        getHasPermission();
    }
}

const removeMeun = async (id: number) => {
    let result: any = await reqDelete(id);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasPermission();
    }
}
</script>

<style scoped></style>