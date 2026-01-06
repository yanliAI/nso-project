import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
    errcode: string;
    msg: string;
    access_token: string;
    refresh_token: string;
    uid: string;
    expires_in: Number;
  }
}

/**
 * 初始化登录信息
 */
export async function frontLoginInfoInit() {
  return requestClient.post(
    import.meta.env.VITE_BASIC + '/auth/frontLoginInfoInit',
  );
}

/**
 * 登录
 */
// export async function loginApi(data: AuthApi.LoginParams) {
//   return requestClient.post<AuthApi.LoginResult>(import.meta.env.VITE_BASIC + '/auth/login', data);
// }

/**
 * 加密登录
 */
export async function loginApi(params: any) {
  return requestClient.get<AuthApi.LoginResult>(
    import.meta.env.VITE_BASIC + '/auth/login',
    { params },
  );
}

/**
 * 应急逃生登录 publicKey
 */
export async function getEmergencyPublicKeyApi() {
  return requestClient.get(import.meta.env.VITE_SZRZ + '/emergency/publicKey');
}

/**
 * 应急逃生登录
 */
export async function escapeModeLoginApi(params: any) {
  return requestClient.post<AuthApi.RefreshTokenResult>(
    import.meta.env.VITE_SZRZ + '/emergency/login',
    params,
  );
}

/**
 * 刷新accessToken
 */
// export async function refreshTokenApi() {
//   return baseRequestClient.post<AuthApi.RefreshTokenResult>(import.meta.env.VITE_BASIC + '/auth/refresh', {
//     withCredentials: true,
//   });
// }

/**
 * 刷新accessToken
 */
// http://{host}/am-gateway/{namespace}/am-protocol-service/oauth2/refreshToken
export async function refreshTokenApi(refresh_token: null | string) {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    import.meta.env.VITE_SZRZ +
      '/am-gateway/{namespace}/am-protocol-service/oauth2/refreshToken',
    {
      // 应用标识
      client_id: '',
      // 密钥
      client_secret: '',
      // 认证方式 固定为 ‘refresh_token’
      grant_type: 'refresh_token',
      refresh_token,
    },
  );
}

/**
 * 获取accessToken
 */
// http://{host}/am-gateway/{namespace}/am-protocol-service/oauth2/getToken?client_id=xxxxxx&grant_type=authorization_code&code=xxxxxx&client_secret=xxxxxx
export async function getTokenApi(code: null | string) {
  return requestClient.post<AuthApi.RefreshTokenResult>(
    import.meta.env.VITE_SZRZ + '/auth/getToken',
    {
      code,
    },
  );
}

/**
 * 获取数认baseUrl
 */
export async function getSRBaseUrlApi() {
  return requestClient.get(import.meta.env.VITE_SZRZ + `/path/shurenUrl`);
}

/**
 * 数认授权
 */

// http://{host}/idp/authCenter/authenticate?response_type=code&state=1&redirect_uri=http://{host}/oauth-demo/home&client_id=oauth2DemoTest
export async function authenticateApi(redirect_uri: null | string) {
  try {
    let baseURL = await getSRBaseUrlApi();
    window.location.href =
      baseURL +
      `/idp/authCenter/authenticate?response_type=code&state=1&redirect_uri=${
        redirect_uri
      }&client_id=` +
      `nssc`;
  } catch {}
}

/**
 * 数认退出登录
 */

// http://{host}/idp/authCenter/GLO?redirectToUrl=*****&redirectToLogin=true&entityId=oa
export async function szrzLogoutApi(redirectToUrl: null | string) {
  try {
    let baseURL = await getSRBaseUrlApi();
    window.location.href =
      baseURL +
      `/idp/authCenter/GLO?redirectToUrl=${
        redirectToUrl
      }&redirectToLogin=true&entityId=` +
      `nssc`;
  } catch {}
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post(import.meta.env.VITE_BASIC + '/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 应急模式 退出登录
 */
export async function logoutEscapeApi(access_token) {
  return baseRequestClient.post(import.meta.env.VITE_SZRZ + '/auth/logout', {
    access_token,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.post<any>(import.meta.env.VITE_BASIC + '/auth/roles');
}
