import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';

export async function analyzeByStatus(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/operationOverView/analyzeDisposingStatus', queryInfo);
}

export async function analyzeByTime(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/operationOverView/analyzeHandleTime', queryInfo);
}

export async function analyzeByOperateOrg(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/operationOverView/analyzeOperateOrg', queryInfo);
}

export async function analyzeBySysLevel(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/operationOverView/analyzeSysLevel', queryInfo);
}

export async function analyzeByLargeCatagory(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/operationOverView/analyzeLargeCategory', queryInfo);
}

export async function analyzeBySubCatagory(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/operationOverView/analyzeSubClass', queryInfo);
}

export async function analyzeQuestionSource(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/operationOverView/analyzeQuestionSource', queryInfo);
}