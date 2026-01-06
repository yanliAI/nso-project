import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

import { Management, Collection, DataAnalysis, Ticket } from '@element-plus/icons-vue'

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Management,
      order: 99,
      title: '综合支持管理',
    },
    name: 'ComSupportMgt',
    path: '/comSupportMgt',
    children: [
      {
        name: 'evaluate',
        path: '/evaluate',
        meta: {
          icon: Management,
          title: '评价管理',
        },
        children: [
          {
            name: 'evaluateRuleManageYDPJ',
            path: '/evaluate/ruleManage/ydpj',
            component: () => import('#/views/comSupportMgt/evaluateRuleMgt/index.vue'),
            meta: {
              icon: Management,
              title: '运调评价规则配置',
              openInNewWindow: true,
            }
          },
          {
            name: 'evaluateRuleManageYYZH',
            path: '/evaluate/ruleManage/yyzh',
            component: () => import('#/views/comSupportMgt/evaluateRuleMgt/index.vue'),
            meta: {
              icon: Management,
              title: '运营综合绩效监控',
              openInNewWindow: true,
            }
          },
          {
            name: 'evaluateRuleManageSZH',
            path: '/evaluate/ruleManage/szh',
            component: () => import('#/views/comSupportMgt/evaluateRuleMgt/index.vue'),
            meta: {
              icon: Management,
              title: '数字化运维水平评价',
              openInNewWindow: true,
            }
          },
          {
            name: 'evaluateRuleManageXXAQ',
            path: '/evaluate/ruleManage/xxaq',
            component: () => import('#/views/comSupportMgt/evaluateRuleMgt/index.vue'),
            meta: {
              icon: Management,
              title: '信息安全防护水平',
              openInNewWindow: true,
            }
          },
          {
            name: 'ydEvaluateManage',
            path: '/evaluate/ydEvaluateManage',
            component: () => import('#/views/comSupportMgt/ydEvaluateManage/index.vue'),
            meta: {
              icon: Management,
              title: '信息评价',
              openInNewWindow: true,
            }
          },
          // {
          //   name: 'yunweiEvaluateManage',
          //   path: '/evaluate/yunweiEvaluateManage',
          //   component: () => import('#/views/comSupportMgt/yunweiEvaluateManage/index.vue'),
          //   meta: {
          //     icon: Management,
          //     title: '运维序列评价管理',
          //     openInNewWindow: true,
          //   }
          // },
        ]
      },
      {
        name: 'panoramicMonitoring',
        path: '/panoramicMonitoring',
        meta: {
          icon: Management,
          title: '运行监测',
        },
        children: [
          {
            name: 'dynamicalBalance',
            path: '/panoramicMonitoring/dynamicalBalance',
            component: () => import('#/views/comSupportMgt/dynamicalBalance/index.vue'),
            meta: {
              icon: Ticket,
              title: '资源动态均衡',
              openInNewWindow: true,
            },
          },
        ]
      },
      {
        name: 'report',
        path: '/report',
        meta: {
          icon: Management,
          title: '调度报表智能生成',
        },
        children: [
          {
            name: 'reportTemplate',
            path: '/report/reportTemplate',
            component: () => import('#/views/comSupportMgt/reportTemplate/index.vue'),
            meta: {
              icon: Management,
              title: '标准报表模板',
              openInNewWindow: true,
            }
          },
          {
            name: 'reportList',
            path: '/report/reportList',
            component: () => import('#/views/comSupportMgt/reportList/index.vue'),
            meta: {
              icon: Management,
              title: '报表列表 ',
              openInNewWindow: true,
            }
          }
        ]
      },
      {
        name: 'knowledgeMgt',
        path: '/knowledgeMgt',
        meta: {
          icon: Management,
          title: '运调体系知识管理',
        },
        children: [
          {
            name: 'knowledgeManage',
            path: '/knowledgeMgt/knowledgeManage',
            component: () => import('#/views/comSupportMgt/knowledgeMgt/index.vue'),
            meta: {
              icon: Ticket,
              title: '运调体系知识管理',
              openInNewWindow: true,
            },
          },
          {
            name: 'knowledgeExamine',
            path: '/knowledgeMgt/knowledgeExamine',
            component: () => import('#/views/comSupportMgt/knowledgeExamine/index.vue'),
            meta: {
              icon: Ticket,
              title: '运调体系知识审核',
              openInNewWindow: true,
            },
          },
          {
            name: 'knowledgeQuery',
            path: '/knowledgeMgt/knowledgeQuery',
            component: () => import('#/views/comSupportMgt/knowledgeQuery/index.vue'),
            meta: {
              icon: Ticket,
              title: '运调体系知识查询',
              openInNewWindow: true,
            },
          },
        ]
      },
      {
        name: 'operationsOverview',
        path: '/comSupportMgt/operationsOverview',
        component: () => import('#/views/comSupportMgt/operationsOverview/index.vue'),
        meta: {
          icon: Management,
          title: '运维总览',
          openInNewWindow: true,
        },
      },
      {
        name: 'bzMgt',
        path: '/bzMgt',
        meta: {
          icon: Management,
          title: '保障工作智能管理',
        },
        children: [
          {
            name: 'zbTask',
            path: '/bzMgt/zbTask',
            meta: {
              icon: Management,
              title: '保障任务发布',
            },
            component: () => import('#/views/comSupportMgt/zbTaskMgt/zbTaskList.vue'),
          },
          {
            name: 'qxMgt',
            path: '/qxMgt',
            meta: {
              icon: Management,
              title: '缺陷通知管理',
            },
            children: [
              {
                name: 'defectNotificationMgtTb',
                path: '/qxMgt/defectNotificationMgtTb',
                component: () => import('#/views/comSupportMgt/defectNotificationMgt/index.vue'),
                meta: {
                icon: Collection,
                title: '信息填报',
                keepAlive: true,
                openInNewWindow: true,
                }
              },
              {
                name: 'defectNotificationCl',
                path: '/qxMgt/defectNotificationMgtCl',
                component: () => import('#/views/comSupportMgt/defectNotificationMgt/index2.vue'),
                meta: {
                icon: Collection,
                title: '现场处理',
                keepAlive: true,
                openInNewWindow: true,
                }
              },
              {
                name: 'defectNotificationMgtGd',
                path: '/qxMgt/defectNotificationMgtGd',
                component: () => import('#/views/comSupportMgt/defectNotificationMgt/index3.vue'),
                meta: {
                icon: Collection,
                title: '待归档',
                keepAlive: true,
                openInNewWindow: true,
                }
              },
              {
                name: 'defectNotificationTypeMgt',
                path: '/qxMgt/defectNotificationTypeMgt',
                component: () => import('#/views/comSupportMgt/defectNotificationMgt/defectTypeManage.vue'),
                meta: {
                icon: Collection,
                title: '缺陷处置策略维护',
                keepAlive: true,
                openInNewWindow: true,
                }
              }
            ]
          },

          {
            name: 'patchMgt',
            path: '/bzMgt/patchMgt',
            component: () => import('#/views/comSupportMgt/patchMgt/index.vue'),
            meta: {
              icon: Ticket,
              title: '补丁管理',
              openInNewWindow: true,
            },
          }
        ]
      }
    ],
  },
];

export default routes;
