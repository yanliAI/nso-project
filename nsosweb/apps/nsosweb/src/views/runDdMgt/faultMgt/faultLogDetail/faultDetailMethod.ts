import { requestClient } from '#/api/request'
import { downloadFile } from '#/utils/download.ts'

export async function initFaultInfo(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultInfoDetail/initFaultInfo', { params, showmask: false })
}

export async function saveFaultInfo(faultInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultInfoDetail/saveFaultInfo', faultInfo)
}
export async function complateFault(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultInfoDetail/complateFault', { params })
}
export async function deleteFault(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultInfoDetail/deleteFault', { params })
}
export function formatDate(longtime: any) {
  if (!longtime) return ''
  const date = new Date(longtime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export async function initDispose(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/disposeRecord/initDispose', { params })
}

export async function queryDisposeRecord(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/disposeRecord/queryDisposeRecord', { params })
}

export async function queryCmdByFaultCode(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/queryDataByFaultCode', { params })
}

export async function deleteDispose(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/disposeRecord/deleteDispose', { params })
}

export async function saveDispose(dispose: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/disposeRecord/saveDispose', dispose)
}

export async function validAddRow(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/valid/addRow', { params })
}

export async function validDelRow(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/valid/deleteRow', { params })
}
export async function initValid(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/valid/initValid', { params })
}
export async function queryFaultValid(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/valid/queryFaultValid', { params })
}

export async function saveValid(data: any, config: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/valid/saveValid', data, config)
}
export async function faultMeeting(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultInfoDetail/faultMeeting', { params })
}
export async function saveAssessResult(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultInfoDetail/saveAssessResult', { params })
}
export async function noticeYfValid(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/deptUserValid/noticeYfValid', { params })
}
export async function queryDeptUserValid(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/deptUserValid/queryDeptUserValid', { params })
}

export async function dealLogToExcel(params: any, excelName: string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/disposeRecord/toExcel', params, excelName)
}
export async function queryHistoryFault(data: any, config: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/queryHistoryFault', data, config)
}

export async function downLoadSvg(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/info/downLoadSvg', { params })
}

export async function getSystemInfo(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/info/getSystemInfo', { params })
}
