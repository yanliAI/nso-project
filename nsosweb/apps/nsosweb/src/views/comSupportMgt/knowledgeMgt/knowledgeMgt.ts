import { requestClient } from '#/api/request';
import { downloadFile } from '#/utils/download.ts';


export async function queryFile(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/queryAttachList',queryInfo);
}

export async function deleteFile(deleteInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/fileDelete',deleteInfo);
}

export async function queryConten(contenName:string) {
  return requestClient.get(import.meta.env.VITE_NSOSZH + '/knowContensInfo/queryData',{params:{contenName: contenName}});
}

export async function addConten(contenInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/knowContensInfo/addConten',contenInfo);
}

export async function deleteConten(delList:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/knowContensInfo/delConten',delList);
}

export async function queryTree() {
  return requestClient.get(import.meta.env.VITE_NSOSZH + '/knowContensInfo/queryTree');
}
