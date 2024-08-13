//封装本地存储存储数据和读取数据的方法
export const SET_TOKEN = (token: string) => {
    localStorage.setItem('TOKEN', token);
}

export const GET_TOKEN = () => {
    return localStorage.getItem('TOKEN');
}

//退出删除数据
export const REMOVE_TOKEN = () => {
    localStorage.removeItem('TOKEN');
}