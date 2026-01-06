import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>(
    import.meta.env.VITE_BASIC + '/auth/userinfo',
  );
}

/**
 * 获取用户信息
 */

// http://{host}/am-gateway/{namespace}/am-protocol-service/oauth2/getUserInfo?access_token=46e4d79fc6384105e157465032c9684e&client_id=20170830061623854-E5A8-B2FABDC35
export async function getUserInfoWithTokenApi(access_token: null | string) {
  return requestClient.post<UserInfo>(
    import.meta.env.VITE_SZRZ + '/auth/getUserInfo',
    {
      access_token,
    },
  );
}
