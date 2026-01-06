import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';
import { HomeFilled, Menu, Histogram } from '@element-plus/icons-vue';
const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Menu,
      order: 999,
      title: '数据调度',
      openInNewWindow: false,
    },
    name: 'DataScheduling',
    path: '/data/scheduling',
  },
];

export default routes;
