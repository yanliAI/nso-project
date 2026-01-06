import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';

export async function queryData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/reportTemplate/query', queryInfo);
}

export async function toExcel(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/commandTemplate/toExcel', params, excelName);
}

export async function generateReport(templateId: any) {
  return requestClient.get(import.meta.env.VITE_NSOSZH + '/reportTemplate/generateReport?templateId=' + templateId)
}
