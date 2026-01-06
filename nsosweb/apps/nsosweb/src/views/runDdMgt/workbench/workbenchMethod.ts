import { requestClient } from '#/api/request';

export async function queryDlData(params:string) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/taskInfo/queryDlData', { params });
}

export async function queryZlData() {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/workbenchTypeResult/queryZlData');
}

export async function queryZbData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryZbData', { params });
}

export async function queryGzData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryGzData', { params });
}

export async function queryLdData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryLdData', { params });
}
export async function queryTsyxfsData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryTsyxfsData', { params });
}
export async function queryGjgdData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryGjgdData', { params });
}
export async function queryCmdData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryZlData', { params });
}

export async function queryGjData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryGjData', { params });
}

export async function queryZyData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/queryZyData', { params });
}

export async function countData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/workbenchController/countData', { params });
}

export async function getRole() {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/taskInfo/getRole');
}

export async function queryDutyRole() {
  return await requestClient.post(import.meta.env.VITE_NSOSGZ + '/handoverList/queryDutyRole');
}

export async function downLoadSvg(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/info/downLoadSvg', { params })
}

export function formatDate(longtime:any) {
  if (!longtime) return ''
  const date = new Date(longtime)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
}
/**
 * 计算时间差
 */
export function getHoursDifference(date1time:any, date2time:any) {
  const date1 = new Date(date1time)
  const date2 = new Date(date2time)
  // 确保传入的是 Date 对象
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      throw new Error('Arguments must be instances of Date');
  }

  // 计算时间差（以毫秒为单位）
  const diffInMilliseconds = Math.abs(date2 - date1);

  // 将毫秒转换为秒
  const diffInSeconds = diffInMilliseconds / 1000;

  // 将秒转换为分钟
  const diffInMinutes = diffInSeconds / 60;

  // 将分钟转换为小时
  const diffInHours = diffInMinutes / 60;

  // 返回时间差（以小时为单位）
  return diffInHours.toFixed(2) + ' 时';
}
