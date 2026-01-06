import { useAccessStore, useUserStore } from '@vben/stores';
import { useAuthStore } from '#/store';
import { useRouter } from 'vue-router';
import { getTokenApi } from '#/api';
import { ElMessage, ElNotification } from 'element-plus';
import { DEFAULT_HOME_PATH } from '@vben/constants';
import { $t } from '#/locales';

async function toIndexPage(userInfo, router) {
  const accessStore = useAccessStore();
  const userStore = useUserStore();

  userStore.setUserInfo(userInfo);
  if (accessStore.loginExpired) {
    accessStore.setLoginExpired(false);
  } else {
    // await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
    await router.replace({
      path: userInfo.homePath || DEFAULT_HOME_PATH,
      // 明确清空查询参数
      query: {},
    });
  }

  if (userInfo?.username) {
    ElNotification({
      message: `${$t('authentication.loginSuccessDesc')}:${userInfo?.username}`,
      title: $t('authentication.loginSuccess'),
      type: 'success',
    });
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function initSzrz() {
  const accessStore = useAccessStore();
  const params = new URLSearchParams(window.location.search);
  // url中获取模式
  let mode = params.get('mode');
  if (mode === 'Escape') {
    // 缓存登录模式
    accessStore.setLoginMode(mode);
    return;
  }
  // 配置中获取登录模式
  // mode = import.meta.env.VITE_LOGIN_MODE;
  // if (mode === 'Escape2') {
  //   // 缓存登录模式
  //   accessStore.setLoginMode(mode);
  //   return;
  // }
  // accessStore.setLoginMode('PRODUTION');
  // const authStore = useAuthStore();
  const userStore = useUserStore();
  // const router = useRouter();
  let prod = import.meta.env.PROD;
  console.log('prod==', prod);
  // 本地开发环境
  if (!prod) {
    accessStore.setAccessToken(new Date().getTime());
    console.log('当前token==', accessStore.accessToken);
    // 获取用户信息并存储到 accessStore 中
    const userInfo = {
      id: '8EEDE66EEFED47048E2242D0E6A04489',
      usercode: null,
      username: '管理员',
      logincode: 'admin',
      orgcode: '01',
      orgname: '公司总部',
      orgFullName: '公司总部',
      logintime: '2025-04-17 10:11:17',
      roles: [],
      rolecodes: ['1000', '1001', '1002'],
      rolenames: ['调度员', '班长', '部门经理'],
      provinceCode: "210000",

    };

    userStore.setUserInfo(userInfo);
    // await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
    return;
  }

  // 如果token存在
  if (accessStore.accessToken) {
    const userInfo = await authStore.fetchUserInfo(accessStore.accessToken);
    // await delay(1000); // 1秒延迟
    // const userInfo = {
    //   id: '8EEDE66EEFED47048E2242D0E6A04489',
    //   usercode: null,
    //   username: '管理员',
    //   logincode: 'admin',
    //   orgcode: '01',
    //   orgname: '公司总部',
    //   orgFullName: '公司总部',
    //   logintime: '2025-04-17 10:11:17',
    //   roles: [],
    //   rolecodes: ['1000', '1001', '1002'],
    //   rolenames: ['调度员', '班长', '部门经理'],
    // };
    if (userInfo) {
      // toIndexPage(userInfo, router);
      userStore.setUserInfo(userInfo);
      return;
    } else {
      // 清空本地token
      accessStore.setAccessToken(null);
    }
  }

  // 从URL中获取token
  const token = params.get('token');
  if (token) {
    const userInfo = await authStore.fetchUserInfo(token);
    console.log('userInfo22==', userInfo);
    if (userInfo) {
      accessStore.setAccessToken(token);
      toIndexPage(userInfo, router);
      return;
    }
  }
  // 从URL中获取code 和 state
  const authCode = params.get('code');
  const state = params.get('state');
  console.log('authCode==', authCode, '  state==', state);

  if (authCode) {
    const resp = await getTokenApi(authCode);
    console.log('resp==', resp);
    // 授权失败
    if (!resp || !resp.access_token) {
      // 重新认证
      // authStore.reAuthenticate();
      await router.replace({
        name: 'FallbackNotFound',
        // 明确清空查询参数
        query: {},
      });
      ElMessage.error('获取token失败');
      return;
    }
    const newToken = resp.access_token;
    const newRefreshToken = resp.refresh_token;
    console.log('newToken===', newToken);

    accessStore.setAccessToken(newToken);
    accessStore.setRefreshToken(newRefreshToken);
    // await delay(1000); // 1秒延迟
    // accessStore.setAccessToken(new Date().getTime());
    // accessStore.setRefreshToken(new Date().getTime());
  } else {
    // 跳转数认登录页面
    const result = await authStore.reAuthenticate();
    console.log('数字认证授权结果：', result);
    return;
  }

  console.log('当前token==', accessStore.accessToken);
  // 获取用户信息并存储到 accessStore 中
  const userInfo = await authStore.fetchUserInfo(accessStore.accessToken);
  console.log('userInfo33==', userInfo);
  if (userInfo) {
    toIndexPage(userInfo, router);
  } else {
    await router.replace({
      name: 'FallbackNotFound',
      // 明确清空查询参数
      query: {},
    });
    ElMessage.error('获取用户信息失败');
  }
}

export { initSzrz };
