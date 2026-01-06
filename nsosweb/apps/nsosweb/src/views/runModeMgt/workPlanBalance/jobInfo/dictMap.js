const dictMap = [
  {
    name: '计划类型',
    dict: '18001001',
    key: 'planType',
    order: 0,
    dictMap: [
      {
        value: 1,
        label: '年作业计划'
      },
      {
        value: 2,
        label: '月作业计划'
      },
      {
        value: 3,
        label: '周作业计划'
      },
      {
        value: 4,
        label: '临时作业计划'
      }
    ]
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否需要申请使用Windows跳板机',
    dict: 'isWindowsHost',
    key: 'isWindowsHost',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '预授权作业',
    dict: 'preAuthorizeTasks',
    key: 'preAuthorizeTasks',
    order: 0
  },
  {
    name: '作业环境',
    dict: '180010041',
    key: 'networkenv',
    order: 1,
    dictMap: [
      {
        value: 1,
        label: '灾备环境'
      },
      {
        value: 2,
        label: '生产环境'
      },
      {
        value: 3,
        label: '研发环境'
      },
      {
        value: 4,
        label: '仿真环境'
      },
    ]
  },
  {
    name: '工作许可人',
    dict: '',
    key: 'licensorUserName',
    order: 2
  },
  {
    name: '用户性质',
    dict: '900702',
    key: 'userKind',
    order: 5
  },
  {
    name: '信息工作票类型',
    dict: '1800802',
    key: 'operationType',
    order: 5,
    dictMap: [
      {
        value: 1,
        label: '信息第一种票'
      },
      {
        value: 2,
        label: '信息第二种票'
      },
      {
        value: 3,
        label: '信息紧急工作票'
      }
    ]
  },
  {
    name: '计划来源',
    dict: '18001003',
    key: 'planSrc',
    order: 5,
    dictMap: [
      {
        value: 1,
        label: '工作任务'
      },
      {
        value: 2,
        label: '运行方式'
      },
      {
        value: 3,
        label: '系统并网'
      },
      {
        value: 4,
        label: '系统缺陷'
      },
      {
        value: 5,
        label: '调度指令'
      },
      {
        value: 6,
        label: '其它'
      }
    ]
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '涉及运行方式变更',
    dict: 'runChange',
    key: 'runChange',
    order: 5
  },
  {
    name: '作业时段/重保等级',
    dict: '180010062',
    key: 'heavyLevel',
    order: 5,
    dictMap: [
      {
        value: 1,
        label: '非重保时段'
      },
      {
        value: 2,
        label: '二级及其他重保时段'
      },
      {
        value: 3,
        label: '一级重保时段'
      },
      {
        value: 4,
        label: '特级重保时段'
      }
    ]
  },
  {
    name: '作业风险/风险等级',
    dict: '18001002',
    key: 'riskLevel',
    order: 5,
    dictMap: [
      {
        value: 5,
        label: '可接受'
      },
      {
        value: 1,
        label: '低'
      },
      {
        value: 2,
        label: '中'
      },
      {
        value: 3,
        label: '高'
      }
    ]
  },
  {
    name: '涉及元数据变更',
    dict: '300710',
    key: 'metadataChange',
    order: 5
  },
  {
    name: '工作票签发人',
    dict: '',
    key: 'signerUser',
    order: 5
  },
  {
    name: '工作票会签人',
    dict: '',
    key: 'countersignUserName',
    order: 5
  },
  {
    name: '值班负责人',
    dict: '',
    key: 'dutyUserName',
    order: 5
  },
  {
    name: '运调许可人',
    dict: '',
    key: 'permissionUserName',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否使用堡垒机',
    dict: 'isUseBastion',
    key: 'isUseBastion',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '信息修正是否打开',
    dict: 'isHalt',
    key: 'isCorrection',
    order: 5
  },
  {
    name: '作业对象类型',
    dict: '1800801',
    key: 'objectType',
    order: 5,
    dictMap: [
      {
        value: 1,
        label: '应用系统'
      },
      {
        value: 2,
        label: '主机'
      },
      {
        value: 3,
        label: '中间件'
      },
      {
        value: 4,
        label: '数据库'
      },
      {
        value: 5,
        label: '网络设备'
      },
      {
        value: 6,
        label: '安全设备'
      },
      {
        value: 7,
        label: '存储设备'
      },
      {
        value: 8,
        label: '机房环境'
      },
      {
        value: 9,
        label: '其它'
      }
    ]
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '影响业务',
    dict: 'affectBusiness',
    key: 'affectBusiness',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '补充操作票内容',
    dict: 'replenishTicket',
    key: 'replenishTicket',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '影响其它系统',
    dict: 'effectApp',
    key: 'effectApp',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否发布类作业',
    dict: 'isPublishJob',
    key: 'isPublishJob',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否重保',
    dict: 'isFloodPeriod',
    key: 'isFloodPeriod',
    order: 5
  },
  {
    name: '涉及网省协同',
    dict: '18001023',
    key: 'involveSynergy',
    order: 5,
    dictMap: [
      {
        value: 1,
        label: '不涉及'
      },
      {
        value: 2,
        label: '省-网协同（省级作业影响网级系统）、不涉及网级操作'
      },
      {
        value: 3,
        label: '省-网协同（省级作业影响网级系统）、涉及网级操作'
      },
      {
        value: 4,
        label: '网-省协同（网级作业影响省级系统）、涉及省级操作'
      },
    ]
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '补单',
    dict: 'isReplenishment',
    key: 'isReplenishment',
    order: 5
  },
  {
    name: '作业目的',
    dict: '18001021',
    key: 'workGoal',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '涉及基础设施系统',
    dict: 'involveBasicsApp',
    key: 'involveBasicsApp',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否合规',
    dict: 'isCompliance',
    key: 'isCompliance',
    order: 5
  },
  {
    name: '作业结果',
    dict: '18001024',
    key: 'implementResult',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '作业是否涉及拓扑图变更',
    dict: 'isWorkGplot',
    key: 'isWorkGplot',
    order: 5
  },
  {
    name: '工作票入口',
    dict: '18002007',
    key: 'changeSrc',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '涉及调整',
    dict: 'involveAdjust',
    key: 'involveAdjust',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '涉及安全措施变更',
    dict: 'safetyChange',
    key: 'safetyChange',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '涉及定值变更',
    dict: 'involveDefineChange',
    key: 'involveDefineChange',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '涉及保底系统',
    dict: 'involveSystem',
    key: 'involveSystem',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '涉及调整台账信息',
    dict: 'involveAdjustMessage',
    key: 'involveAdjustMessage',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '自动化作业',
    dict: 'autoWork',
    key: 'autoWork',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否停机',
    dict: 'isHalt',
    key: 'isHalt',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否停服',
    dict: 'isServe',
    key: 'isServe',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '是否非停机停服导致的服务降级',
    dict: 'noHaltServe',
    key: 'noHaltServe',
    order: 5
  },
  {
    dictMap: [
      {
        value: 0,
        label: '否'
      },
      {
        value: 1,
        label: '是'
      }
    ],
    name: '需业务测试验证',
    dict: 'testVerify',
    key: 'testVerify',
    order: 5
  }
]

export default dictMap
