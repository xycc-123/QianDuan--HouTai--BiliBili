//用户管理信息
import request from "@/utils/request";

enum API {
    //获得用户信息
    GETUSERINFO_URL = '/admin/acl/user/',
    //新增用户信息
    ADDUSER_URL = '/admin/acl/user/save',
    //修改用户信息
    UPDATEUSER_URL = '/admin/acl/user/update',
    //获取用户角色信息
    TOASSIGN_URL = '/admin/acl/user/toAssign/',
    //分配角色
    SETROLE_URL = '/admin/acl/user/doAssignRole',
    //删除角色
    DELETEUSER_URL = '/admin/acl/user/remove/',
    //批量删除
    DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}

export const reqgetUser = (page: number, limit: number, username: string) => request.get<any, any>(API.GETUSERINFO_URL + `${page}/${limit}/?username=${username}`)
export const reqAddOrUpdateUser = (data: any) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data);
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data);
    }
}
export const reqtoAssign = (userId: number) => request.get<any, any>(API.TOASSIGN_URL + userId)
export const reqSetUserRole = (data: any) => request.post(API.SETROLE_URL, data)
export const reqRemoverUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId)
export const reqSelectUser = (idList: number[]) => request.delete(API.DELETEALLUSER_URL, { data: idList })