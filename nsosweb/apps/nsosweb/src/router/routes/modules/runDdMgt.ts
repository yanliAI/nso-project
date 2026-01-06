import type { RouteRecordRaw } from 'vue-router'

import { BasicLayout } from '#/layouts'

import { Management, Collection, DataAnalysis, Ticket } from '@element-plus/icons-vue'

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: Management,
      order: -1,
      title: '运行调度管理'
    },
    name: 'RunDdMgt',
    path: '/runDdMgt',
    children: [
      {
        name: 'workbench',
        path: '/runDdMgt/workbench',
        component: () => import('#/views/runDdMgt/workbench/index.vue'),
        meta: {
          icon: Ticket,
          title: '运调工作台',
          openInNewWindow: true
        }
      },
      {
        name: 'personalWorkbench',
        path: '/runDdMgt/personalWorkbench',
        component: () => import('#/views/runDdMgt/personalWorkbench/index.vue'),
        meta: {
          icon: Ticket,
          title: '个人工作台',
          keepAlive: true,
          openInNewWindow: true
        }
      },
      {
        name: 'FaultManage',
        path: '/faultManage',
        children: [
          {
            name: 'faultHandle',
            path: '/faultManage/faultHandle',
            component: () => import('#/views/runDdMgt/faultMgt/faultLog/faultHandleIndex.vue'),
            meta: {
              icon: Ticket,
              title: '故障处置',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'faultReplay',
            path: '/faultManage/faultReplay',
            component: () => import('#/views/runDdMgt/faultMgt/faultLog/faultReplayIndex.vue'),
            meta: {
              icon: Ticket,
              title: '故障复盘',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'assessAnalysis',
            path: '/faultManage/assessAnalysis',
            component: () => import('#/views/runDdMgt/faultMgt/faultLogDetail/dialog/assessAnalysis.vue'),
            meta: {
              icon: Ticket,
              title: '研判分析',
              keepAlive: true,
              openInNewWindow: true,
              hideInMenu: true,
            }
          },
          {
            name: 'TypicalFault',
            path: '/faultManage/typicalFault',
            component: () => import('#/views/runDdMgt/TypicalFault/index.vue'),
            meta: {
              icon: Ticket,
              title: '典型故障库',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'faultReceive',
            path: '/faultManage/faultReceive',
            component: () => import('#/views/runDdMgt/faultMgt/faultReceive/index.vue'),
            meta: {
              icon: Ticket,
              title: '故障接收',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'alarmCenter',
            path: '/alarmCenter',
            // component: () => import('#/views/runDdMgt/alarmCenter/index.vue'),
            meta: {
              icon: Management,
              title: '告警中心',
              keepAlive: true,
              openInNewWindow: true
            },
            children: [
              {
                name: 'runningAlarm',
                path: '/alarmCenter/runningAlarm',
                component: () => import('#/views/runDdMgt/alarmCenter/runningAlarm/index.vue'),
                meta: {
                  icon: Management,
                  title: '运行告警',
                  keepAlive: true,
                  openInNewWindow: true
                },
              },
              {
                name: 'alarmSheet',
                path: '/alarmCenter/alarmSheet',
                component: () => import('#/views/runDdMgt/alarmCenter/alarmSheet/index.vue'),
                meta: {
                  icon: Management,
                  title: '告警转工单',
                  keepAlive: true,
                  openInNewWindow: true
                },
              },
              {
                name: 'securityAlarm',
                path: '/alarmCenter/securityAlarm',
                component: () => import('#/views/runDdMgt/alarmCenter/index.vue'),
                meta: {
                  icon: Management,
                  title: '安全告警',
                  keepAlive: true,
                  openInNewWindow: true
                },
              },
              {
                name: 'dataAlarm',
                path: '/alarmCenter/dataAlarm',
                component: () => import('#/views/runDdMgt/alarmCenter/dataAlarm/dataAlarm.vue'),
                meta: {
                  icon: Management,
                  title: '数据告警',
                  keepAlive: true,
                  openInNewWindow: true
                },
              },
              {
                name: 'linkAlarm',
                path: '/alarmCenter/linkAlarm',
                component: () => import('#/views/runDdMgt/alarmCenter/linkAlarm/index.vue'),
                meta: {
                  icon: Management,
                  title: '全链路工单告警',
                  keepAlive: true,
                  openInNewWindow: true
                },
              }
            ]
          }
        ],
        meta: {
          icon: Management,
          title: '故障管理',
          keepAlive: true
        }
      },
      {
        name: 'cmdMgt',
        path: '/cmdMgt',
        meta: {
          icon: Ticket,
          title: '指令管理',
          keepAlive: true
        },
        children: [
          {
            name: 'cmdRelease',
            path: '/cmdMgt/cmdRelease',
            component: () => import('#/views/runDdMgt/cmdMgt/index.vue'),
            meta: {
              icon: Ticket,
              title: '指令发布',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'cmdTodo',
            path: '/cmdMgt/cmdTodo',
            component: () => import('#/views/runDdMgt/cmdMgt/cmdTodo.vue'),
            meta: {
              icon: Ticket,
              title: '指令接收',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'cmdZHQuery',
            path: '/cmdMgt/cmdZHQuery',
            component: () => import('#/views/runDdMgt/cmdZHQuery/index.vue'),
            meta: {
              icon: Ticket,
              title: '指令查询',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'cmdTemplate',
            path: '/cmdMgt/cmdTemplate',
            component: () => import('#/views/runDdMgt/cmdTemplate/index.vue'),
            meta: {
              icon: Ticket,
              title: '指令模板维护',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'cmdCategory',
            path: '/cmdMgt/cmdCategory',
            component: () => import('#/views/runDdMgt/cmdCategory/index.vue'),
            meta: {
              icon: Ticket,
              title: '指令类别维护',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'cmdCsRule',
            path: '/cmdMgt/cmdCsRule',
            component: () => import('#/views/runDdMgt/cmdCsRule/index.vue'),
            meta: {
              icon: Ticket,
              title: '超时规则配置',
              keepAlive: true,
              openInNewWindow: true
            }
          }
        ]
      },
      {
        name: 'cmdVisual',
        path: '/cmdMgtKsh/cmdVisual',
        component: () => import('#/views/runDdMgt/cmdVisual/index.vue'),
        meta: {
          icon: Ticket,
          title: '指令可视化',
          keepAlive: true,
          openInNewWindow: true
        }
      },
      {
        name: 'HWmgt',
        path: '/HWmgt',
        children: [
          {
            name: 'dutyman',
            path: '/HWmgt/dutyman',
            component: () => import('#/views/runDdMgt/dutyman/index.vue'),
            meta: {
              icon: Management,
              title: '人员角色维护',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutyorg',
            path: '/HWmgt/dutyorg',
            component: () => import('#/views/runDdMgt/dutyorg/index.vue'),
            meta: {
              icon: Management,
              title: '组织角色维护',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutytemplate',
            path: '/HWmgt/dutytemplate',
            component: () => import('#/views/runDdMgt/dutytemplate/index.vue'),
            meta: {
              icon: Management,
              title: '值班模板维护',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'taskPublish',
            path: '/HWmgt/taskPublish',
            component: () => import('#/views/runDdMgt/taskPublish/index.vue'),
            meta: {
              icon: Ticket,
              title: '排班任务发布',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutyTaskFill',
            path: '/HWmgt/dutyTaskFill',
            component: () => import('#/views/runDdMgt/dutyTaskFill/index.vue'),
            meta: {
              icon: Ticket,
              title: '  值班表填报',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutyChange',
            path: '/HWmgt/dutyChange',
            component: () => import('#/views/runDdMgt/dutyTaskFill/change/index.vue'),
            meta: {
              icon: Ticket,
              title: '值班人员变更',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutyConfirm',
            path: '/HWmgt/dutyConfirm',
            component: () => import('#/views/runDdMgt/dutyConfirm/index.vue'),
            meta: {
              icon: Management,
              title: '值班人员确认',
              keepAlive: true,
              openInNewWindow: true
            }
          },
        ],
        meta: {
          icon: Management,
          title: '排班管理',
          keepAlive: true
        }
      },
      {
        name: 'staffVisualisation',
        path: '/runDdMgtZhrydp/staffVisualisation',
        component: () => import('#/views/runDdMgt/staffVisualisation/index.vue'),
        meta: {
          icon: Management,
          title: '值班指挥可视化',
          keepAlive: true,
          openInNewWindow: true
        }
      },
      {
        name: 'shiftMgt',
        path: 'shiftMgt',
        children: [
          // {
          //   name: 'scheduleMgt',
          //   path: '/shiftMgt/scheduleMgt',
          //   component: () => import('#/views/runDdMgt/scheduleMgt/index.vue'),
          //   meta: {
          //     icon: Management,
          //     title: '排班管理',
          //     keepAlive: true,
          //     openInNewWindow: true
          //   }
          // },
          {
            name: 'dutyKanban',
            path: '/shiftMgt/dutyKanban',
            component: () => import('#/views/runDdMgt/dutyMgt/dutyKanban/index.vue'),
            meta: {
              icon: Management,
              title: '个人值班看板',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'calendarMode',
            path: '/shiftMgt/calendarMode',
            component: () => import('#/views/runDdMgt/dutyMgt/calendarMode/calendarMode.vue'),
            meta: {
              icon: Management,
              title: '调度值班排班',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutyMgt',
            path: '/shiftMgt/dutyMgt',
            component: () => import('#/views/runDdMgt/dutyMgt/index.vue'),
            meta: {
              icon: Management,
              title: '值班记录查询',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutyPeopleMgt',
            path: '/shiftMgt/dutyPeopleMgt',
            component: () => import('#/views/runDdMgt/dutyMgt/dutyPeopleIndex.vue'),
            meta: {
              icon: Management,
              title: '调度人员信息管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'dutyLog',
            path: '/shiftMgt/dutyLog',
            component: () => import('#/views/runDdMgt/dutyLog/index.vue'),
            meta: {
              icon: Management,
              title: '值班日志',
              keepAlive: true,
              openInNewWindow: true
            }
          }
        ],
        meta: {
          icon: Management,
          title: '值班管理',
          keepAlive: true
        }
      },
      {
        name: 'otherMgt',
        path: 'otherMgt',
        children: [
          {
            name: 'WorkFlow',
            path: '/workflow',
            children: [
              {
                name: 'TodaySummary',
                path: '/workflow/todaysummary',
                component: () => import('#/views/runDdMgt/todaySummary/index.vue'),
                meta: {
                  icon: Management,
                  title: '任务统计模板管理 ',
                  openInNewWindow: true
                }
              },
              {
                name: 'workFlowTemplate',
                path: '/workflow/workFlowTemplate',
                component: () => import('#/views/runDdMgt/workFlowTemplate/index.vue'),
                meta: {
                  icon: Management,
                  title: '协同流程模板管理 ',
                  openInNewWindow: true
                }
              }
            ],
            meta: {
              icon: Management,
              title: '协同流程管理',
              openInNewWindow: true
            }
          },
          {
            name: 'AlarmRulesConfig',
            path: '/runDdMgt/AlarmRulesConfig',
            component: () => import('#/views/runDdMgt/AlarmRulesConfig/index.vue'),
            meta: {
              icon: Ticket,
              title: '告警专家规则库',
              openInNewWindow: true
            }
          },
          {
            name: 'Guarantee',
            path: '/guarantee',
            meta: {
              title: '专项活动指挥'
            },
            children: [
              {
                name: 'GuaranteeCalendar',
                path: '/guarantee/guaranteeCalendar',
                component: () => import('#/views/guarantee/calendar/index.vue'),
                meta: {
                  title: '保障日历',
                  openInNewWindow: true
                }
              },
              {
                name: 'GuaranteeTask',
                path: '/guarantee/guaranteeTask',
                component: () => import('#/views/guarantee/task/index.vue'),
                meta: {
                  title: '保障任务',
                  openInNewWindow: true
                }
              }
            ]
          },
          
          {
            name: 'infoSubmission',
            path: '/runDdMgt/infoSubmission',
            component: () => import('#/views/runDdMgt/infoSubmission/index.vue'),
            meta: {
              icon: Management,
              title: '信息报送',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'loopholeMgt',
            path: '/runDdMgt/loopholeMgt',
            component: () => import('#/views/runDdMgt/loopholeMgt/index.vue'),
            meta: {
              icon: Management,
              title: '漏洞管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'meetingMgt',
            path: '/runDdMgt/meetingMgt',
            component: () => import('#/views/runDdMgt/meetingMgt/index.vue'),
            meta: {
              icon: Management,
              title: '会议管理',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'commandMgt',
            path: '/runDdMgt/commandMgt',
            component: () => import('#/views/runDdMgt/commandMgt/index.vue'),
            meta: {
              icon: Management,
              title: '指挥体系维护',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'faultKnowledgeBase',
            path: '/faultManage/faultKnowledgeBase',
            component: () => import('#/views/runDdMgt/faultMgt/faultKnowledgeBase/index.vue'),
            meta: {
              icon: Ticket,
              title: '故障知识库',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'ComQuery',
            path: '/faultManage/comQuery',
            component: () => import('#/views/runDdMgt/faultMgt/comQuery/index.vue'),
            meta: {
              icon: Ticket,
              title: '综合查询',
              keepAlive: true,
              openInNewWindow: true
            }
          },
          {
            name: 'selectQuery',
            path: '/faultManage/selectQuery',
            component: () => import('#/views/runDdMgt/faultMgt/selectQuery/index.vue'),
            meta: {
              icon: Ticket,
              title: '下拉查询',
              keepAlive: true,
              openInNewWindow: true
            }
          }
          // ,
          // {
          //   name: 'NotifyRecord',
          //   path: '/faultManage/notifyRecord',
          //   component: () => import('#/views/runDdMgt/notifyRecord/index.vue'),
          //   meta: {
          //     icon: Ticket,
          //     title: '通知记录及催办记录(弹窗)',
          //     keepAlive: true,
          //     openInNewWindow: true
          //   }
          // },
          // {
          //   name: 'TypicalFaultLibrary',
          //   path: '/faultManage/typicalFaultLibrary',
          //   component: () => import('#/views/runDdMgt/TypicalFaultLibrary/index.vue'),
          //   meta: {
          //     icon: Ticket,
          //     title: '典型故障库(旧)',
          //     keepAlive: true,
          //     openInNewWindow: true
          //   }
          // }
        ],
        meta: {
          icon: Management,
          title: '业务支撑',
          keepAlive: true
        }
      },
      {
        name: 'sms',
        path: '/runDdMgt/smsMgt',
        component: () => import('#/views/runDdMgt/smsMgt/index.vue'),
        meta: {
          icon: Ticket,
          title: '消息通知管理',
          openInNewWindow: true
        }
      },
    ]
  }
]

export default routes
