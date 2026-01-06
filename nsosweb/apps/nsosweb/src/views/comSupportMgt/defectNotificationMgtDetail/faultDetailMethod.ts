import { requestClient } from '#/api/request';

export async function initFaultInfo(params:any) {
  return requestClient.get(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/initFaultInfo', { params });
}

export async function saveFaultInfo(faultInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/saveFaultInfo', faultInfo);
}

export async function fallbackData(faultInfo:any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/fallback', faultInfo);
}

export function formatDate(longtime:any) {
  if (!longtime) return ''
  const date = new Date(longtime)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
