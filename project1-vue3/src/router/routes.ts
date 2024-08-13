//对外暴露配置路由
//常量路由
export const constantRoute = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login',
        meta: {
            title: '登录',//菜单标题
            hidden: true,//路由标题在菜单中是否隐藏
            icon: 'Promotion'//支持element-plus全部图标
        }
    },
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',
        meta: {
            title: '',//菜单标题
            hidden: false,
            icon: ''
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',//菜单标题
                    hidden: false,
                    icon: 'HomeFilled'
                },
            },
        ]
    },
    {
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',//菜单标题
            hidden: true,
            icon: 'CircleCloseFilled'
        },
    },
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'Screen',
        meta: {
            title: '数据大屏',//菜单标题
            hidden: false,
            icon: 'HelpFilled'
        }
    },

]


//异步路由
export const asyncRoute = [
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',
        meta: {
            title: '权限管理',//菜单标题
            hidden: false,
            icon: 'Lock'
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',//菜单标题
                    hidden: false,
                    icon: 'User'
                }
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',//菜单标题
                    hidden: false,
                    icon: 'UserFilled'
                }
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',//菜单标题
                    hidden: false,
                    icon: 'TakeawayBox'
                }
            },
        ]
    },
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',//菜单标题
            hidden: false,
            icon: 'Goods'
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',//菜单标题
                    hidden: false,
                    icon: 'Document'
                }
            },
            {
                path: '/product/attr',
                component: () => import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',//菜单标题
                    hidden: false,
                    icon: 'Histogram'
                }
            },
            {
                path: '/product/spu',
                component: () => import('@/views/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',//菜单标题
                    hidden: false,
                    icon: 'Expand'
                }
            },
            {
                path: '/product/sku',
                component: () => import('@/views/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU管理',//菜单标题
                    hidden: false,
                    icon: 'Orange'
                }
            },
        ]
    },
]

//任意路由
export const anyRoute = {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',//菜单标题
        hidden: true,
        icon: 'CircleCloseFilled'
    },
}