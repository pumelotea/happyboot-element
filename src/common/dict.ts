import { onMounted, reactive } from 'vue'
import { self } from '@/common/index'

declare interface DictItem {
  label: string,
  value: string
}

declare interface DictMappings {
  [value: string]: string
}


declare interface Dict {
  options: DictItem[]
  mappings: DictMappings
}

declare interface DataDict {
  [dictName: string]: Dict
}


export function loadDict(dictCode: string[], loadManually = false) {
  const context = self()
  const dataDict: DataDict = reactive({})
  const initDict = async () => {
    const res = await context.$api.dictItemsMap(dictCode.join(','))
    if (res.code === 0) {
      Object.keys(res.data).forEach(key => {
        dataDict[key] = {
          options: [],
          mappings: {}
        }
        dataDict[key].options = res.data[key]
        res.data[key].forEach((item: DictItem) => {
          dataDict[key].mappings[item.value] = item.label
        })
      })
    } else {
      context.$notify({
        type: 'error',
        title: '提示',
        message: res.msg
      })
    }
  }

  if (!loadManually){
    onMounted(async () => {
      await initDict()
    })
  }

  return {
    dataDict,
    dictRefresh: initDict
  }
}
