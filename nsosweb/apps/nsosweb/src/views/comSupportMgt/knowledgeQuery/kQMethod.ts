import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/queryData', queryInfo);
}

export async function initCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/initCmd', { params });
}

export async function saveCmdInfo(cmdInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/saveCmdInfo', cmdInfo);
}

export async function releaseCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/releaseCmd', { params });
}

export async function signCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/signCmd', { params });
}

export async function repeatCmd(cmdInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/repeatCmd', cmdInfo);
}

export async function endCmd(cmdInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/endCmd', cmdInfo);
}

export async function nullifyCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/nullifyCmd', { params });
}

export async function deleteCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/deleteCmd', { params });
}

export async function toExcel(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/command/toExcel', params, excelName);
}
