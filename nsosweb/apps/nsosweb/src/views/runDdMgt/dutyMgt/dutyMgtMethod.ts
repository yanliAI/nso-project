import { requestClient } from '#/api/request';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/handoverList/queryDutyList', queryInfo);
}

export async function queryPeopleData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/qualifyInfo/queryData', queryInfo);
}

export async function deletePeopleData(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/qualifyInfo/deleteData', { params });
}

export async function saveQualifyInfo(data:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/qualifyInfo/saveQualifyInfo', data);
}
