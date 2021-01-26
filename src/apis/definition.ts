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
}
export default apiDefinition
