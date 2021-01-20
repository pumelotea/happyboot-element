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
  userlist(){
    return $get('/sys/user/userlist')
  },
  getMenuTree() {
    return $get('/sys/permission/tree', { module: 'admin' })
  },
  getAuthMenuTree() {
    return $get('/sys/auth/permission/tree?module=admin&neTypes=action')
  }
}
export default apiDefinition
