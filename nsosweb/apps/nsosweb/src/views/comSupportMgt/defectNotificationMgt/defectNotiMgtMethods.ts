import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';

export async function toExcelTb(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/toExcelTb', params, excelName);
}

export async function toExcelCl(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/toExcelCl', params, excelName);
}

export async function toExcelGd(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/toExcelGd', params, excelName);
}
