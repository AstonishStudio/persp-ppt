<template>
  <div class="mobile">
    <component :is="currentComponent" :changeMode="changeMode"></component>
    <FullscreenSpin :loading="exporting" tip="数据正在加载中..." />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick } from 'vue'
import type { Mode } from '@/types/mobile'

import MobileEditor from './MobileEditor/index.vue'
import MobilePlayer from './MobilePlayer.vue'
import MobilePreview from './MobilePreview.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

import axios from 'axios'
import dayjs from 'dayjs'
import md5 from 'js-md5'
import { useSlidesStore } from '@/store'
import { storeToRefs } from 'pinia'
import { getUrlAsBase64, getImageSize, background2 } from '@/utils/image'
import { nanoid } from 'nanoid'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import type { Slide } from '@/types/slides'

const slidesStore = useSlidesStore()
const { theme, viewportRatio } = storeToRefs(slidesStore)
const mode = ref<Mode>('preview')
const exporting = ref(false)
const mainBackground = ref({})
const viceBackground = ref(background2)
const changeMode = (_mode: Mode) => mode.value = _mode
const caseList = ref([] as Slide[])

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
const literatureList = ref({})
const medicalHistory = ref('')
type linktype = {
  link: string[],
  text: string,

}
const currentComponent = computed(() => {
  const componentMap = {
    'editor': MobileEditor,
    'player': MobilePlayer,
    'preview': MobilePreview,
  }
  return componentMap[mode.value] || null
})

const getCaseList = async () => {
  exporting.value = true
  let search = location.search,
    searchArr: string[] = []
  if (!search) return exporting.value = false
  searchArr = window.atob(search.split('?')[1].split('=')[0]).split('&')
  searchArr = searchArr.map((item) => item.split('=')[1])
  const userData = { id: searchArr[0], user_id: searchArr[1] }
  // console.log(userData, searchArr, '是否可以拿到数据')
  const sign = md5(`uid:${searchArr[1]},id:${searchArr[0]},ppt-info`)

  const { data: res } = await axios.get(`http://localhost:8080`)
  console.log(res, '6666')
  if (res.status !== 1) return
  slidesStore.setUser(res.data.user)
  if (res.data.big_value) {
    let big_value = res.data.big_value
    // console.log(big_value, '是否可以拿到数据')
    slidesStore.setSlides(JSON.parse(big_value))
    exporting.value = false
    return
  }
  const { age, after_condition_img, after_condition_txt, after_condition_video, after_img, after_video,
    before_img, before_video, chief_img, chief_txt, chief_video, department, diagnosis_img, diagnosis_txt,
    diagnosis_video, diseases, info_surgical_img, info_surgical_video, info_surgical_txt, operating_img, operating_txt, operating_video,
    other_information, patient_name, ppt_id, selection_techniques, sex, surgical_img, surgical_txt, surgical_video, updated_at, literature,
    medical_history, bed, ward, reporter, surgical_team, user, style, preoperative_txt, preoperative_img, preoperative_video
  } = res.data

  // let slidersVlaue = decodeURIComponent(escape(window.atob(big_value)))
  // console.log(JSON.parse(big_value), 45689)
  medicalHistory.value = medical_history
  const dataTime = dayjs.unix(Number(updated_at)).format('YYYY-MM-DD')
  literatureList.value = literature || { Original_studies: [], Systematic_reviews: [], Guidelines: [] }
  if (style) {
    const bg1 = await getUrlAsBase64(style.mainBg)
    const bg2 = await getUrlAsBase64(style.viceBg)
    mainBackground.value = { type: 'image', color: '#ffffff', imageSize: 'cover', image: bg1 }
    viceBackground.value = { type: 'image', color: '#ffffff', imageSize: 'cover', image: bg2 }
  } else {
    const bg1 = await getUrlAsBase64('http://localhost:800/ppt/bg_img/6.png')
    mainBackground.value = { type: 'image', color: '#ffffff', imageSize: 'cover', image: bg1 }
  }
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
          content: `<p><span style='font-size: 18px;'><span style='color: #fff;'>&nbsp;姓名：${patient_name}，性别：${sex === '1' ? '女性' : '男性'}，年龄：${age}岁</span></span></p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: '7stdasdmVP',
          left: 40,
          rotate: 0,
          top: 60.94617280967205,
          type: 'text',
          width: 972.36317759203
        },
        {
          content: `<p >科室：${department}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: '6jVPnx_iYA',
          left: 40,
          rotate: 0,
          top: 110.94617280967205,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        },
        {
          content: `<p >病种类型：${diseases}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 't9OxH7Ip29X',
          left: 40,
          rotate: 0,
          top: 160.94617280967205,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        },
        {
          content: `<p>治疗方式：${selection_techniques}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 'XDaF1s2Usx',
          left: 40,
          rotate: 0,
          top: 210.25000000000003,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        },
        {
          content: `<p>病区：${ward}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 'X8aF12sUsx',
          left: 40,
          rotate: 0,
          top: 260.25000000000003,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        },
        {
          content: `<p>床位：${bed}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 'X8Da1sUsxk',
          left: 40,
          rotate: 0,
          top: 310.25000000000003,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        },
        {
          content: `<p>手术组：${surgical_team}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 'X8DaF1sUsx',
          left: 40,
          rotate: 0,
          top: 360.25000000000003,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        },
        {
          content: `<p>汇报人：${reporter}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 'X8D2a1sUsx',
          left: 40,
          rotate: 0,
          top: 410.25000000000003,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        },
        {
          content: `<p >备注信息：${other_information}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 'W5V5Bh_kxx',
          left: 40,
          rotate: 0,
          top: 460.04004014383975,
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
    }
  ]
  caseList.value = casedata
  await mergeItem(chief_txt, '主诉', 'text')
  await mergeItem(chief_img, '主诉', 'img')
  await mergeItem(chief_video, '主诉', 'video')
  await mergeItem(before_img, '术前', 'img')
  await mergeItem(before_video, '术前', 'video')
  await mergeItem(preoperative_txt, '术前化验', 'text')
  await mergeItem(preoperative_img, '术前化验', 'img')
  await mergeItem(preoperative_video, '术前化验', 'video')
  await mergeItem(diagnosis_txt, '诊断结果', 'text')
  await mergeItem(diagnosis_img, '诊断结果', 'img')
  await mergeItem(diagnosis_video, '诊断结果', 'video')
  await mergeItem(surgical_txt, '入路设计', 'text')
  await mergeItem(surgical_img, '入路设计', 'img')
  await mergeItem(surgical_video, '入路设计', 'video')
  await mergeItem(info_surgical_txt, '术中', 'text')
  await mergeItem(info_surgical_img, '术中', 'img')
  await mergeItem(info_surgical_video, '术中', 'video')
  await mergeItem(after_img, '术后', 'img')
  await mergeItem(after_video, '术后', 'video')
  await mergeItem(after_condition_txt, '术后情况', 'text')
  await mergeItem(after_condition_img, '术后情况', 'img')
  await mergeItem(after_condition_video, '术后情况', 'video')
  await mergeItem(operating_txt, '随访', 'text')
  await mergeItem(operating_img, '随访', 'img')
  await mergeItem(operating_video, '随访', 'video')

  if (Object.keys(literatureList.value).length === 0) {
    await mergeItem([], [], '相关文献', '暂无数据')
  } else {
    const items = getLiterature(literatureList.value)
    caseList.value.push({
      id: `test-slide-165`,
      elements: items,
      background: viceBackground.value
    })
  }
  nextTick(async () => {
    await convertImagesToBase64();
    slidesStore.setSlides(caseList.value)

    exporting.value = false

    // slidesStore.setSlides(caseList.value)
  })

}
// 混合进行操作
const mergeItem = async (currentVlaue, name, type) => {
  const createElement = (content, left, top, width, height, extraProps = {}) => ({
    type: 'text',
    id: nanoid(10),
    content,
    left,
    top,
    width,
    height,
    defaultFontName: 'Microsoft Yahei',
    defaultColor: '#fff',
    rotate: 0,
    vertical: false,
    ...extraProps
  });

  const createSlide = (elements) => ({
    id: `test-slide-${nanoid(5)}`,
    elements,
    background: viceBackground.value
  });

  let element = [
    createElement(`<p style='text-align: center;font-size:24px;'><strong>${name}</strong></p>`, 416.3016270337922, 0, 156.44555694618273, 50),
    elementItem.value
  ];

  if (type === 'text') {

    element.push(
      createElement(`<p>${name}：${currentVlaue}</p>`, 22.932356852315394, 44, 967.6157697121401, 50)
    );
    if (name === '主诉') {
      element.push(
        {
          content: `<p >现病史：${medicalHistory.value}</p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: 't9OxH7Ip9X',
          left: 27.636822407970044,
          rotate: 0,
          top: 187.94617280967205,
          type: 'text',
          vertical: false,
          width: 972
        },
      )
    }
    caseList.value.push(createSlide(element));
  } else {
    currentVlaue.forEach((item) => {

      element.push({
        type: type === 'img' ? 'image' : 'video',
        id: nanoid(10),
        src: item.url,
        width: 600,
        height: 320,
        left: 90,
        top: 100,
        fixedRatio: true,
        rotate: 0
      });
      if (type === 'img' && (name === '术前' || name === '术后')) {
        element.push({
          content: `<p><span style='font-size: 18px;'><span style='color: #fff;'>&nbsp;时间：${item.photo_time}，影像序列：${item.image_sequence}</span></span></p>`,
          defaultColor: '#fff',
          defaultFontName: 'Microsoft Yahei',
          height: 50,
          id: '6jVPnx_iYA',
          left: 27.636822407970016,
          rotate: 0,
          top: 60,
          type: 'text',
          vertical: false,
          width: 972.36317759203
        });
      }
      caseList.value.push(createSlide(element));
      element = [
        createElement(`<p style='text-align: center;font-size:24px;'><strong>${name}</strong></p>`, 416.3016270337922, 0, 156.44555694618273, 50),
        elementItem.value
      ];
    })
  }
};
getCaseList()

// Convert all images to base64 in caseList
const convertImagesToBase64 = async () => {
  for (const slide of caseList.value) {
    for (const element of slide.elements) {
      if (element.type === 'image') {
        element.src = await getUrlAsBase64(element.src);
        getImageSize(element.src).then(({ width, height }) => {
          console.log(width, height, '是否可以拿到数据')
          const scale = height / width
          const viewport = viewportRatio.value
          const viewWidth = VIEWPORT_SIZE
          if (scale < viewport && width > viewWidth) {
            width = viewWidth
            height = width * scale
          }
          else if (height > viewWidth * viewport) {
            height = viewWidth * viewport
            width = height / scale
          }

          element.width = width / 1.5
          element.height = height / 1.5
        })

      }
    }
  }
};
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
  // caseList.value.push({
  //   id: `test-slide-165`,
  //   elements,
  //   // background: background2
  // })
  return elements
}

</script>

<style lang="scss" scoped>
.mobile {
  height: 100%;
}
</style>