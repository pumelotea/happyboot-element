import { createHappyFramework, HappyKitFramework } from 'happykit'
import { getCurrentInstance } from 'vue'

//创建框架实例
const happyFramework = createHappyFramework()


export function getHappykitInstance():HappyKitFramework{
  const self = getCurrentInstance()
  const ctx = (self as any).ctx
  return ctx.$happykit as HappyKitFramework
}


export default happyFramework


