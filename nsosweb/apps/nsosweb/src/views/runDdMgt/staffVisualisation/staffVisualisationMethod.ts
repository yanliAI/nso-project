import { requestClient } from '#/api/request';

export async function queryData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyRosterInfo/getVisualInfo', { params });
}

