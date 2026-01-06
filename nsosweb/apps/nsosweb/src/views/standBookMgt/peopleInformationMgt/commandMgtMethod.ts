import { requestClient } from '#/api/request';

export async function getDataLists(queryInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertGroup/getDataLists',queryInfo);
}

export async function getDataList(queryInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertInfo/getDataLists',queryInfo);
}

export async function getTreeData() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/expertGroup/getTreeData');
}

export async function saveDataList(saveInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dcpPerson/saveDataList', saveInfo);
}
