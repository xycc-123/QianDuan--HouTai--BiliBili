//商品分类全局组件小仓库
import { reqC1, reqC2, reqC3 } from "@/api/product/attr/intex";
import { defineStore } from "pinia";
import type { CategoryResponseData } from './../../api/product/attr/type';
import type { CategoryState } from "./types/type";
let useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            //存储一级分类数据
            c1Arr: [],
            c1Id: '',
            //一级分类对应的二级分类数据
            c2Arr: [],
            c2Id: '',
            //二级分类对应的三级分类数据
            c3Arr: [],
            c3Id: '',
        }
    },
    actions: {
        //获取一级分类方法
        async getC1() {
            let result: CategoryResponseData = await reqC1();
            if (result.code == 200) {
                this.c1Arr = result.data;
            } else {

            }
        },
        async getC2() {
            let result: CategoryResponseData = await reqC2(this.c1Id)
            if (result.code == 200) {
                this.c2Arr = result.data;
            } else {

            }
        },
        async getC3() {
            let result: CategoryResponseData = await reqC3(this.c2Id)
            if (result.code == 200) {
                this.c3Arr = result.data;
            } else {

            }
        },
    },
    getters: {

    }
})

export default useCategoryStore;