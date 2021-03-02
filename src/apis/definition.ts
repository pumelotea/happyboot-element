import { $get, $post, $put, $delete, $download } from '@/apis/index'

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
  userlist() {
    return $get('/sys/user/userlist')
  },
  querySecurityLog(params: any) {
    return $get('/sys/user/querySecurityLog', params)
  },
  queryOnlineList(userId: string) {
    return $get('/sys/user/queryOnlineList', { userId })
  },
  userOffline(token: string) {
    return $post('/sys/user/offline', { token })
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
  },
  //角色列表
  roleList() {
    return $get('/sys/role/list')
  },
  //角色列表分页查询
  rolePage(params: any) {
    return $get('/sys/role/page', params)
  },
  //角色详情
  roleGet(id: any) {
    return $get('/sys/role/get', { id: id })
  },
  //角色新增
  roleAdd(role: any) {
    return $post('/sys/role/add', role)
  },
  //角色修改
  roleEdit(role: any) {
    return $post('/sys/role/update', role)
  },
  //角色删除
  roleDelete(ids: any) {
    return $delete('/sys/role/delete?ids=' + ids)
  },
  //角色菜单授权
  roleMenuEmpower(params: any) {
    return $post('/sys/role/saveRolePermission', params)
  },
  //角色已关联的菜单
  getRoleMenuPower(params: any) {
    return $get('/sys/permission/queryIdsByRoleIdAndTypeAndModule', {
      module: 'admin',
      ...params
    })
  },
  //主体管理列表
  subjectPage(searchQuery: any) {
    return $get('/sys/subject/page', searchQuery)
  },
  //主体管理新增
  subjectAdd(params: any) {
    return $post('/sys/subject/add', params)
  },
  //主体管理编辑
  subjectEdit(params: any) {
    return $post('/sys/subject/update', params)
  },
  //主体管理删除
  subjectDelete(ids: any) {
    return $delete('/sys/subject/delete?ids=' + ids)
  },
  //主体信息
  subjectGet(id: any) {
    return $get('/sys/subject/get', { id })
  },
  //新增对象与区域关联（1 - n）
  saveObjRegion(params: any) {
    return $post('/sys/obj/saveObjRegion', params)
  },
  //通过对象ID查询区域ID集合
  queryIdsByObjId(objId: any) {
    return $get('/sys/deptRegion/queryIdsByObjId', { objId })
  },
  //懒加载获取区域树节点
  getDeptRegionTreeByParentId(id: any) {
    return $get('/sys/deptRegion/queryTreeByParentId', { parentId: id })
  },
  // 获取区域树节点数据
  getDeptRegionTreeNodeData(id: any) {
    return $get('/sys/deptRegion/get', { id: id })
  },
  //变更区域节点
  modifyDeptRegionNode(params: any) {
    return $post('/sys/deptRegion/modifyNode', params)
  },
  //新增区域节点
  addDeptRegionNode(params: any) {
    return $post('/sys/deptRegion/add', params)
  },
  //编辑区域节点
  editDeptRegionNode(params: any) {
    return $post('/sys/deptRegion/update', params)
  },
  //删除区域节点
  deleteDeptRegionNode(id: any) {
    return $delete('/sys/deptRegion/delete?ids=' + id)
  },
  //系统配置-----------------start
  configPage(params: any) {
    return $get('/sys/config/page', params)
  },
  configGet(id: any) {
    return $get('/sys/config/get', { id })
  },
  configAdd(params: any) {
    return $post('/sys/config/add', params)
  },
  configEdit(params: any) {
    return $put('/sys/config/update', params)
  },
  configDelete(ids: any) {
    return $delete('/sys/config/delete?ids=' + ids)
  },
  //系统配置-----------------end
  //获取菜单节点数据
  getMenuTreeNode(id: any) {
    return $get('/sys/permission/get', { id })
  },
  //新增菜单
  addMenuTree(params: any) {
    return $post('/sys/permission/menu/add', params)
  },
  //编辑菜单
  editMenuTree(params: any) {
    return $post('/sys/permission/menu/update', params)
  },
  //删除菜单
  deleteMenuTree(id: any) {
    return $delete('/sys/permission/delete?ids=' + id)
  },
  //移动菜单节点
  modifyMenuNode(params: any) {
    return $post('/sys/permission/modifyNode', params)
  },
  //文件列表
  filePage(params: any) {
    return $get('/sys/file/page', params)
  },
  //操作日志分页
  logPage(params: any) {
    return $get('/sys/log/page', params)
  },
  //上传文件
  uploadFile(file: any) {
    const f = new FormData()
    f.append('file', file)
    return $post('/sys/file/uploadFile', f)
  },
  //文件批量上传
  uploadFiles(files: any) {
    const f = new FormData()
    files.forEach((file: any) => {
      f.append('file', file)
    })
    return $post('/sys/file/uploadFiles', f)
  },
  //app版本管理-----------------begin
  //列表查询
  getApp(params: any) {
    return $get('/sys/update/page', params)
  },
  //删除
  deleteApp(ids: any) {
    return $delete('/sys/update/delete?ids=' + ids)
  },
  //新增
  addApp(params: any) {
    return $post('/sys/update/add', params)
  },
  //app版本管理-----------------end
  //下载文件
  download(fileId: string){
    return $download(`/sys/file/download/${fileId}`)
  },
  //一次性加载部门树
  getDeptTree() {
    return $get('/sys/deptObj/tree')
  },
  //懒加载获取部门树节点
  getDeptTreeByParentId(id: any) {
    return $get('/sys/deptObj/queryTreeByParentId', { parentId: id })
  },
  // 获取部门树节点数据
  getDeptTreeNodeData(id: any) {
    return $get('/sys/deptObj/get', { id: id })
  },
  //变更部门节点
  modifyDeptNode(params: any) {
    return $post('/sys/deptObj/modifyNode', params)
  },
  //新增部门节点
  addDeptNode(params: any) {
    return $post('/sys/deptObj/add', params)
  },
  //编辑部门节点
  editDeptNode(params: any) {
    return $post('/sys/deptObj/update', params)
  },
  //删除部门节点
  deleteDeptNode(id: any) {
    return $delete('/sys/deptObj/delete?ids=' + id)
  },
  //功能点-------------------begin
  facilityPage(params: any) {
    return $get('/sys/facility/page', params)
  },
  facilityAdd(params: any) {
    return $post('/sys/facility/add', params)
  },
  facilityEdit(params: any) {
    return $put('/sys/facility/update', params)
  },
  facilityDelete(ids: any) {
    return $delete('/sys/facility/delete?ids=' + ids)
  },
  facilityParamSet(params: any) {
    return $post('/sys/facility/setParam', params)
  },
  facilityParamDelete(id: any) {
    return $delete('/sys/facility/deleteParam?facilityParamId=' + id)
  },
  facilityParamGet(id: any, setFrom: any, facilityGroupId: any, userId: any) {
    return $get('/sys/facility/getParam', {
      id,
      setFrom,
      facilityGroupId,
      userId
    })
  },
  queryFacilityByUser(userId: any) {
    return $get('/sys/facility/queryFacilityByUser', { userId })
  },
  //功能点-------------------end
  //功能组-------------------begin
  facilityGroupPage(params: any) {
    return $get('/sys/facilityGroup/page', params)
  },
  facilityGroupAdd(params: any) {
    return $post('/sys/facilityGroup/add', params)
  },
  facilityGroupEdit(params: any) {
    return $put('/sys/facilityGroup/update', params)
  },
  facilityGroupDelete(ids: any) {
    return $delete('/sys/facilityGroup/delete?ids=' + ids)
  },
  facilityGroupList() {
    return $get('/sys/facilityGroup/list')
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
  queryFacilityByGroup(facilityGroupId: any) {
    return $get('/sys/facilityGroup/queryFacilityByGroup', { facilityGroupId })
  },
  saveFacilityGroupRel(facilityGroupId: any, facilityIds: any) {
    return $post('/sys/facilityGroup/saveFacilityGroupRel', {
      facilityGroupId,
      facilityIds
    })
  },
  //功能组-------------------end
  //轮播图-----------------begin
  //列表查询
  getBanner(params: any) {
    return $get('/op/banner/page', params)
  },
  //详情
  detailBanner(id: any) {
    return $get('/op/banner/get', { id: id })
  },
  //删除
  deleteBanner(ids: any) {
    return $delete('/op/banner/delete?ids=' + ids)
  },
  //新增
  addBanner(params: any) {
    return $post('/op/banner/add', params)
  },
  //修改
  editBanner(params: any) {
    return $put('/op/banner/update', params)
  },
  //轮播图-----------------end
  //知识库-----------------begin
  //列表查询
  getKnowledge(params: any) {
    return $get('/op/knowledge/page', params)
  },
  //详情
  detailKnowledge(id: any) {
    return $get('/op/knowledge/get', { id: id })
  },
  //删除
  deleteKnowledge(ids: any) {
    return $delete('/op/knowledge/delete?ids=' + ids)
  },
  //新增
  addKnowledge(params: any) {
    return $post('/op/knowledge/add', params)
  },
  //修改
  editKnowledge(params: any) {
    return $put('/op/knowledge/update', params)
  },
  //知识库-----------------end
  //图片批量上传
  uploadImagesV2(imageFiles: string[]) {
    const f = new FormData()
    imageFiles.forEach(imageFile => {
      f.append('file', imageFile)
    })
    return $post('/sys/file/uploadImgs', f)
  },
  logout(){
    return $post('/logout')
  }
}
export default apiDefinition
