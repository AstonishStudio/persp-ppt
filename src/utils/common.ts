import { padStart } from 'lodash'

/**
 * 补足数字位数
 * @param digit 数字
 * @param len 位数
 */
export const fillDigit = (digit: number, len: number) => {
  return padStart('' + digit, len, '0')
}

/**
 * 判断设备
 */
export const isPC = () => {
  return !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Mobile|BlackBerry|Symbian|Windows Phone)/i)
}
export const judgeImg = (url: string) => {
  let index = url.lastIndexOf(".");
  let imgname = url.substring(index + 1)
  return [
    'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
    indexOf(imgname.toLowerCase()) !== -1;
}
// 判断当前是否是视频
export const judgeVideo = (url: string) => {
  let index = url.lastIndexOf(".");
  let imgname = url.substring(index + 1)
  return [
    'avi', 'wmv', 'mpeg', 'mp4', 'm4v', 'mov', 'asf', 'flv', 'f4v', 'rmvb', '3gp', 'vob', 'webm'].
    indexOf(imgname.toLowerCase()) !== -1;
}