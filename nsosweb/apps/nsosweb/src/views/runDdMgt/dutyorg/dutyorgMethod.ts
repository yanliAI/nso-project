import { requestClient } from '#/api/request'

/**
 * 分页查询
 * @param queryInfo
 * @returns
 */
export async function queryByPage(queryInfo: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyOrg/queryByPage', queryInfo)
}

/**
 * 详情查询
 * @param id
 * @returns
 */
export async function getDetail(id: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyOrg/getDetail?id=' + id)
}

/**
 * 获取人员角色下拉数据
 * @returns
 */
export async function getDutyManItems() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyOrg/getDutyManItems')
}

/**
 * 获取人员角色排序数据
 * @returns
 */
export async function getManSort() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyOrg/getManSort')
}
