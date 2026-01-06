import { requestClient } from '#/api/request'

/**
 * 分页查询
 * @param queryInfo
 * @returns
 */
export async function queryByPage(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyMan/queryByPage', queryInfo)
}

/**
 * 详情查询
 * @param id
 * @returns
 */
export async function getDetail(id: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyMan/getDetail?id=' + id)
}
