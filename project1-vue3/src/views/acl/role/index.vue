<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索">
                <el-input placeholder="输入职位" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" @click="addRole" icon="Plus">添加职位</el-button>
        <el-table border style="margin: 10px 0px;" :data="allRole">
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="职位名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
            <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
            <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
                    <el-button size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                    <el-popconfirm :title="`确定要删除${row.roleName}吗`" width="260px" @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete" @click="">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNO" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasRole" @size-change="SizeChange" />
    </el-card>
    <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'">
        <el-form :model="RoleParams" :rules="rules" ref="form">
            <el-form-item label="职位名称" prop="roleName">
                <el-input placeholder="输入职位名" v-model="RoleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisite = false">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
        </template>
    </el-dialog>
    <!-- 分配权限抽屉 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>角色权限分配</h4>
        </template>
        <template #default>
            <el-tree ref="tree" style="max-width: 600px" :data="menuArr" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="selectArr" :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="handler">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion, reqRemoveRole } from '@/api/acl/role';
import useLayOutSettingStore from '@/store/modules/seeting';
import { ElMessage } from 'element-plus';
import { ref, onMounted, reactive, nextTick } from 'vue';


let pageNO = ref(1)
let pageSize = ref(10)
let keyword = ref<string>('')
let allRole = ref<any>([])
let total = ref<number>(0)
let settingStory = useLayOutSettingStore()
let dialogVisite = ref<boolean>(false)
let RoleParams = reactive<any>({
    roleName: ''
})
let form = ref<any>()
let drawer = ref<boolean>(false)
let menuArr = ref<any>([])
//存储勾选的4级ID
let selectArr = ref<any>([])

let tree = ref<any>()

onMounted(() => {
    getHasRole()
})
const getHasRole = async (page = 1) => {
    pageNO.value = page;
    let result: any = await reqAllRoleList(pageNO.value, pageSize.value, keyword.value)
    if (result.code == 200) {
        total.value = result.data.total;
        allRole.value = result.data.records;
    }
}

const SizeChange = () => {
    getHasRole()
}

const search = () => {
    getHasRole();
    keyword.value = ''
}

const reset = () => {
    settingStory.refresh = !settingStory.refresh
}

const addRole = () => {
    dialogVisite.value = true;
    Object.assign(RoleParams, {
        roleName: '',
        id: 0
    })
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}

const updateRole = (row: any) => {
    dialogVisite.value = true;
    Object.assign(RoleParams, row)
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}

const validatorRoleName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback();
    } else {
        callback(new Error('职位名称至少两位'))
    }
}

const rules = {
    roleName: [
        { required: true, trigger: 'blur', validator: validatorRoleName }
    ]
}

const save = async () => {
    await form.value.validate();
    let result = await reqAddOrUpdateRole(RoleParams)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: RoleParams.id ? '更新成功' : '添加成功'
        });
        dialogVisite.value = false;
        getHasRole(RoleParams.id ? pageNO.value : 1);
    }
}

const setPermission = async (row: any) => {
    drawer.value = true;
    //收集数据
    Object.assign(RoleParams, row)
    let result = await reqAllMenuList(RoleParams.id)
    if (result.code == 200) {
        menuArr.value = result.data;
        selectArr.value = filterSelectArr(menuArr.value, []);
    }
}

const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    });
    return initArr;
}

const handler = async () => {
    //职位ID
    const roleId = RoleParams.id;
    //选中的当前ID
    let arr = tree.value.getCheckedKeys();
    let arr1 = tree.value.getHalfCheckedKeys();
    let permissionId = arr.concat(arr1);
    //下发权限
    let result: any = await reqSetPermisstion(roleId, permissionId)
    if (result.code == 200) {
        drawer.value = false;
        ElMessage({
            type: 'success',
            message: '分配成功'
        });
        window.location.reload()
    }
}
//tree
const defaultProps = {
    children: 'children',
    label: 'name',
}

const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasRole(allRole.value.length > 1 ? pageNO.value : pageNO.value - 1)
    }
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
}
</style>