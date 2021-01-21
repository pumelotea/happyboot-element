import {
  createEmptyMenuItem,
  createHappyFramework,
  HappyKitFramework,
  LinkTarget,
  MenuAdapter,
  MenuItem,
  MenuType
} from 'happykit'
import { getCurrentInstance } from 'vue'
import { uuid, deepClone } from 'happykit/lib/utils'


function createMenuAdapter(): MenuAdapter<MenuItem> {
  return {
    convert(menuTree: any) {
      const routeMappingList: MenuItem[] = []
      const menuIdMappingMap = new Map<string, MenuItem>()
      const menuTreeConverted: MenuItem[] = []

      const menuTypeMap: any = {
        menu: MenuType.MENU,
        button: MenuType.POINT
      }

      const linkTargetMap: any = {
        _tab: LinkTarget.TAB,
        _self: LinkTarget.SELF,
        _blank: LinkTarget.BLANK
      }

      const forEachTree = (tree: any[], pNode?: MenuItem) => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < tree.length; i++) {
          // 创建新的节点
          const treeNode = createEmptyMenuItem()
          treeNode.menuId = uuid()
          treeNode.name = tree[i].name || ''
          treeNode.path = tree[i].path || ''
          treeNode.icon = tree[i].icon || ''
          treeNode.view = tree[i].view || ''
          treeNode.isRouter = tree[i].router || false
          treeNode.isKeepalive = tree[i].keepalive || false
          treeNode.type = menuTypeMap[tree[i].type] || MenuType.MENU
          treeNode.externalLink = tree[i].externalLink || false
          treeNode.linkTarget = linkTargetMap[tree[i].externalLink] || LinkTarget.TAB
          treeNode.externalLinkAddress = tree[i].externalLinkAddress || ''
          treeNode.hide = tree[i].hide || false
          treeNode.isHome = tree[i].home || false
          treeNode.permissionKey = tree[i].permissionKey || ''
          if (!pNode) {
            pNode = createEmptyMenuItem()
            menuTreeConverted.push(pNode)
          }
          pNode.children.push(treeNode)
          // 拼接路由
          treeNode.routerPath = pNode.routerPath + treeNode.path
          // 预先生成菜单节点路径
          const tmpNode = deepClone(treeNode) as MenuItem
          tmpNode.children = []
          tmpNode.menuPath = []
          tmpNode.breadcrumb = []
          treeNode.menuPath = [...pNode.menuPath, tmpNode]
          // breadcrumb
          treeNode.breadcrumb = [...pNode.breadcrumb, tmpNode]

          // 记录id映射表
          menuIdMappingMap.set(treeNode.menuId, treeNode)

          if (treeNode.type === MenuType.MENU) {
            if (!treeNode.isRouter) {
              forEachTree(tree[i].children, treeNode)
            } else {
              // 收集权限点
              tree[i].children.forEach((e: any) => {
                const pointNode = createEmptyMenuItem()
                pointNode.menuId = uuid()
                pointNode.name = e.name || ''
                pointNode.path = e.path || ''
                pointNode.view = e.view || ''
                pointNode.isRouter = e.router || false
                pointNode.isKeepalive = e.keepalive || false
                pointNode.type = menuTypeMap[e.type] || MenuType.POINT
                pointNode.externalLink = e.externalLink || false
                pointNode.linkTarget = linkTargetMap[e.externalLink] || LinkTarget.TAB
                pointNode.externalLinkAddress = e.externalLinkAddress || ''
                pointNode.hide = e.hide || false
                pointNode.isHome = e.isHome || false
                pointNode.permissionKey = e.permissionKey || ''
                treeNode.pointList.push(pointNode)
                treeNode.pointsMap.set(pointNode.permissionKey, pointNode)
              })
              if (!treeNode.externalLink || (treeNode.externalLink && treeNode.linkTarget === LinkTarget.TAB)) {
                routeMappingList.push(treeNode)
              }
            }
          }
        }
      }
      forEachTree(menuTree as any[])
      return {
        routeMappingList,
        menuTreeConverted: menuTreeConverted[0]?.children || [],
        menuIdMappingMap
      }
    }
  }
}

//创建框架实例
const happyFramework = createHappyFramework({
  menuAdapter: createMenuAdapter()
})


export function getHappykitInstance(): HappyKitFramework {
  const self = getCurrentInstance()
  const ctx = (self as any).ctx
  return ctx.$happykit as HappyKitFramework
}


export default happyFramework


