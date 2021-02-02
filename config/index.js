window.api = {
  dev: {
    server: 'http://10.10.0.27:6630/system'
    // server: 'http://www.jpldx.com:6630/system'
  },
  prod: {
    server: 'https://www.jpldx.com:8443/system-api/'
  },
  test: {
    server: 'http://10.10.0.27:6630/system'
  }
}

/**
 * 必须保持path唯一
 */
window.colorSchemes = [
  {
    name: '默认',
    path: 'default',
    primaryColor: '#409EFF'
  },
  {
    name: '魅惑紫',
    path: 'theme1',
    primaryColor: '#651DF5'
  },
  {
    name: '桃花红',
    path: 'theme2',
    primaryColor: '#FF40B6'
  },
  {
    name: '高冷蓝',
    path: 'theme3',
    primaryColor: '#0116FF'
  }
]

/**
 * preview 预览图片
 * menuMode 只能取 vertical 或者 horizontal
 * layout 取决于实现了多少布局组件
 */
window.layouts = [
  {
    preview: 'themes/layout/layout-v.svg',
    layout: 'MainLayout',
    menuMode: 'vertical'
  },
  {
    preview: 'themes/layout/layout-h.svg',
    layout: 'MainLayoutHorizontal',
    menuMode: 'horizontal'
  },
  {
    preview: 'themes/layout/layout-v.svg',
    layout: 'MainLayoutWithLeftBar',
    menuMode: 'vertical'
  }
]
