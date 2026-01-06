import { requestClient } from '#/api/request'

/**
 * 分页查询
 * @param queryInfo
 * @returns
 */
export async function queryByPage(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/keyword/queryByPage', queryInfo)
}

/**
 * 获取故障关键字下拉项
 * @param faultCode
 * @returns
 */
export async function getFaultKeywordItems(faultCode: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/keyword/getFaultKeywordItems?faultCode=' + faultCode)
}

/**
 * 删除
 * @param data
 * @returns
 */
export async function remove(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/keyword/remove', data)
}

/**
 * 获取详情
 * @param id
 * @returns
 */
export async function getDetail(id: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/keyword/getDetail?id=' + id)
}

/**
 * 保存
 * @param data
 * @returns
 */
export async function save(data: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/keyword/add', data)
}
