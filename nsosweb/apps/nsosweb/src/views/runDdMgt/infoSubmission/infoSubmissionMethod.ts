import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/infoSubmission/queryData', queryInfo);
}

export async function batchDelete(info:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/infoSubmission/batchDelete', info);
}

export async function toExcel(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/infoSubmission/toExcel', params, excelName);
}

export async function initSubmission(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/infoSubmission/initSubmission', { params });
}

export async function saveSubmission(info:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/infoSubmission/saveSubmission', info);
}

export async function submitInfo(info:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/infoSubmission/submit', info);
}
