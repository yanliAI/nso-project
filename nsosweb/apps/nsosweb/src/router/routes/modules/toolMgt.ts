import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

import { Management, Collection, DataAnalysis } from '@element-plus/icons-vue';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Management,
      order: 99,
      title: '工具管理',
    },
    name: 'toolMgt',
    path: '/toolMgt',
    children: [
      {
        name: 'flowMgt',
        path: '/toolMgt/flowMgt',
        meta: {
          icon: Collection,
          title: '流程管理',
        },
        children: [
          {
            name: 'modelMgt',
            path: '/toolMgt/flowMgt/modelMgt',
            component: () =>
              import('#/views/toolMgt/flowMgt/modelMgt/index.vue'),
            meta: {
              title: '模型管理',
              keepAlive: true,
            },
          },
          {
            name: 'deploymentMgt',
            path: '/toolMgt/flowMgt/deploymentMgt',
            component: () =>
              import('#/views/toolMgt/flowMgt/deploymentMgt/index.vue'),
            meta: {
              title: '部署管理',
              keepAlive: true,
            },
          },
          {
            name: 'flowMonitor',
            path: '/toolMgt/flowMonitor',
            meta: {
              icon: Collection,
              title: '流程监控',
            },
            children: [
              {
                name: 'flowInstance',
                path: '/toolMgt/flowMonitor/flowInstance',
                component: () =>
                  import('#/views/toolMgt/flowMonitor/flowInstance/index.vue'),
                meta: {
                  title: '流程实例',
                  keepAlive: true,
                },
              },
              {
                name: 'runInstance',
                path: '/toolMgt/flowMonitor/runInstance',
                component: () =>
                  import('#/views/toolMgt/flowMonitor/runInstance/index.vue'),
                meta: {
                  title: '执行实例',
                  keepAlive: true,
                },
              },
              {
                name: 'runHistory',
                path: '/toolMgt/flowMonitor/runHistory',
                component: () =>
                  import('#/views/toolMgt/flowMonitor/runHistory/index.vue'),
                meta: {
                  title: '执行历史',
                  keepAlive: true,
                },
              },
              {
                name: 'workMgt',
                path: '/toolMgt/flowMonitor/workMgt',
                component: () =>
                  import('#/views/toolMgt/flowMonitor/workMgt/index.vue'),
                meta: {
                  title: '作业管理',
                  keepAlive: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },

  {
    component: BasicLayout,
    meta: {
      icon: Management,
      order: 100,
      title: '系统管理',
    },
    name: 'systemMgt',
    path: '/systemMgt',
    children: [
      {
        name: 'FlowUserMgt',
        path: '/systemMgt/flowUserMgt',
        component: () => import('#/views/toolMgt/flowUserMgt/index.vue'),
        meta: {
          title: '流程用户组',
          keepAlive: true,
        },
      },
      {
        name: 'OnlineUser',
        path: '/systemMgt/onlineUser',
        component: () => import('#/views/toolMgt/onlineUser/index.vue'),
        meta: {
          title: '在线用户',
          keepAlive: true,
        },
      },
      {
        name: 'CacheList',
        path: '/systemMgt/cacheList',
        component: () => import('#/views/toolMgt/cache/list.vue'),
        meta: {
          title: '缓存列表',
          keepAlive: true,
        },
      },
      {
        name: 'Operlog',
        path: '/systemMgt/operlog',
        component: () => import('#/views/toolMgt/operlog/index.vue'),
        meta: {
          title: '操作日志',
          keepAlive: true,
        },
      },
      {
        name: 'Logininfo',
        path: '/systemMgt/logininfo',
        component: () => import('#/views/toolMgt/logininfor/index.vue'),
        meta: {
          title: '登录日志',
          keepAlive: true,
        },
      },
    ],
  },
];

export default routes;
