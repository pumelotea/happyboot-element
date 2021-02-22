<template>
  <hb-page-layout-full v-loading="loading" style="padding: 0">
    <div class="message" v-if="detail">
      <div
        class="poster"
        :style="'background: url('+imgId2Url(detail.imageArr[0])+') no-repeat;'" >
        <div class="post-head-content">
          <div style="margin: auto">
            <h1 class="title">{{ detail.title }}</h1>
            <div class="meta">
              <div class="type">{{ labelMap[detail.label] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content post-content"
        v-highlight
        v-html="detail.content"
      ></div>
    </div>
    <div class="no-data" v-if="!loading && !detail"></div>
  </hb-page-layout-full>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { self } from '@/common'

export default defineComponent ({
  name: 'index',
  setup() {
    const context = self()

    const loading = ref(false)
    const detail: any = ref(null)
    const labelMap: any = ref({})

    let knowledgeId = computed(() => {
      return context.$route.query.knowledgeId || ''
    })

    const getDict = async () => {
      const res: any = await context.$api.dictItemsMap('KNOWLEDGE_LABEL')
      if (res.code === 0) {
        res.data.KNOWLEDGE_LABEL.forEach((e: any) => {
          labelMap.value[e.value] = e.label
        })
      }
    }

    const getKnowledgeDetail = async () => {
      const res: any = await context.$api.detailKnowledge(knowledgeId.value)
      if (res.code === 0) {
        detail.value = res.data
      }
      loading.value = false
    }

    const imgId2Url = (url: any) => {
      return context.$api.$imgId2Url(url)
    }

    onMounted(async () => {
      await getDict()
      await getKnowledgeDetail()
    })

    return {
      imgId2Url,
      knowledgeId,
      loading,
      detail,
      labelMap
    }
  }
})
</script>

<style scoped>
.message {
  overflow: auto;
}
.title {
  text-align: center;
  color: white;
}

.meta {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.type,
.author,
.sent-time {
  padding: 0 10px;
  font-size: 14px;
  color: white;
}

.content {
  padding: 30px;
  max-width: 768px;
  margin: auto;
}

.poster {
  height: 400px;
  display: flex;
  background-size: cover !important;
  background-position:center !important;
}
.post-head-content {
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(0, 0, 0, 0.4);
}
</style>
<style>
/*文章样式*/
.post-content {
  word-break: break-all;
  padding: 1.2rem;
  color: slategrey;
}
.post-content p {
  font-weight: 400 !important;
  color: #526f86 !important;
  margin-bottom: 16px;
  line-height: 20px !important;
}

.post-content h1 {
  color: #4b5157 !important;
  margin-bottom: 16px;
}

.post-content h2 {
  border-bottom: 1px solid #c9c9c9;
  margin-bottom: 16px;
  color: #4b5157 !important;
}

.post-content h3 {
  color: #4b5157 !important;
  margin-bottom: 16px;
  position: relative;
  padding-left: 15px;
}

.post-content h3::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 0;
  height: 8px;
  width: 8px;
  border-radius: 20px;
  background-color: #1951fc;
}

.post-content h4 {
  color: #4b5157 !important;
  margin-bottom: 16px;
}

.post-content h5 {
  color: #4b5157 !important;
  margin-bottom: 16px;
}

.post-content ol {
  color: #4b5157 !important;
  margin-bottom: 16px;
}

.post-content ol li {
  margin-bottom: 10px;
}

.post-content blockquote {
  padding: 0.5rem 1.8rem;
  font-size: 1.1rem;
  border-left: 5px solid #1951fc;
  color: #495057;
  background: #edf0f3;
  font-weight: 400;
  margin-bottom: 16px;
}

.post-content blockquote p {
  margin-top: 1rem;
  margin-bottom: 0rem;
}

.post-content ul {
  color: #495057;
  margin-bottom: 16px;
}

.post-content ul li {
  margin-bottom: 10px;
}

.post-content ul li p {
  margin-bottom: 0;
}

.post-content ol li p {
  margin-bottom: 0;
}

.post-content ol li code {
  margin-bottom: 0;
}

.post-content ul li code {
  margin-bottom: 0;
}

.post-content ol li pre {
  margin-bottom: 0;
}

.post-content ul li pre {
  margin-bottom: 0;
}

.post-content strong {
  font-weight: bolder;
}

.post-content p code {
  margin-bottom: 0;
  padding: 0;
  box-shadow: none;
  background-color: #e9ecef;
  overflow: initial !important;
  font-family: Monaco, Monospaced, sans-serif;
  font-size: 13px;
}

.post-content code {
  margin-bottom: 16px;
  padding: 0;
  /*line-height: 30px;*/
  box-shadow: none !important;
  background-color: #e9ecef !important;
  font-family: Monaco, Monospaced, sans-serif;
  font-size: 13px !important;
}

.post-content pre {
  /*background: #292929;*/
  padding: 1rem;
  /*color: #f1f1f1;*/
  border-radius: 3px;
  margin-bottom: 16px;
  background-color: #e9ecef;
  font-family: Monaco, Monospaced, sans-serif;
  font-size: 13px;
}

.post-content img {
  max-width: 100%;
  height: auto;
  margin-bottom: 16px;
}

.post-content a {
  text-decoration-line: none;
}

.post-content a:hover {
  color: #136cfc;
}

.post-content hr {
  margin-bottom: 16px;
}

.post-content table {
  border-collapse: collapse;
  margin: 0 0 1rem;
  word-break: normal;
}

.post-content th,
.post-content td {
  border: 1px solid #eee;
  padding: 8px 12px;
}

.post-content iframe,
embed {
  border: 0;
  display: block;
  overflow: hidden;
}

.post-content figure {
  margin: 0;
}

.post-content video {
  width: 100%;
  margin: auto;
}

.no-data {
  height: 100%;
  background: url('../../../../public/images/404.svg') no-repeat;
  background-position: center;
  background-size: 40% 40%;
}
</style>
