import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '@/router/config'
import { beforeEachHandler, afterEachHandler } from '@/router/config'
import {upgradeRouter} from 'happykit'
import happyFramework from '@/framework'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})

router.beforeEach(beforeEachHandler)
router.afterEach(afterEachHandler)
const happyKitRouter = upgradeRouter(happyFramework,router as any)
export default happyKitRouter
