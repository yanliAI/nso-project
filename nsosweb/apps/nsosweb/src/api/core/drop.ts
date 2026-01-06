import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getDropData(drops:string) {
  return requestClient.get(import.meta.env.VITE_BASIC + '/drop/getDropData?drops=' + drops, { showmask: false });
}
