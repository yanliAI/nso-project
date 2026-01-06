import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';


export async function toExcel(params:any, excelName:string) {
  return downloadFile(import.meta.env.VITE_NSOSZH + '/evaluateDetail/toExcel', params, excelName);
}

