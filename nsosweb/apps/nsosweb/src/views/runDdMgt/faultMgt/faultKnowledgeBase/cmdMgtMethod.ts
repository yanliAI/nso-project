import { requestClient } from '#/api/request';


export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultKnowledge/mHQueryDataListByPagePagination', queryInfo);
}

