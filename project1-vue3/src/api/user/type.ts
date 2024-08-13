//登录接口需要携带的参数ts类型
export interface LoginFormData {
    username: string,
    password: string
}

//全部接口返回都有的ts类型
export interface ResponseDate {
    code: number,
    message: string,
    ok: boolean,
}

//登录接口返回数据类型
export interface loginResponseDate extends ResponseDate {
    data: string,
}

//用户接口返回用户相关信息的数据类型
export interface userInfoResponseDate extends ResponseDate {
    data: {
        routes: string[],
        buttons: string[],
        roles: string[],
        name: string,
        avatar: string
    }
}

