<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hellow</h1>
                    <h2>狂拽猪少&优选好物</h2>
                    <el-form-item prop='username'>
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop='password'>
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" size="default"
                            @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12" :xs="0"></el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { ElNotification } from 'element-plus';
//引入获取时间的函数
import { getTime } from '@/utils/time';
//引入仓库
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
let useStore = useUserStore()
//获取路由器
let $router = useRouter()

let $route = useRoute()
//变量控制按钮加载效果
let loading = ref(false)
//收集账号与密码的数据
let loginForm = reactive({ username: '', password: '' })
let loginForms = ref()
//登录按钮回调
const login = async () => {
    //保证表单校验通过后再发请求
    await loginForms.value.validate();
    //开始加载
    loading.value = true
    //点击登陆后
    //通知仓库发登录请求
    //请求成功->首页
    //请求失败->弹出失败信息
    try {
        //保证登录成功
        await useStore.userLogin(loginForm);
        //编程时导航
        //判断登录成功时是否有query参数
        // let redriect: any = $route.query.redirect;
        // $router.push({ path: redriect || '/' });
        $router.push('/');
        //成功信息
        ElNotification({
            type: 'success',
            message: '登录成功',
            // title:'HI,'+getTime()+'好'
            title: `HI,${getTime()}好`
        });
        loading.value = false;
    } catch (error) {
        //停止加载
        loading.value = false;
        //失败的提示信息
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    }

}

//自定义校验规则函数
const validatorUsername = (rule: any, value: any, callback: any) => {
    //rule为表单校验规则对象
    //value为表单元素文本内容
    //函数：如果符合函数callback放行
    //不符合，注入错误提示信息
    if (value.length >= 5) {
        callback();
    } else {
        callback(new Error('账号长度至少五位'))
    }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
    if (value.length >= 6) {
        callback();
    } else {
        callback(new Error('密码长度至少六位'))
    }
}

//定义表单规则需要配置对象
const rules = {
    username: [
        //requried代表务必要检验，min最小长度，max最大长度，message错误信息，trigger触发校验时机
        { trigger: 'change', validator: validatorUsername }
    ],
    password: [
        { trigger: 'change', validator: validatorPassword }
    ]
}

</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
}

.login_form {
    margin-left: 10px;
    position: relative;
    width: 80%;
    height: 50vh;
    top: 45vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    border-radius: 20px;
    opacity: 0.8598;
    padding: 40px;
}

h1 {
    color: rgb(232, 33, 80);
    font-size: 40px;
}

h2 {
    color: rgb(224, 107, 218);
    margin: 20px 0px;
}

.login_btn {
    width: 100%;
}
</style>