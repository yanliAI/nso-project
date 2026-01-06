import { requestClient } from '#/api/request'

/**
 * 分页查询
 * @param queryInfo
 * @returns
 */
export async function queryByPage(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyManChange/queryByPage', queryInfo)
}

/**
 * 详情查询
 * @param wfId
 * @returns
 */
export async function getDetail(wfId: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyManChange/queryDetail?wfId=' + wfId)
}

/**
 * 撤回
 * @param data
 * @returns
 */
export async function undoData(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyManChange/withdraw', data)
}

/**
 * 传递
 * @param data
 * @returns
 */
export async function transData(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyManChange/transData', data)
}

/**
 * 提交
 * @param data
 * @returns
 */
export async function foreData(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyManChange/commit', data)
}

/**
 * 退回
 * @param data
 * @returns
 */
export async function backData(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyManChange/reject', data)
}

/**
 * 保存表格数据（变更详情）
 * @param data
 * @returns
 */
export async function saveChange(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyManChange/saveChange', data)
}
