<template>
  <div class="mobile-preview" ref="mobileRef">
    <div class="thumbnail-list">
      <div class="thumbnail-item" v-for="(slide, index) in slides" :key="slide.id">
        <ThumbnailSlide :slide="slide" :size="screenWidth - 20" :visible="index < slidesLoadLimit" />
      </div>
    </div>
    <div class="menu">
      <div class="menu-item" @click="changeMode('editor')">
        <IconEdit class="icon" /> 编辑
      </div>
      <Divider type="vertical" style="height: 30px;" />
      <div class="menu-item" @click="changeMode('player')">
        <IconFullScreenPlay class="icon" /> 播放
      </div>
      <div class="menu-item" @click="saveFile">
        <IconRefresh class="icon" /> 更新
      </div>
      <div class="menu-item" @click="savePPTX">
        <IconDownload class="icon" /> 下载
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useLoadSlides from '@/hooks/useLoadSlides'
import type { Mode } from '@/types/mobile'
import useExport from '@/hooks/useExport'
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import Divider from '@/components/Divider.vue'
import message from '@/utils/message'
import axios from 'axios'
import md5 from 'js-md5'
const pako = require('pako');


defineProps<{
  changeMode: (mode: Mode) => void
}>()
const { exportPPTX } = useExport()
const { slides, user } = storeToRefs(useSlidesStore())
const { slidesLoadLimit } = useLoadSlides()


const mobileRef = ref<HTMLElement>()
const screenWidth = ref(0)


// const afterSeries = ref([])
// const beforeSeries = ref([])
// const opacitySeries = ref([])
console.log(user.value, 'lailailai')

onMounted(() => {
  if (!mobileRef.value) return
  screenWidth.value = mobileRef.value.clientWidth
})
const savePPTX = () => {
  const ua = window.navigator.userAgent
  const { auth_state, nums } = user.value
  let search = location.search,
    searchArr: string[] = []
  if (!search) return
  searchArr = window.atob(search.split('?')[1].split('=')[0]).split('&')
  searchArr = searchArr.map((item) => item.split('=')[1])

  const userData = { id: searchArr[0], user_id: searchArr[1] }
  const user_id = window.btoa(JSON.stringify(userData))
  const sign = md5(`uid:${searchArr[1]},id:${searchArr[0]},download`)
  const parmas = {
    uid: searchArr[1],
    sign,
    auth_type: auth_state === 1 ? 1 : 0
  }
  if (auth_state !== 1 && Number(nums) >= 9) return message.warning('下载次数已用完，请认证后再进行下载')
  axios.post(`http://localhost:8080`, parmas)
  // if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
  //   // ios端 
  //   console.log('ios端')
  // }
  // else if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
  //   // android端 
  //   console.log('android端')
  // }
  if (ua.match(/MicroMessenger/i) == 'MicroMessenger' && (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1)) {
    // 微信浏览器 
    // console.log('微信浏览器')
    message.warning('当前微信不支持下载，请使用浏览器进行下载')
  }
  else {
    // console.log(slides.value, '数据')
    exportPPTX(slides.value, true, false)
  }

}
const saveFile = async () => {
  console.log(slides.value, 666)
  let search = location.search,
    searchArr: string[] = []
  if (!search) return
  searchArr = window.atob(search.split('?')[1]).split('&')
  searchArr = searchArr.map((item) => item.split('=')[1])
  const userData = { id: searchArr[0], user_id: searchArr[1] }
  const sign = md5(`uid:${searchArr[1]},id:${searchArr[0]},ppt-update-big`)

  // const newdata = slides.value.map(item => item.elements)
  // const compressedData = window.btoa(unescape(encodeURIComponent(JSON.stringify(slides.value))))

  // 使用 AJAX 发送 JSON 数据给 PHP 后端
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `http://localhost:8080`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {

      if (xhr.status === 200) {
        // 请求成功，处理返回的结果
        console.log(xhr.responseText);
        message.success('更新ppt信息成功！')
      } else {
        // 请求失败，处理错误
        if (xhr.status === 500) {
          console.error("Internal Server Error. Error details: ", xhr);
        } else {
          console.error("Request failed with status:", xhr.status);
        }

      }
    }
  };
  xhr.send(JSON.stringify(slides.value));


}


</script>

<style lang="scss" scoped>
.mobile-preview {
  height: 100%;
  background-color: #f9f9f9;
}

.thumbnail-list {
  height: calc(100% - 50px);
  padding: 10px;
  overflow: auto;
}

.thumbnail-item {
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);

  &+.thumbnail-item {
    margin-top: 10px;
  }
}

.menu {
  height: 50px;
  position: relative;
  box-shadow: 0 -2px 4px 0 rgba($color: #333, $alpha: 0.05);
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  .menu-item {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;

    .icon {
      margin-right: 8px;
      font-size: 18px;
    }
  }
}
</style>
