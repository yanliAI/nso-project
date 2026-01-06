import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/ydAlertInfo/mHQueryDataListByPagePagination', queryInfo);
}

export async function queryData2(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/ydAlertInfo/mHQueryDataListByPagePagination2', queryInfo);
}

export async function add(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/ydAlertInfoExt/add', queryInfo);
}

export async function add2(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/ydAlertInfo/add', queryInfo);
}

export async function toExcel(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/ydAlertInfo/toExcel', params, excelName);
}
