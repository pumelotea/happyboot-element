import { onMounted, reactive } from 'vue'
import { self } from '@/common/index'

declare interface QueryCondition {
  [propName: string]: any
}

declare interface QueryConditionConfig {
  default:any,
  reset:any,
}

declare interface PageQueryCondition extends QueryCondition {
  pageSize: number
  pageNo: number

  [propName: string]: any
}


declare interface PageData {
  searchCondition: PageQueryCondition
  total: number
  loading: boolean
  selectedRow: any[]
  list: any[]
}

declare type Loader = (data: any) => void
declare type DataAPI = (data: any) => Promise<any>

declare interface PageOption {
  conditions?: {
    [name: string]: QueryConditionConfig
  }
  dataAPI?: DataAPI
  dataLoader?: Loader
  deleteAPI?: DataAPI //该API需要支持多删除
}

export function createPage(options: PageOption) {
  let { conditions, dataLoader, dataAPI,deleteAPI } = options

  const rawData:PageData = {
    searchCondition: {
      pageNo: 1,
      pageSize: 20
    },
    total: 0,
    loading: false,
    selectedRow: [],
    list: []
  }

  if (conditions){
    Object.keys(conditions).forEach(dataKey=>{
      rawData.searchCondition[dataKey] = conditions![dataKey].default
    })
  }

  const pageData = reactive<PageData>(rawData)

  const defaultDataLoader = async () => {
    if (!dataAPI) {
      return
    }
    pageData.loading = true
    const res: any = await dataAPI(pageData.searchCondition)
    if (res.code === 0) {
      pageData.list = res.data.records
      pageData.total = Number(res.data.total)
    }
    pageData.loading = false
  }

  if (!dataLoader) {
    dataLoader = defaultDataLoader
  }

  const pageSizeChange = (pageSize: number) => {
    pageData.searchCondition.pageSize = pageSize
    pageData.searchCondition.pageNo = 1
    dataLoader && dataLoader(pageData.searchCondition)
  }

  const pageNoChange = (pageNo: number) => {
    pageData.searchCondition.pageNo = pageNo
    dataLoader && dataLoader(pageData.searchCondition)
  }

  const pageReset = (queryCondition: QueryCondition) => {
    pageData.searchCondition.pageNo = 1
    pageData.searchCondition.pageSize = 20

    Object.keys(queryCondition).forEach(dataKey => {
      pageData.searchCondition[dataKey] = queryCondition[dataKey]
    })

    dataLoader && dataLoader(pageData.searchCondition)
  }

  const defaultPageReset= () => {
    if (conditions){
      Object.keys(conditions).forEach(dataKey=>{
        pageData.searchCondition[dataKey] = conditions![dataKey].reset
      })
    }
  }

  const pageConditionSearch = () => {
    pageData.searchCondition.pageNo = 1
    dataLoader && dataLoader(pageData.searchCondition)
  }

  const rowSelected = (rows: any[]) => {
    pageData.selectedRow = rows
  }

  onMounted(() => {
    dataLoader && dataLoader(pageData.searchCondition)
  })

  const getSelectIds = (dataKey = 'id', split = ',') => {
    return pageData.selectedRow.map(e => e[dataKey]).join(split)
  }

  const context = self()
  const defaultDeleteHandle = (row: any) => {
    context.$confirm('即将删除该条数据, 是否确认?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteAPI && deleteAPI(row.id).then((res: any) => {
          if (res.code === 0) {
            pageData.searchCondition.pageNo = 1
            dataLoader && dataLoader(pageData.searchCondition)
            context.$notify({
              type: 'success',
              title: '提示',
              message: '删除成功！'
            })
          } else {
            context.$notify({
              type: 'error',
              title: '提示',
              message: res.msg
            })
          }
        })
      })
      .catch(() => {
      })
  }

  const defaultMultiDeleteHandle = () => {
    context.$confirm(
      '即将删除这' + pageData.selectedRow.length + '条数据, 是否确认?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        deleteAPI && deleteAPI(getSelectIds()).then((res: any) => {
          if (res.code === 0) {
            pageData.searchCondition.pageNo = 1
            dataLoader && dataLoader(pageData.searchCondition)
            context.$notify({
              type: 'success',
              title: '提示',
              message: '删除成功！'
            })
          } else {
            context.$notify({
              type: 'error',
              title: '提示',
              message: res.msg
            })
          }
        })
      })
      .catch(() => {
      })
  }

  return {
    pageData,
    pageNoChange,
    pageSizeChange,
    defaultDataLoader,
    pageReset,
    rowSelected,
    pageConditionSearch,
    getSelectIds,
    defaultPageReset,
    defaultDeleteHandle,
    defaultMultiDeleteHandle
  }
}


