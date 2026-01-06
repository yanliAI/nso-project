import { requestClient } from '#/api/request';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/scheduleMgt/queryData', queryInfo);
}
