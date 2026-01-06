import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

import { Management, Collection, DataAnalysis } from '@element-plus/icons-vue';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Management,
      order: -1,
      title: '台账信息管理',
    },
    name: 'StandBookMgt',
    path: '/standBookMgt',
    children: [
      {
        name: 'PeopleInformationMgt',
        path: '/standBookMgt/peopleInformationMgt',
        component: () =>
          import('#/views/standBookMgt/peopleInformationMgt/index.vue'),
        meta: {
          icon: Management,
          title: '研判专家组管理',
          keepAlive: true,
          openInNewWindow: true,
        },
      },
      {
        name: 'tzDataMgt',
        path: '/tzDataMgt',
        meta: {
          icon: Management,
          title: '台账数据管理',
        },
        children: [
          {
            name: '/systemInfo',
            path: '/tzDataMgt/systemInfo',
            component: () =>
              import('#/views/standBookMgt/tzDataMgt/systemInfo/index.vue'),
            meta: {
              icon: Management,
              title: '系统信息',
              keepAlive: true,
              openInNewWindow: true,
            },
          },
          {
            name: '/tzCheckRule',
            path: '/tzDataMgt/tzCheckRule',
            component: () =>
              import('#/views/standBookMgt/tzDataMgt/tzCheckRule/index.vue'),
            meta: {
              icon: Management,
              title: '核查规则管理',
              keepAlive: true,
              openInNewWindow: true,
            },
          },
          {
            name: '/tzCheck',
            path: '/tzDataMgt/tzCheck',
            component: () =>
              import('#/views/standBookMgt/tzDataMgt/tzCheck/index.vue'),
            meta: {
              icon: Management,
              title: '台账核查',
              keepAlive: true,
              openInNewWindow: true,
            },
          },
          {
            name: '/tzCheckResult',
            path: '/tzDataMgt/tzCheckResult',
            component: () =>
              import('#/views/standBookMgt/tzDataMgt/tzCheckResult/index.vue'),
            meta: {
              icon: Management,
              title: '台账核查结果',
              keepAlive: true,
              openInNewWindow: true,
            },
          },
          {
            name: '/tzChangeOrder',
            path: '/tzDataMgt/tzChangeOrder',
            component: () =>
              import('#/views/standBookMgt/tzDataMgt/tzChangeOrder/index.vue'),
            meta: {
              icon: Management,
              title: '台账变更工单管理',
              keepAlive: true,
              openInNewWindow: true,
            },
          },
        ],
      },
      {
        name: 'DrawingInfoMgt',
        path: '/drawingInfoMgt',
        meta: {
          icon: Management,
          title: '图纸质量管理',
        },
        children: [
          {
            name: 'DrawingInfoList',
            path: '/drawingInfoMgt/drawingInfo',
            component: () =>
              import(
                '#/views/standBookMgt/drawingInfoMgt/drawingList/index.vue'
              ),
            meta: {
              icon: Collection,
              title: '图纸信息',
              keepAlive: true,
              openInNewWindow: true,
            },
          },
          {
            name: 'DrawingInfoRuleMgt',
            path: '/drawingInfoMgt/drawingInfoRuleMgt',
            component: () =>
              import('#/views/standBookMgt/drawingInfoMgt/ruleMgt/index.vue'),
            meta: {
              icon: Collection,
              title: '核查规则管理',
              keepAlive: true,
              openInNewWindow: true,
            },
          },
        ],
      },
    ],
  },
];

export default routes;
