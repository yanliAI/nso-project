import { requestClient } from '#/api/request'

export async function queryFilling(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryFilling', queryInfo)
}

export async function queryExamine(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryExamine', queryInfo)
}
// 查询护网值班待填报任务
export async function queryHwDutyFillingTask(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryHwDutyFillingTask', queryInfo)
}
// 查询护网值班已上报任务
export async function queryHwDutyReportedTask(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryHwDutyReportedTask', queryInfo)
}
export async function getDutyCalendarInfo(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyRosterInfo/getDutyCalendarInfo', queryInfo)
}
export async function getHwDutyTaskOrgRelation(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/hwDutyTasksOrgRelation1/getHwDutyTaskOrgRelation', queryInfo)
}
// 批量保存值班表数据
export async function saveBatchRosterData(voList: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyRosterInfo/saveBatchRosterData', voList)
}
// 上报(值班任务下发单位状态修改)
export async function upReport(dataVo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyReceiveOrg/upReport', dataVo)
}
// 查询值班表分页数据
export async function queryRosterDataByPage(queryVo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyRosterInfo/queryDataListByPagation', queryVo)
}
// 下载值班表信息模板
export async function downloadDutyTaskTemplate() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/downloadDutyTaskTemplate')
}
// 自动排班功能
export async function autoDutyRoster(voList: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyRosterInfo/autoDutyRoster', voList)
}

 