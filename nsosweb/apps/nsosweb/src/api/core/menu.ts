import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi(userId: string) {
  return requestClient.get<RouteRecordStringComponent[]>(
    import.meta.env.VITE_SZRZ + `/menu/getRouters?userId=` + userId,
  );
}
