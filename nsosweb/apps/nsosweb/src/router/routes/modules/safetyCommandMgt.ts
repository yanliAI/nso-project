import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

import { Management, Collection, DataAnalysis } from '@element-plus/icons-vue';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Management,
      order: -1,
      title: '安全指挥管理',
      // 此角色无权查看
      // authority: ['1991', '1992'],
    },
    name: 'SafetyCommandMgt',
    path: '/safetyCommandMgt',
    children: [
      {
        name: 'WallChartOperation',
        path: '/safetyCommandMgt/wallChartOperation',
        component: () =>
          import('#/views/safetyCommandMgt/wallChartOperation/index.vue'),
        meta: {
          icon: Collection,
          title: '挂图作战',
          keepAlive: true,
          openInNewWindow: true,
        },
      },
      {
        name: 'DeploymentMapMgt',
        path: '/safetyCommandMgt/deploymentMapMgt',
        component: () =>
          import('#/views/safetyCommandMgt/deploymentMapMgt/index.vue'),
        meta: {
          icon: Collection,
          title: '布防图管理',
          keepAlive: true,
          openInNewWindow: true,
        },
      },
      {
        name: 'ThreatIntelligence',
        path: '/safetyCommandMgt/threatIntelligence',
        component: () =>
          import('#/views/safetyCommandMgt/threatIntelligence/index.vue'),
        meta: {
          icon: Collection,
          title: '威胁情报管理',
          keepAlive: true,
          openInNewWindow: true,
        },
      },
      {
        name: 'VulnerabilityMgt',
        path: '/safetyCommandMgt/vulnerabilityMgt',
        component: () =>
          import('#/views/safetyCommandMgt/vulnerabilityMgt/index.vue'),
        meta: {
          icon: Collection,
          title: '漏洞管理',
          keepAlive: true,
          openInNewWindow: true,
        },
      },
      {
        name: 'rankingOperation',
        path: '/safetyCommandMgt/rankingOperation',
        component: () =>
          import('#/views/safetyCommandMgt/addRankingData/index.vue'),
        meta: {
          icon: Collection,
          title: '先锋榜管理',
          keepAlive: true,
          openInNewWindow: true,
        },
      },
      {
        name: 'rankingList',
        path: '/safetyCommandMgt/rankingList',
        component: () =>
          import('#/views/safetyCommandMgt/rankingList/index.vue'),
        meta: {
          icon: Collection,
          title: '先锋榜',
          keepAlive: true,
          openInNewWindow: true,
        },
      },
      {
        name: 'flawMgt',
        path: '/safetyCommandMgt/flawMgt',
        meta: {
          icon: Collection,
          title: '缺陷管理',
        },
        children: [
          {
            name: 'vulnerabilityAssess',
            path: '/safetyCommandMgt/flawMgt/vulnerabilityAssess',
            component: () =>
              import(
                '#/views/safetyCommandMgt/flawMgt/vulnerabilityAssess/index.vue'
              ),
            meta: {
              title: '基于数学模型的漏洞评估管理',
              keepAlive: true,
            },
          },
          {
            name: 'threatMgt',
            path: '/safetyCommandMgt/flawMgt/threatMgt',
            component: () =>
              import('#/views/safetyCommandMgt/flawMgt/threatMgt/index.vue'),
            meta: {
              title: '资产威胁管理',
              keepAlive: true,
            },
          },
          {
            name: 'closeLoopMgt',
            path: '/safetyCommandMgt/flawMgt/closeLoopMgt',
            component: () =>
              import('#/views/safetyCommandMgt/flawMgt/closeLoopMgt/index.vue'),
            meta: {
              title: '漏洞闭环管理',
              keepAlive: true,
            },
          },
        ],
      },
    ],
  },
];

export default routes;
