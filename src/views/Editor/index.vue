<!-- eslint-disable no-inner-declarations -->
<template>
  <div class="pptist-editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" />
      <div class="layout-content-center">
        <CanvasTool class="center-top" />
        <Canvas class="center-body" :style="{ height: `calc(100% - ${remarkHeight + 40}px)` }" />
        <Remark class="center-bottom" v-model:height="remarkHeight" :style="{ height: `${remarkHeight}px` }" />
      </div>
      <Toolbar class="layout-content-right" />
    </div>
  </div>

  <SelectPanel v-if="showSelectPanel" />
  <SearchPanel v-if="showSearchPanel" />
  <FullscreenSpin :loading="exporting" tip="数据正在加载中..." />
  <Modal :visible="!!dialogForExport" :width="680" @closed="closeExportDialog()">
    <ExportDialog />
  </Modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { getUrlAsBase64, getImageSize } from '@/utils/image'
import { judgeImg, judgeVideo } from '@/utils/common'
import { nanoid } from 'nanoid'
import type { Slide } from '@/types/slides'
import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'
import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Remark from './Remark/index.vue'
import ExportDialog from './ExportDialog/index.vue'
import SelectPanel from './SelectPanel.vue'
import SearchPanel from './SearchPanel.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Modal from '@/components/Modal.vue'
import axios from 'axios'
import md5 from 'js-md5'
import dayjs from 'dayjs'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { dialogForExport, showSelectPanel, showSearchPanel } = storeToRefs(mainStore)
const closeExportDialog = () => mainStore.setDialogForExport('')
const remarkHeight = ref(40)
const exporting = ref(false)
const caseList = ref([] as Slide[])
const literatureList = ref({})

const mainBackground = ref({
  background: '#ffffff',
  fontColor: '#3333',
  fontname: 'Microsoft Yahei',
  colors: ['#bdc8df', '#003fa9', '#f5ba00', '#ff7567', '#7676d9', '#923ffc'],
})
const viceBackground = ref({
  background: '#ffffff',
  fontColor: '#3333',
  fontname: 'Microsoft Yahei',
  colors: ['#bdc8df', '#003fa9', '#f5ba00', '#ff7567', '#7676d9', '#923ffc'],
})
const elementItem = ref({
  type: 'text',
  id: nanoid(10),
  left: 336.9055068836045,
  top: 512.5,
  width: 326.18898623279097,
  height: 50,
  content:
    "<p style='text-align: center;'><strong><span style='font-size: 12px;'>Power by MedInsight</span></strong></p>",
  rotate: 0,
  defaultFontName: 'Microsoft Yahei',
  defaultColor: '#fff',
  vertical: false,
  opacity: 0.4
})
const afterSeries = ref([])
const beforeSeries = ref([])
const opacitySeries = ref([])
type linktype = {
  link: string[],
  text: string,

}
// 通过接口获取数据
const getCaseList = async () => {
  // eslint-disable-next-line prefer-const
  let search = location.search,
    searchArr: string[] = []
  if (!search) return
  searchArr = window.atob(search.split('?')[1].split('=')[0]).split('&')
  searchArr = searchArr.map((item) => item.split('=')[1])
  const userData = { id: searchArr[0], user_id: searchArr[1] }
  const user_id = window.btoa(JSON.stringify(userData))
  const id = md5(searchArr.join(','))
  const departmentList = [
    '神经外科',
    '口腔科',
    '颌面外科',
    '骨科',
    '泌尿外科',
    '普外科',
    '心血管外科',
    '耳鼻喉',
    '头颈科',
    '医学影像科',
    '超声医学科'
  ]
  try {
    exporting.value = true
    const { data } = await axios.get(
      `http://localhost:8080`
    )
    if (data.status !== 1) return

    const {
      after_ct,
      before_ct,
      operating_ct,
      age,
      department,
      diseases,
      final,
      sex,
      t1,
      t2,
      created_at,
      info_surgical,
      literature
    } = data.data
    literatureList.value = literature
    afterSeries.value = after_ct.series
    beforeSeries.value = before_ct.series
    opacitySeries.value = operating_ct.series
    const afterCT = after_ct.series ? Object.keys(after_ct.series) : []
    const beforeCT = before_ct.series ? Object.keys(before_ct.series) : []
    const operatingCT = operating_ct.series ? Object.keys(operating_ct.series) : []
    const dataTime = dayjs.unix(Number(created_at)).format('YYYY-MM-DD')
    const title = dataTime + diseases

    const casedata = [
      {
        id: 'test-slide-1',
        elements: [
          {
            content: `<p><span style='font-size:40px';>${dataTime}</span></p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 68,
            id: 'idnxZx7Mx',
            left: 379.7743036143883,
            lineHeight: 1.2,
            rotate: 0,
            top: 0,
            type: 'text',
            width: 284.62453066332915
          },
          {
            content: `<p><span style='font-size: 18px;'><span style='color: #fff;'>&nbsp;姓名：某某某，性别：${sex === '1' ? '女性' : '男性'}，年龄：${age}岁</span></span></p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 50,
            id: '7stdasdmVP',
            left: 27.636822407970044,
            rotate: 0,
            top: 87.94617280967205,
            type: 'text',
            width: 972.36317759203
          },
          {
            content: `<p >科室：${departmentList[Number(department) - 2]}</p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 50,
            id: '6jVPnx_iYA',
            left: 27.636822407970016,
            rotate: 0,
            top: 137.94617280967205,
            type: 'text',
            vertical: false,
            width: 972.36317759203
          },
          {
            content: `<p >病种类型：${diseases}</p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 50,
            id: 't9OxH7Ip9X',
            left: 27.636822407970044,
            rotate: 0,
            top: 187.94617280967205,
            type: 'text',
            vertical: false,
            width: 972.36317759203
          },
          {
            content: `<p>症状与体征：${t1}</p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 50,
            id: 'X8DaF1sUsx',
            left: 27.636822407970044,
            rotate: 0,
            top: 236.25000000000003,
            type: 'text',
            vertical: false,
            width: 972.36317759203
          },
          {
            content: `<p >备注信息：${t2}</p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 50,
            id: 'W5V5Bh_kxx',
            left: 27.636822407970044,
            rotate: 0,
            top: 286.04004014383975,
            type: 'text',
            vertical: false,
            width: 972.36317759203
          },
          {
            content: `<p>最后诊断：${final}</p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 50,
            id: 'wv0sZEdjI_',
            left: 27.636822407970044,
            rotate: 0,
            top: 330.92489621392735,
            type: 'text',
            vertical: false,
            width: 972.36317759203
          },
          {
            type: 'text',
            id: 'w3Uwc2KH50',
            left: 336.9055068836045,
            top: 512.5,
            width: 326.18898623279097,
            height: 50,
            content:
              "<p style='text-align: center;'><strong><span style='font-size: 12px;'>Power by MedInsight</span></strong></p>",
            rotate: 0,
            defaultFontName: 'Microsoft Yahei',
            defaultColor: '#fff',
            vertical: false,
            opacity: 0.4
          }
        ],
        background: mainBackground.value
      },
      {
        id: 'test-slide-2',
        elements: [
          {
            content: `<p style='text-align: center;font-size:24px;'><strong>主诉</strong></p>`,
            defaultColor: '#fff',
            defaultFontName: 'Microsoft Yahei',
            height: 50,
            id: '-6M_qwZtjD',
            left: 416.3016270337922,
            lineHeight: 1,
            rotate: 0,
            top: 0,
            type: 'text',
            vertical: false,
            width: 156.44555694618273
          },
          {
            type: 'text',
            id: 'w3Uwc2KH50',
            left: 336.9055068836045,
            top: 512.5,
            width: 326.18898623279097,
            height: 50,
            content:
              "<p style='text-align: center;'><strong><span style='font-size: 12px;'>Power by MedInsight</span></strong></p>",
            rotate: 0,
            defaultFontName: 'Microsoft Yahei',
            defaultColor: '#fff',
            vertical: false,
            opacity: 0.4
          }
        ],
        background: viceBackground.value
      }
    ]
    caseList.value = casedata
    const surgicalImgList: string[] = []
    const surgicalVideoList: string[] = []
    const beforeText = [
      {
        url: 'http://localhost:8080/avatar/upload/2020/20230913/qJs5uBeTVhok_um8YlWf_nUAMf4WcA6ReUpZ',
        text: '诊断结果'
      },
      {
        url: 'http://localhost:8080/avatar/upload/2020/20230913/qJs5uBeTVhok_um8YlWf_nUAMf4WcA6ReUpZ',
        text: '手术入路设计'
      }
    ]
    const afterText = [
      {
        url: 'http://localhost:8080/avatar/upload/2020/20230913/qJs5uBeTVhok_um8YlWf_nUAMf4WcA6ReUpZ',
        text: '术后情况'
      }
    ]
    const defaultCT = [
      {
        url: 'http://localhost:8080/avatar/upload/2020/20230913/qJs5uBeTVhok_um8YlWf_nUAMf4WcA6ReUpZ',
        text: '术前Dicom'
      }
    ]
    if (beforeCT.length > 0) {
      await Promise.all(
        beforeCT.map(async (item) => {
          await processItem(item, '术前', 'CT')
        })
      )
    }
    else {
      await Promise.all(
        defaultCT.map(async (item) => {
          await processItem(item.url, item.text, 'text')
        })
      )
    }
    if (before_ct.imgs.length > 0) {
      await Promise.all(
        before_ct.imgs.map(async (item: { url: string }) => {
          await processItem(item.url, '术前', 'img')
        })
      )
    }
    await Promise.all(
      beforeText.map(async (item) => {
        await processItem(item.url, item.text, 'text')
      })
    )

    if (info_surgical.length > 0) {
      const videoItem = {
        type: 'video',
        id: 'Fnpda,Zcs4',
        left: 78,
        top: 53,
        width: 830,
        height: 450,
        src: '',
        rotate: 0,
        autoplay: false
      }
      const textItem = {
        type: 'text',
        id: '0yZq-SXaVc',
        left: 279.8612002715319,
        top: -10.61718573866566,
        width: 720.5306633291614,
        height: 62,
        content: `<p style='text-align: center;font-size:24px;'><strong>术中资料</strong></p>`,
        rotate: 0,
        defaultFontName: 'Microsoft Yahei',
        defaultColor: '#fff',
        vertical: false
      }
      info_surgical.forEach((item: { url: string }) => {
        if (judgeImg(item.url)) {
          surgicalImgList.push(item.url)
        }
        if (judgeVideo(item.url)) surgicalVideoList.push(item.url)
      })
      await Promise.all(
        surgicalImgList.map(async (value) => {
          await processItem(value, '术中', 'img')
        })
      )
      surgicalVideoList.map((ele, index) => {
        return caseList.value.push({
          id: `test-slide-${caseList.value.length + 1 + index}`,
          elements: [
            textItem,
            { ...videoItem, src: ele },
            elementItem.value
          ],
          background: viceBackground.value
        })
      })
    }
    else {
      await Promise.all(
        defaultCT.map(async (item) => {
          await processItem(item.url, '术中资料', 'text')
        })
      )
    }
    if (afterCT.length > 0) {
      // 使用 Promise.all 确保所有异步请求完成后再继续
      await Promise.all(
        afterCT.map(async (item) => {
          await processItem(item, '术后', 'CT')
        })
      )
    }
    else {
      await Promise.all(
        defaultCT.map(async (item) => {
          await processItem(item.url, '术后Dicom', 'text')
        })
      )
    }
    if (after_ct.imgs.length > 0) {
      await Promise.all(
        before_ct.imgs.map(async (item: { url: string }) => {
          await processItem(item.url, '术后', 'img')
        })
      )
    }
    await Promise.all(
      afterText.map(async (item) => {
        await processItem(item.url, item.text, 'text')
      })
    )
    if (operatingCT.length > 0) {
      // 使用 Promise.all 确保所有异步请求完成后再继续
      await Promise.all(
        operatingCT.map(async (item) => {
          await processItem(item, '随访', 'CT')
        })
      )
    }
    else {
      await Promise.all(
        defaultCT.map(async (item) => {
          await processItem(item.url, '随访', 'text')
        })
      )
    }
    if (operating_ct.imgs.length > 0) {
      await Promise.all(
        operating_ct.imgs.map(async (item: { url: string }) => {
          await processItem(item.url, '随访', 'img')
        })
      )
    }
    await Promise.all(
      afterText.map(async (item) => {
        await processItem(item.url, '相关文献', 'text')
      })
    )
    slidesStore.setTitle(title)
    document.title = title
    slidesStore.setSlides(caseList.value)
    exporting.value = false
  }
  catch (e) {
    console.log(e)
  }
}
const getbaseurl = async () => {
  const bg1 = await getUrlAsBase64('http://localhost:800/ppt/bg_img/6.png')
  const bg2 = await getUrlAsBase64('http://localhost:800/ppt/bg_img/vice4.png')
  mainBackground.value = { type: 'image', color: '#ffffff', imageSize: 'cover', image: bg1 }
  viceBackground.value = { type: 'image', color: '#ffffff', imageSize: 'cover', image: bg2 }
}
getbaseurl()
getCaseList()
// 1.   67,3  ==md5加密
// 2. '[id=67,user_id=3]' base 64 加密
const getLiterature = (data: any) => {
  /**
   * 1.最新文献 left 35 top 32 h 48 32+48 80+10 90
   * 2.系统评价 left 35 top 192
   * 3.指南： left35 top 352
   * 4. 每一条的长度：width:940 height :50 left 48 top:122
   */
  const { Guidelines, Original_studies, Systematic_reviews } = data
  const elements = [{
    content: `<p style="text-align: center;font-size:24px;"><strong>相关文献</strong></p>`,
    defaultColor: '#fff',
    defaultFontName: 'Microsoft Yahei',
    height: 50,
    id: nanoid(10),
    left: 377.3016270337922,
    lineHeight: 1,
    rotate: 0,
    top: 0,
    type: 'text',
    vertical: false,
    width: 205.44555694618273
  },
  {
    content: "<p ><span style='font-size: 16px;'>最新文献：</span></p>",
    defaultColor: '#fff',
    defaultFontName: 'Microsoft Yahei',
    height: 48,
    id: nanoid(10),
    left: 35,
    rotate: 0,
    top: 32,
    type: 'text',
    vertical: false,
    width: 156,
  },
  {
    content: "<p ><span style='font-size: 16px;'>系统评价：</span></p>",
    defaultColor: '#fff',
    defaultFontName: 'Microsoft Yahei',
    height: 48,
    id: nanoid(10),
    left: 32,
    rotate: 0,
    top: 192,
    type: 'text',
    vertical: false,
    width: 156,
  },
  {
    content: "<p ><span style='font-size: 16px;'>指南：</span></p>",
    defaultColor: '#fff',
    defaultFontName: 'Microsoft Yahei',
    height: 48,
    id: nanoid(10),
    left: 32,
    rotate: 0,
    top: 352,
    type: 'text',
    vertical: false,
    width: 156,
  },
  {
    type: 'text',
    id: nanoid(10),
    left: 336.9055068836045,
    top: 512.5,
    width: 326.18898623279097,
    height: 50,
    content:
      "<p style='text-align: center;'><strong><span style='font-size: 12px;'>Power by MedInsight</span></strong></p>",
    rotate: 0,
    defaultFontName: 'Microsoft Yahei',
    defaultColor: '#fff',
    vertical: false,
    opacity: 0.4
  }]

  if (Original_studies.length > 0) {
    Original_studies.map((item: linktype, index: number) => {
      elements.push({
        content:
          `<p><span style='font-size: 12px;'>${item.text}</span></p>`,
        defaultColor: '#fff',
        defaultFontName: 'Microsoft Yahei',
        height: 60,
        id: nanoid(10),
        left: 48,
        lineHeight: 0.8,
        link: {
          target: item.link[0].link,
          type: 'web',
        },
        paragraphSpace: 5,
        rotate: 0,
        top: 32 + 40 * (index + 1),
        type: 'text',
        vertical: false,
        width: 940,
      })
    })
  }
  if (Systematic_reviews.length > 0) {
    Systematic_reviews.map((item: linktype, index: number) => {
      elements.push({
        content:
          `<p><span style='font-size: 12px;'>${index + 1}. ${item.text}</span></p>`,
        defaultColor: '#fff',
        defaultFontName: 'Microsoft Yahei',
        height: 60,
        id: nanoid(10),
        left: 48,
        lineHeight: 0.8,
        link: {
          target: item.link[0].link,
          type: 'web',
        },
        paragraphSpace: 5,
        rotate: 0,
        top: 192 + 40 * (index + 1),
        type: 'text',
        vertical: false,
        width: 940,
      })
    })
  }
  if (Guidelines.length > 0) {
    Guidelines.map((item: linktype, index: number) => {
      elements.push({
        content:
          `<p><span style='font-size: 12px;'>${index + 1}. ${item.text}</span></p>`,
        defaultColor: '#fff',
        defaultFontName: 'Microsoft Yahei',
        height: 60,
        id: nanoid(10),
        left: 48,
        lineHeight: 0.8,
        link: {
          target: item.link[0].link,
          type: 'web',
        },
        paragraphSpace: 5,
        rotate: 0,
        top: 352 + 40 * (index + 1),
        type: 'text',
        vertical: false,
        width: 940,
      })
    })
  }
  return elements
}
// 构建ppt每一张列表
const processItem = async (item: string, prefix: string, type: string) => {
  const imageItem = {
    type: 'image',
    id: 'FnpdasZcs4',
    left: 120,
    top: 51,
    width: 20,
    height: 0,
    src: '',
    rotate: 0,
    fixedRatio: true
  }
  let image = '',
    newName = ''
  let count = 2
  switch (prefix) {
    case '术前':
      image = type === 'CT' ? beforeSeries.value[item] : item
      break
    case '术后':
      image = type === 'CT' ? afterSeries.value[item] : item
      break
    case '随访':
      image = type === 'CT' ? opacitySeries.value[item] : item
      break
    default:
      image = item
  }
  newName = type === 'CT' ? item : '图片'
  let titieName = prefix + newName
  if (type === 'text') {
    titieName = prefix
  }
  const navItem = {
    type: 'text',
    id: nanoid(10),
    left: 0,
    top: -10.617185738665667,
    width: 1000,
    height: 62,
    content: `<p style='text-align:center'><span style='font-size: 24px;'>${titieName}</span></p>`,
    rotate: 0,
    defaultFontName: 'Microsoft Yahei',
    defaultColor: '#fff',
    vertical: false
  }
  const res = await getUrlAsBase64(image)
  getImageSize(res).then(({ width, height }) => {
    const scale = height / width
    const viewport = 0.5625
    const viewWidth = 840
    if (scale < viewport && width > viewWidth) {
      width = viewWidth
      height = width * scale
    }
    else if (height > viewWidth * viewport) {
      height = viewWidth * viewport
      width = height / scale
    }
    let elementList = []
    if (type === 'text') {
      elementList = prefix === '相关文献' ? getLiterature(literatureList.value) : [
        navItem,
        elementItem.value
      ]
    }
    else {
      elementList = [
        navItem,
        {
          ...imageItem, width, height, src: res
        },
        elementItem.value
      ]
    }
    caseList.value.push({
      id: `test-slide-${count++}`,
      elements: elementList,
      background: viceBackground.value
    })

  })
}
useGlobalHotkey()
usePasteEvent()
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}

.layout-header {
  height: 40px;
}

.layout-content {
  height: calc(100% - 40px);
  display: flex;
}

.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}

.layout-content-center {
  width: calc(100% - 160px - 260px);

  .center-top {
    height: 40px;
  }
}

.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>