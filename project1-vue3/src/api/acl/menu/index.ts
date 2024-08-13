import request from "@/utils/request"

enum API {
    //获取菜单
    ALLPERMISSION_URL = '/admin/acl/permission',
    //新增菜单
    ADDMENU_URL = '/admin/acl/permission/save',
    //更新菜单
    UPDATE_URL = '/admin/acl/permission/update',
    //删除菜单
    DELETE_URL = '/admin/acl/permission/remove/'
}

export const reqAllPermission = () => request.get<any, any>(API.ALLPERMISSION_URL)
export const reqAddOrUpdateMenu = (data: any) => {
    if (data.id) {
        return request.put<any, any>(API.ADDMENU_URL, data);
    } else {
        return request.post<any, any>(API.UPDATE_URL, data);
    }
}
export const reqDelete = (id: number) => request.delete<any, any>(API.DELETE_URL + id)