import { requestClient } from '#/api/request';

export async function queryArchive(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryArchive', queryInfo);
}

