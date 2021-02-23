import { self } from '@/common/index'

declare interface DrawerLoader {
  (ref: string): any
}

export function drawerLoader(): DrawerLoader {
  const context = self()
  return (ref: string): any => {
    return context.$refs[ref]
  }
}
