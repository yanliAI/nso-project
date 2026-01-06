import { requestClient } from '#/api/request';

export async function queryZpData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/callcenterFaultOrder/queryData', queryInfo);
}

export async function queryGjData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/alarmInfo/queryData', queryInfo);
}

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultReceiveInfo/queryData', queryInfo);
}

export async function confirm(params:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultReceiveInfo/confirm', params);
}

export async function batchConfirm(params:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultReceiveInfo/batchConfirm', params);
}

export async function getFaultId(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/faultReceiveInfo/getFaultId', { params });
}
