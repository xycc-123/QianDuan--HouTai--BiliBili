//角色模块接口
import request from "@/utils/request";
import { reqAddOrupdateAttr } from './../../product/attr/intex';

enum API {
    //获取职位
    ALLROLELIST_URL = '/admin/acl/role/',
    //新增职位
    ADDROLE_URL = '/admin/acl/role/save',
    //更新职位
    UPDATEROLE_URL = '/admin/acl/role/update',
    //获取全部菜单与按钮
    ALLPERMISSION = '/admin/acl/permission/toAssign/',
    //分配权限
    SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
    //删除职位
    REMOVEROLE_URL = '/admin/acl/role/remove/'
}

export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, any>(API.ALLROLELIST_URL + `${page}/${limit}/?roleName=${roleName}`)
export const reqAddOrUpdateRole = (data: any) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATEROLE_URL, data);
    } else {
        return request.post<any, any>(API.ADDROLE_URL, data)
    }
}
export const reqAllMenuList = (roleId: number) => request.get<any, any>(API.ALLPERMISSION + roleId)
export const reqSetPermisstion = (roleId: number, permissionId: number[]) => request.post(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
export const reqRemoveRole = (roleId: number) => request.delete(API.REMOVEROLE_URL + roleId)