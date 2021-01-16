import { createHappySecurity, HappyKitFramework, HappyKitSecurity } from 'happykit'
import { getCurrentInstance } from 'vue'

const security = createHappySecurity()

export function getSecurityInstance():HappyKitSecurity{
  const self = getCurrentInstance()
  const ctx = (self as any).ctx
  return ctx.$security as HappyKitSecurity
}


export default security
