import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';


export async function queryDataCount(queryInfo:any, config:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/personalWorkbenchs/queryNum', queryInfo, config);
}

export async function queryData2(queryInfo:any, config:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/personalWorkbenchs/mHQueryDataListByPagePagination', queryInfo, config);
}

export async function queryData(queryInfo:any, config:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/queryData', queryInfo, config);
}
export async function queryTodoList(queryInfo:any, config:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/queryTodoList', queryInfo, config);
}
export async function queryDoneList(queryInfo:any, config:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/queryDoneList', queryInfo, config);
}
export async function initCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/initCmd', { params, showmask: true });
}
export async function queryTaskList(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/queryTaskList', { params, showmask: false });
}
export async function querySignList(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/cmdSignRelationship/querySignList', { params, showmask: false });
}
export async function saveCmdInfo(cmdInfo:any, config:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/saveCmdInfo', cmdInfo, config);
}
export async function deleteCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/deleteCmd', { params });
}
export async function nullifyCmd(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/nullifyCmd', { params });
}
export async function toExcel(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/command/toExcel', params, excelName);
}
export async function signTask(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/signTask', { params });
}
export async function flTask(data:any, params:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/flTask', data, { params });
}
export async function fhTask(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/fhTask', { params });
}
export async function releaseTask(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/releaseTask', { params });
}
export async function queryTemplateData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/queryData', queryInfo, { showmask: false });
}
export async function countTemplateData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/countData', queryInfo, { showmask: false });
}
export async function getSysId() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/getSysId');
}
export async function queryFlSituationList(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/flSituation/queryFlSituationList', { params, showmask: false });
}
export async function cmdSyncTempFile(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/cmdSyncTempFile', { params, showmask: true });
}

