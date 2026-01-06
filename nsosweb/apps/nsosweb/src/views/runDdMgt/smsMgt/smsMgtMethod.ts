import { requestClient } from '#/api/request';

export async function queryUserData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/msUserContacts/queryData', queryInfo);
}

export async function initUser(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/msUserContacts/initUser', { params });
}

export async function saveUser(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/msUserContacts/saveUser', queryInfo);
}

export async function deleteUser(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/msUserContacts/deleteUser', { params });
}

export async function getUserDrop() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/msUserContacts/getUserDrop');
}

export async function queryTemplateData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/msTemplateDefine/queryData', queryInfo);
}
