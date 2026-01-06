import type { RouteRecordRaw } from 'vue-router'

import { Collection, Management } from '@element-plus/icons-vue'

import { BasicLayout } from '#/layouts'

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Management,
      order: -1,
      title: '运行方式管理'
    },
    name: 'RunModeMgt',
    path: '/runModeMgt',
    children: [
      // {
      //   name: 'WorkFlow',
      //   path: '/runscheduling/workflow',
      //   component: () => import('#/views/workbench/workFlowTemplate.vue'),
      //   meta: {
      //     icon: 'mdi:home',
      //     title: '协同流程管理',
      //   }
      // },
      {
        name: 'WorkPlanBalance',
        path: '/workPlanBalance',
        meta: {
          icon: Collection,
          title: '作业计划平衡'
        },
        children: [
          {
            name: 'AbilityAssessment',
            path: '/workPlanBalance/abilityAssessment',
            component: () => import('#/views/runModeMgt/workPlanBalance/abilityAssessment/index.vue'),
            meta: {
              title: '工作人员能力评估',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'jobInfo',
            path: '/workPlanBalance/jobInfo',
            component: () => import('#/views/runModeMgt/workPlanBalance/jobInfo/index.vue'),
            meta: {
              title: '信息两票',
              openInNewWindow: true,
              keepAlive: true,
            }
          },
          // hideInMenu: true,
          {
            name: 'myAgent',
            path: '/workPlanBalance/myAgent',
            component: () => import('#/views/runModeMgt/workPlanBalance/myAgent/index.vue'),
            meta: {
              title: '方式待办',
              keepAlive: true,
              openInNewWindow: true,
            }
          },
          {
            name: 'orderSearch',
            path: '/workPlanBalance/orderSearch',
            component: () => import('#/views/runModeMgt/workPlanBalance/orderSearch/index.vue'),
            meta: {
              title: '信息两票查询',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'userPreference',
            path: '/workPlanBalance/userPreference',
            component: () => import('#/views/runModeMgt/workPlanBalance/userPreference/index.vue'),
            meta: {
              title: '用户个人信息配置',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'checkUserGroup',
            path: '/workPlanBalance/checkUserGroup',
            component: () => import('#/views/runModeMgt/workPlanBalance/checkUserGroup/index.vue'),
            meta: {
              title: '审查用户组管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'AbilityProfile',
            path: '/workPlanBalance/abilityProfile',
            component: () => import('#/views/runModeMgt/workPlanBalance/abilityProfile/index.vue'),
            meta: {
              title: '作业人员能力画像',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'profileDetail',
            path: '/workPlanBalance/profileDetail',
            component: () => import('#/views/runModeMgt/workPlanBalance/profileDetail/index.vue'),
            props: true,
            meta: {
              title: '画像详情',
              // 在左侧菜单中隐藏
              hideInMenu: true,
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'PlanBalance',
            path: '/workPlanBalance/planBalance',
            component: () => import('#/views/runModeMgt/workPlanBalance/planBalance/index.vue'),
            meta: {
              title: '作业计划平衡',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'workOrderReview',
            path: '/workPlanBalance/workOrderReview',
            component: () => import('#/views/runModeMgt/workPlanBalance/workOrderReview/index.vue'),
            meta: {
              title: '智能审查规则配置',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'BalanceMgt',
            path: '/workPlanBalance/balanceMgt',
            component: () => import('#/views/runModeMgt/workPlanBalance/balanceMgt/index.vue'),
            meta: {
              title: '作业均衡管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'IntelligentAllocation',
            path: '/workPlanBalance/intelligentAllocation',
            component: () => import('#/views/runModeMgt/workPlanBalance/intelligentAllocation/index.vue'),
            meta: {
              title: '作业智能分配',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'IntelligentReview',
            path: '/workPlanBalance/intelligentReview',
            component: () => import('#/views/runModeMgt/workPlanBalance/intelligentReview/index.vue'),
            meta: {
              title: '作业智能审查',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'RiskAssessment',
            path: '/workPlanBalance/riskAssessment',
            component: () => import('#/views/runModeMgt/workPlanBalance/riskAssessment/index.vue'),
            meta: {
              title: '作业风险评估',
              keepAlive: true,
              openInNewWindow: true
            }
          }
        ]
      },

      {
        name: 'EmergencyMgt',
        path: '/emergencyMgt',
        meta: {
          icon: Collection,
          title: '应急管理'
          // 此角色无权查看
          // authority: ['1992'],
        },
        children: [
          {
            name: 'EmergencyPlanMgt',
            path: '/emergencyMgt/emergencyPlanMgt',
            component: () => import('#/views/runModeMgt/emergencyMgt/emergencyPlanMgt/index.vue'),
            meta: {
              title: '应急预案管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'EmergencyCardMgt',
            path: '/emergencyMgt/emergencyCardMgt',
            component: () => import('#/views/runModeMgt/emergencyMgt/emergencyCardMgt/index.vue'),
            meta: {
              title: '应急卡片管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'EmergencyDrillTaskMgt',
            path: '/emergencyMgt/emergencyDrillTaskMgt',
            component: () => import('#/views/runModeMgt/emergencyMgt/emergencyDrillTaskMgt/index.vue'),
            meta: {
              title: '应急演练任务管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'DrillPlanSubmission',
            path: '/emergencyMgt/drillPlanSubmission',
            component: () => import('#/views/runModeMgt/emergencyMgt/drillPlanSubmission/index.vue'),
            meta: {
              title: '应急演练计划填报',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'DrillPlanExecute',
            path: '/emergencyMgt/drillPlanExecute',
            component: () => import('#/views/runModeMgt/emergencyMgt/drillPlanExecute/index.vue'),
            meta: {
              title: '应急演练计划执行',
              keepAlive: true,
              openInNewWindow: true
            }
          }
        ]
      },

      {
        name: 'RunModeAnalysis',
        path: '/runModeAnalysis',
        meta: {
          icon: Collection,
          title: '运行方式分析'
        },
        children: [
          {
            name: 'SpecialRunModeBigScreen',
            path: '/runModeAnalysis/specialRunModeBigScreen',
            component: () => import('#/views/runModeMgt/runModeAnalysis/specialRunModeBigScreen/index.vue'),
            meta: {
              title: '特殊运行方式大屏',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'test',
            path: '/runModeAnalysis/test',
            component: () => import('#/views/runModeMgt/runModeAnalysis/specialRunModeBigScreen/test.vue'),
            meta: {
              title: '测试',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'confirmationOfRunPlan',
            path: '/runModeAnalysis/confirmationOfRunPlan',
            component: () => import('#/views/runModeMgt/runModeAnalysis/confirmationOfRunPlan/index.vue'),
            meta: {
              title: '运行方式探测管理',
              keepAlive: true
            }
          },
          {
            name: 'runModeOperation',
            path: '/runModeAnalysis/runModeOperation',
            component: () => import('#/views/runModeMgt/runModeAnalysis/runModeOperation/index.vue'),
            meta: {
              title: '运行方式收资',
              keepAlive: true
            }
          },
          {
            name: 'collectionHeadMgt',
            path: '/runModeAnalysis/collectionHeadMgt',
            component: () => import('#/views/runModeMgt/runModeAnalysis/collectionHeadMgt/index.vue'),
            meta: {
              title: '收资负责人管理',
              keepAlive: true
            }
          }
          // {
          //   name: 'questionAnswering',
          //   path: '/intellectualDialogue/questionAnswering',
          //   component: () =>
          //     import(
          //       '#/views/runModeMgt/intellectualDialogue/questionAnswering/index.vue'
          //     ),
          //   meta: {
          //     title: '智能小助手',
          //     keepAlive: true,
          //     openInNewWindow: true,
          //   },
          // },
        ]
      },

      {
        name: 'GridConnectionAnalysis',
        path: '/gridConnectionAnalysis',
        meta: {
          icon: Collection,
          title: '并网审查'
        },
        children: [
          {
            name: 'GridConnectionIntelligentReview',
            path: '/gridConnectionAnalysis/intelligentReview',
            component: () => import('#/views/runModeMgt/gridConnectionAnalysis/intelligentReview/index.vue'),
            meta: {
              icon: Collection,
              title: '并网智能审查',
              keepAlive: true,
              openInNewWindow: true
            }
          },
         {
            name: 'gridOrderDetails',
            path: '/gridConnectionAnalysis/gridOrderDetails',
            component: () => import('#/views/runModeMgt/gridConnectionAnalysis/gridOrderDetails/index.vue'),
            meta: {
              icon: Collection,
              title: '并网工单详情',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'gridRulesSetting',
            path: '/gridConnectionAnalysis/gridRulesSetting',
            component: () => import('#/views/runModeMgt/gridConnectionAnalysis/gridRulesSetting/index.vue'),
            meta: {
              icon: Collection,
              title: '并网审查项管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'gridList',
            path: '/gridConnectionAnalysis/gridList',
            component: () => import('#/views/runModeMgt/gridConnectionAnalysis/gridList/index.vue'),
            meta: {
              icon: Collection,
              title: '并网清单',
              keepAlive: true,
              openInNewWindow: true
            }
          }
        ]
      },
      {
        name: 'FixedValueMgt',
        path: '/fixedValueMgt',
        meta: {
          icon: Collection,
          title: '定值管理'
        },
        children: [
          {
            name: 'FixedAutoSupervision',
            path: '/fixedValueMgt/fixedAutoSupervision',
            component: () => import('#/views/runModeMgt/fixedValueMgt/fixedAutoSupervision/index.vue'),
            meta: {
              icon: Collection,
              title: '定值自动监督',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'FixedValueRuleMgt',
            path: '/fixedValueMgt/ruleMgt',
            component: () => import('#/views/runModeMgt/fixedValueMgt/ruleMgt/index.vue'),
            meta: {
              icon: Collection,
              title: '规则管理',
              keepAlive: true,
              openInNewWindow: true
            }
          }
        ]
      },

      {
        name: 'returnMgt',
        path: '/returnMgt',
        meta: {
          icon: Collection,
          title: '退运管理'
        },
        children: [
          {
            name: 'runModeAnalysis',
            path: '/returnMgt/runModeAnalysis',
            component: () => import('#/views/runModeMgt/returnAnalysis/index.vue'),
            meta: {
              title: '退运智能分析',
              keepAlive: true
            }
          }
        ]
      },

      {
        name: 'networkOperationMgt',
        path: '/networkOperationMgt',
        meta: {
          icon: Collection,
          title: '网络安全运行管理'
          // 此角色无权查看
          // authority: ['1991'],
        },
        children: [
          {
            name: 'panoramaMonitorAlertAnalysis',
            path: '/networkOperationMgt/panoramaMonitorAlertAnalysis',
            component: () => import('#/views/runModeMgt/networkOperationMgt/panoramaMonitorAlertAnalysis/index.vue'),
            meta: {
              title: '全景监测预警分析',
              keepAlive: true
            }
          },
          {
            name: 'infraVisMonitoringMgmt',
            path: '/networkOperationMgt/infraVisMonitoringMgmt',
            component: () => import('#/views/runModeMgt/networkOperationMgt/infraVisMonitoringMgmt/index.vue'),
            meta: {
              title: '基础设施可视化监视管理',
              keepAlive: true
            }
          },
          {
            name: 'infraNetworkTopo',
            path: '/networkOperationMgt/infraNetworkTopo',
            component: () => import('#/views/runModeMgt/networkOperationMgt/infraNetworkTopo/index.vue'),
            meta: {
              title: '基础设施网络拓扑',
              keepAlive: true
            }
          }
        ]
      },

      {
        name: 'monthlyReport',
        path: '/monthlyReport',
        meta: {
          icon: Collection,
          title: '运行方式月报智能生成'
        },
        children: [
          {
            name: 'reportCollectionMgt',
            path: '/monthlyReport/reportCollectionMgt',
            component: () => import('#/views/runModeMgt/monthlyReport/reportCollectionMgt/index.vue'),
            meta: {
              title: '月报收资管理',
              keepAlive: true
            }
          },
          {
            name: 'reportTemplatesMgt',
            path: '/monthlyReport/reportTemplatesMgt',
            component: () => import('#/views/runModeMgt/monthlyReport/reportTemplatesMgt/index.vue'),
            meta: {
              title: '月报模板管理',
              keepAlive: true
            }
          },
          {
            name: 'reportGenerate',
            path: '/monthlyReport/reportGenerate',
            component: () => import('#/views/runModeMgt/monthlyReport/reportGenerate/index.vue'),
            meta: {
              title: '月报智能生成',
              keepAlive: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
