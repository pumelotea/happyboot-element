// eslint-disable-next-line no-unused-vars
import { $get, $post, $put, $delete } from '@/apis/index'

const apiDefinition = {
  login(username: string, password: string, captchaId: string, captchaCode: string) {
    return $post('/login', { username, password, captchaId, captchaCode })
  },
  getKaptcha() {
    return $get('/kaptcha')
  },
  selectLogin(userId: string) {
    return $post('/sys/user/selectLogin', { userId })
  },
  //查询关联账号列表
  userlist(){
    return $get('/sys/user/userlist')
  },
  getMenuTree() {
    return $get('/sys/permission/tree', { module: 'admin' })
  },
  getAuthMenuTree() {
    return $get('/sys/auth/permission/tree?module=admin&neTypes=action')
  },
  //上传blob
  //用于图片裁剪，生成的图片二进制数据
  //会自动包装为文件
  uploadImage(imageFile: any) {
    const f = new FormData()
    const file = new File([imageFile], `${new Date().getTime()}.png`)
    f.append('file', file)
    return $post('/sys/file/uploadImg', f)
  },
  //用户新增
  userAdd(params: any) {
    return $post('/sys/user/add', params)
  },
  //用户详情
  userGet(id: string) {
    return $get('/sys/user/get', { id: id })
  },
  //用户修改
  userEdit(params: any) {
    return $post('/sys/user/update', params)
  },
  //用户删除
  userDelete(ids: any) {
    return $delete('/sys/user/delete?ids=' + ids)
  },
  //更新用户状态
  userStatus(ids: any, status: any) {
    return $post('/sys/user/updateStatus', { ids, status })
  },
  //更新用户密码
  userPwd(params: any) {
    return $post('/sys/user/updatePwd', params)
  },
  //搜索主账号列表
  queryMainAccountList(keyword: any) {
    return $get('/sys/user/queryMainAccountList', { keyword })
  },
  //用户分页列表
  userPage(searchQuery: any) {
    return $get('/sys/user/page', searchQuery)
  },
  //角色列表
  roleList() {
    return $get('/sys/role/list')
  },
  //用户角色关联保存
  saveUserRole(userId: any, roleIds: any, authType: any) {
    return $post('/sys/user/saveUserRole', {
      userId: userId,
      roleIds: roleIds,
      authType: authType
    })
  },
  //通过多个code查询item
  dictItemsMap(dictCodes: any) {
    return $get('/sys/dict/dictItemsMap/' + dictCodes)
  },
  facilityGroupList() {
    return $get('/sys/facilityGroup/list')
  },
  facilityParamDelete(id: any) {
    return $delete('/sys/facility/deleteParam?facilityParamId=' + id)
  },
  facilityParamSet(params: any) {
    return $post('/sys/facility/setParam', params)
  },
  facilityParamGet(id: any, setFrom: any, facilityGroupId: any, userId: any) {
    return $get('/sys/facility/getParam', {
      id,
      setFrom,
      facilityGroupId,
      userId
    })
  },
  saveUserFacilityGroupRel(userId: any, facilityGroupIds: any) {
    return $post('/sys/user/saveUserFacilityGroupRel', {
      userId,
      facilityGroupIds
    })
  },
  queryFacilityGroupByUser(userId: any) {
    return $get('/sys/facilityGroup/queryFacilityGroupByUser', { userId })
  },
  queryFacilityByUser(userId: any) {
    return $get('/sys/facility/queryFacilityByUser', { userId })
  },
  //用户部门关联保存
  userDeptEmpower(params: any) {
    return $post('/sys/user/saveUserDeptObj', params)
  },
  //用户已关联的部门
  getUserDeptPower(userId: any) {
    return $get('/sys/user/queryDeptId', { userId })
  },
  //用户区域关联保存
  userRegionEmpower(params: any) {
    return $post('/sys/user/saveUserDeptRegion', params)
  },
  //用户已关联的区域
  getUseRegionPower(userId: any) {
    return $get('/sys/deptRegion/queryIdsByUserId', { userId })
  },
  //一次性加载部门树
  getDeptTree() {
    return $get('/sys/deptObj/tree')
  },
  //一次性加载区域树
  getRegionTree() {
    return $get('/sys/deptRegion/tree')
  },
  //通过用户、授权类型查询角色ID集合
  queryIdsByUserIdAndType(userId: any, authType: any) {
    return $get('/sys/role/queryIdsByUserIdAndAuthType', { userId, authType })
  },
  //字典分页查询
  dictPage(searchQuery: any) {
    return $get('/sys/dict/page', searchQuery)
  },
  //字典单个查询
  dictGet(id: any) {
    return $get('/sys/dict/get', { id })
  },
  //字典新增
  dictAdd(params: any) {
    return $post('/sys/dict/add', params)
  },
  //字典修改
  dictEdit(params: any) {
    return $post('/sys/dict/update', params)
  },
  //字典删除
  dictDelete(ids: any) {
    return $delete('/sys/dict/delete?ids=' + ids)
  },
  //字典项分页列表
  dictItemPage(searchQuery: any) {
    return $get('/sys/dictItem/page', searchQuery)
  },
  //字典项查询
  dictItemGet(id: any) {
    return $get('/sys/dictItem/get', { id: id })
  },
  //字典项新增
  dictItemAdd(params: any) {
    return $post('/sys/dictItem/add', params)
  },
  //字典项修改
  dictItemEdit(params: any) {
    return $post('/sys/dictItem/update', params)
  },
  //字典项删除
  dictItemDelete(ids: any) {
    return $delete('/sys/dictItem/delete?ids=' + ids)
  }
}
export default apiDefinition
