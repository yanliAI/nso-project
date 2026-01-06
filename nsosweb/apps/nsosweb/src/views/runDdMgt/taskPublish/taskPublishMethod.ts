import { requestClient } from '#/api/request';

export async function queryEstablish(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryEstablish', queryInfo);
}

export async function queryFilling(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryFilling', queryInfo);
}

export async function withdrawFilling(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/withdrawFilling', queryInfo);
}

export async function queryExamine(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryExamine', queryInfo);
}

export async function queryArchive(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryArchive', queryInfo);
}

export async function publichTaskApi(taskInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/publishTask', taskInfo);
}

export async function publichRowTaskApi(taskInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/publishRowTask', taskInfo);
}

export async function saveTaskApi(taskInfo:any,sortInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/saveTask', taskInfo);
}

export async function queryTemplateApi(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/templateOrgManRelation/queryTemplateApi', {params});
}

export async function deleteTaskApi(delInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/deleteTask', delInfo);
}

export async function queryCompleteUnit(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyReceiveOrg/queryCompleteUnit', {params});
}

export async function queryUnitInfo(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyReceiveOrg/queryUnitInfo', {params});
}

export async function urgeUnitApi(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyReceiveOrg/urgeUnit', {params});
}

export async function urgeAllUnitApi(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyReceiveOrg/urgeAllUnit', {params});
}

export async function examineTaskApi(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/examineTask', {params});
}

export async function returnUnitApi(unitInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyReceiveOrg/returnUnit', unitInfo);
}

export async function querySortApi(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyTemplate/querySort', {params});
}

export async function queryUnitSortApi(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyReceiveOrg/queryUnitSort', {params});
}

export async function getTaskPreview(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/getTaskPreview', {params});
}
