import { requestClient } from '#/api/request'

export async function queryData2(queryInfo: any, config: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/notifyRecord/mHQueryDataListByPagePagination', queryInfo, config)
}
