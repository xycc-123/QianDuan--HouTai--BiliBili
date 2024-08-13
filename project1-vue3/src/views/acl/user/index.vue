<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名:">
                <el-input style="width: 240px;" placeholder="输入用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button :disabled="selectIdArr.length ? false : true" @click="deleteSelectUser">批量删除</el-button>
        <el-table @selection-change="selectionChange" style="margin: 10px 0px;" border :data="userArr">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户昵称" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width='260px' align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" title="分配角色"
                        @click="setRole(row)">分配角色</el-button>
                    <el-button size="small" icon="Edit" title="编辑" @click="updateUser(row)"></el-button>
                    <el-popconfirm :title="`确定要删除${row.username}吗?`" width="200px" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete" title="删除"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasUser" @size-change="handler" />
    </el-card>
    <!-- 抽屉结构 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
        </template>
        <template #default>
            <el-form :model="userParams" ref='formRef' :rules="rules">
                <el-form-item label="用户姓名" prop="name">
                    <el-input placeholder="请输入用户姓名" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="username">
                    <el-input placeholder="请输入用户昵称" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!-- 抽屉2 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色（职位）</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer1 = false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { reqgetUser, reqAddOrUpdateUser, reqtoAssign, reqSetUserRole, reqRemoverUser, reqSelectUser } from '@/api/acl/user';
import useLayOutSettingStore from '@/store/modules/seeting';
import { ElMessage } from 'element-plus';
import { ref, onMounted, reactive, nextTick } from 'vue';

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let userArr = ref<any>([])

let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
//收集用户信息
let userParams = reactive<any>({
    id: '',
    username: '',
    name: '',
    password: ''
})

let formRef = ref<any>()

const checkAll = ref(false)
const isIndeterminate = ref(true)
let allRole = ref<any>([])
let userRole = ref<any>([])
let selectIdArr = ref<any>([])
//收集用户输入的关键字
let keyword = ref<string>('')
let settingStory = useLayOutSettingStore();

onMounted(() => {
    getHasUser()
})

const getHasUser = async (pager = 1) => {
    pageNo.value = pager
    let result: any = await reqgetUser(pageNo.value, pageSize.value, keyword.value)
    total.value = result.data.total;
    userArr.value = result.data.records;
}

const handler = () => {
    getHasUser()
}

const addUser = () => {
    drawer.value = true
    //清空数据
    Object.assign(userParams, {
        id: '',
        username: '',
        name: '',
        password: ''
    })

    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
        formRef.value.clearValidate('password');
    })
}
const updateUser = (row: any) => {
    drawer.value = true;
    //存储收集的信息
    Object.assign(userParams, row)
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
    })

}

const save = async () => {
    //保证表单都符合条件
    await formRef.value.validate();

    let result: any = await reqAddOrUpdateUser(userParams);
    if (result.code == 200) {
        drawer.value = false;
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功'
        })
        // getHasUser(userParams.id ? pageNo.value : 1);
        //自动刷新
        window.location.reload();
    } else {
        drawer.value = false;
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败'
        })
    }
}

const cancel = () => {
    drawer.value = false
}
//表单校验对象
const validatorUsername = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 5) {
        callback();
    } else {
        callback(new Error('用户昵称至少五位'))
    }
}
const validatorname = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 1) {
        callback();
    } else {
        callback(new Error('用户名字不能为空'))
    }
}
const validatorpassword = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 6) {
        callback();
    } else {
        callback(new Error('用户密码至少六位'))
    }
}
const rules = {
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    password: [{ required: true, trigger: 'blur', validator: validatorpassword }]
}
//分配角色
const setRole = async (row: any) => {
    //存储用户信息
    Object.assign(userParams, row)
    //获取当前职位数据和用户已有职位数据
    let result: any = await reqtoAssign(userParams.id)
    if (result.code == 200) {
        allRole.value = result.data.allRolesList;
        userRole.value = result.data.assignRoles;
        drawer1.value = true
    }
}

const handleCheckAllChange = (val: boolean) => {
    userRole.value = val ? allRole.value : []
    isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allRole.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

const confirmClick = async () => {
    let data: any = {
        userId: userParams.id,
        roleIdList: userRole.value.map((item: any) => item.id)
    }
    //分配用户职位
    let result: any = await reqSetUserRole(data);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '分配成功'
        })
        drawer1.value = false;
        getHasUser(pageNo.value)
    } else {

    }
}

//删除
const deleteUser = async (userId: number) => {
    let result: any = await reqRemoverUser(userId);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: "删除成功"
        })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}

const selectionChange = (value: any) => {
    selectIdArr.value = value
}
const deleteSelectUser = async () => {
    let idList: any = selectIdArr.value.map((item: any) => {
        return item.id
    })
    let result: any = await reqSelectUser(idList)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: "删除成功"
        })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}

const search = () => {
    getHasUser();
    keyword.value = ''
}
//重置
const reset = () => {
    settingStory.refresh = !settingStory.refresh
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>