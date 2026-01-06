import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';
import { HomeFilled, Menu, Histogram } from '@element-plus/icons-vue'

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Menu,
      order: -2,
      title: $t('page.dashboard.title'),
    },
    name: 'Dashboard',
    path: '/',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: () => import('#/views/dashboard/analytics/index.vue'),
        meta: {
          affixTab: false,
          icon: Histogram,
          title: $t('page.dashboard.analytics'),
        },
      },
      /* {
        name: 'Workspace',
        path: '/workspace',
        component: () => import('#/views/dashboard/workspace/index.vue'),
        meta: {
          icon: HomeFilled,
          title: $t('page.dashboard.workspace'),
        },
      }, 
      {
        name: 'attach',
        path: '/attach',
        component: () => import('#/views/basic/attach/testCompontent.vue'),
        meta: {
          icon: HomeFilled,
          title: '组件测试',
        },
      },*/
    ],
  },
];

export default routes;
