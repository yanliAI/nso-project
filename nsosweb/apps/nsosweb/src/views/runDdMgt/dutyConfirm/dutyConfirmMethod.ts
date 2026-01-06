import { requestClient } from '#/api/request';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyPersonConfirm/queryData', queryInfo);
}

export async function getDetail(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyPersonConfirm/getDetail', { params });
}

export async function confirmDutyApi(formInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyPersonConfirm/confirmDuty', formInfo);
}
