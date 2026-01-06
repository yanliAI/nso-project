import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { ElNotification } from 'element-plus';
import { defineStore } from 'pinia';

import {
  getAccessCodesApi,
  getUserInfoApi,
  loginApi,
  escapeModeLoginApi,
  getUserInfoWithTokenApi,
  logoutEscapeApi,
  logoutApi,
  szrzLogoutApi,
  authenticateApi,
} from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      let accessToken;
      try {
        const response =
          accessStore.loginMode === 'Escape2'
            ? await loginApi(params)
            : await escapeModeLoginApi(params);

        accessToken = response.accessToken || response;
      } catch (error) {
        // console.error('登录失败:', error);
        accessToken = null;
      }

      // 如果成功获取到 accessToken
      if (accessToken) {
        // 将 accessToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken);

        // 获取用户信息并存储到 accessStore 中
        userInfo = await fetchUserInfo(accessToken);
        userStore.setUserInfo(userInfo);
        if (accessStore.loginMode === 'Escape2') {
          const roles = getAccessCodesApi();
          accessStore.setAccessCodes(roles.rolecodes);
        }

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
        }

        if (userInfo?.username) {
          ElNotification({
            message: `${$t('authentication.loginSuccessDesc')}:${userInfo?.username}`,
            title: $t('authentication.loginSuccess'),
            type: 'success',
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    let loginMode = accessStore.loginMode;
    try {
      if (loginMode === 'Escape2') {
        await logoutApi();
      } else if (loginMode === 'Escape') {
        await logoutEscapeApi(accessStore.accessToken);
      } else {
        try {
          await logoutEscapeApi(accessStore.accessToken);
        } catch {}
        resetAllStores();
        accessStore.setLoginExpired(false);

        // 缓存登录模式
        accessStore.setLoginMode(loginMode);
        await szrzLogoutApi(import.meta.env.VITE_RZ_LOGOUT_REDIRECT_URL);
      }
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 缓存登录模式
    accessStore.setLoginMode(loginMode);
    let queryParam = {};
    if (redirect) {
      queryParam.redirect = encodeURIComponent(
        router.currentRoute.value.fullPath,
      );
    }
    if (loginMode === 'Escape') {
      queryParam.mode = loginMode;
    }
    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: queryParam,
    });
  }

  async function fetchUserInfo(access_token: null | string) {
    let userInfo: null | UserInfo = null;
    try {
      // userInfo =
      //   accessStore.loginMode === 'Escape2'
      //     ? await getUserInfoApi()
      //     : await getUserInfoWithTokenApi(access_token);


      // userInfo = await getUserInfoWithTokenApi(access_token);
    } catch (error) {
      // console.error('获取用户信息失败:', error);
    }
    if (!userInfo) {
      return null;
    }
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  //调用数字认证授权 传入重定向地址
  async function reAuthenticate() {
    authenticateApi(import.meta.env.VITE_RZ_REDIRECT_URL);
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
    reAuthenticate,
  };
});
