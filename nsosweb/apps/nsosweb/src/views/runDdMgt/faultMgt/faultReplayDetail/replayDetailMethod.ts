import { requestClient } from '#/api/request'

export async function queryReviewInfoByCode(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultReviewInfo/queryReviewInfoByCode', { params, showmask: false })
}
export async function saveFaultReviewInfo(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultReviewInfo/saveFaultReviewInfo', data)
}
export async function queryMeasureByCode(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/measure/queryMeasureByCode', { params, showmask: false })
}
export async function initFaultMeasure(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/measure/initFaultMeasure', { params })
}
export async function saveFaultMeasure(data: any, config: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/measure/saveFaultMeasure', data, config)
}
export async function deleteMeasure(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/measure/deleteMeasure', { params })
}
export async function initReportEdit(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/editInfo/initReportEdit', { params })
}
export async function queryReportEditByCode(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/editInfo/queryReportEditByCode', { params, showmask: false })
}
export async function saveReportEdit(data: any, config: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/editInfo/saveReportEdit', data, config)
}
export async function deleteReportEdit(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/editInfo/deleteReportEdit', { params })
}
export async function updateEditQx(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/editInfo/updateEditQx', { params })
}

export async function queryFaultReformByCode(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/reformRecord/queryFaultReformByCode', { params, showmask: false })
}
export async function saveFaultReform(data: any, config: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/reformRecord/saveFaultReform', data, config)
}
export async function updateRing(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/reformRecord/updateRing', { params })
}
export async function flMeasure(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/reformRecord/flMeasure', { params })
}
export async function initFaultReform(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/reformRecord/initFaultReform', { params })
}
export async function reformDeleteRow(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/reformRecord/deleteRow', { params })
}
export async function complateReplay(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultInfoDetail/complateReplay', { params })
}

export async function updateReportEdit(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/editInfo/updateReportEdit', { params, showmask: false })
}

/**
 * 生成简报
 */
export async function generateSimpleReport(faultId: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultReviewInfo/generateSimpleReport?faultId=' + faultId)
}

/**
 * 生成故障分析报告
 */
export async function generateAnalyseReport(faultId: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultReviewInfo/generateAnalyseReport?faultId=' + faultId)
}

/**
 * 生成报告（包括简报和分析报告）
 */
export async function generateReport(faultId: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultReviewInfo/generateReport?faultId=' + faultId)
}

/**
 * 清除故障复盘报告附件id
 * @param faultId
 * @param fileId
 * @param reportType
 * @returns
 */
export async function clearReplayReportId(faultId: any, fileId: any, reportType: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultReviewInfo/clearReplayReportId?faultId=' + faultId + '&fileId=' + fileId + '&reportType=' + reportType)
}

/**
 * 获取通知催办信息
 * @param data
 * @returns
 */
export async function getNotifyInfo(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultReviewInfo/getNotifyInfo', data)
}
