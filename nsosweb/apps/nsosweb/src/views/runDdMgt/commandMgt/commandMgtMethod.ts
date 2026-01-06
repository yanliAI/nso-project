import { requestClient } from '#/api/request';

export async function getDataList(queryInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dcpPerson/getDataList',queryInfo);
}

export async function getTreeData() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dcpOrganization/getTreeData');
}

export async function saveDataList(saveInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dcpPerson/saveDataList', saveInfo);
}
