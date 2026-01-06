import { requestClient } from '#/api/request';

export async function getTreeData() {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/expertGroup/getTreeData');
}

export async function saveDataList(saveInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/dcpPerson/saveDataList', saveInfo);
}

export async function sendMeetingMsg(meetingInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertInfo/sendMeetingMsg', meetingInfo);
}

export async function createGroup(meetingInfo : any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertInfo/createGroup', meetingInfo);
}



export async function getExpertInfo(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/expertInfo/getExpertInfo', { params });
}

export async function queryUserData(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/msUserContacts/queryData', queryInfo);
}

export async function queryData2(queryInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultElinkGroup/cQueryDataListByPage', queryInfo);
}
