import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/evaluateDetail/query', queryInfo);
}

export async function saveData(saveInfo:any, params: any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/evaluateDetail/save', saveInfo, params);
}

export async function saveRecord(saveInfo:any, params: any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/evaluateDetail/saveRecord', saveInfo, params);
}
