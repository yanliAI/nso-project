const dictMap = [
  {
    name: "项目类型",
    dict: "projectType",
    key: "projectType",
    order: 1,
    dictMap: [
      { value: 1, label: "信息化" },
      { value: 2, label: "技改" },
      { value: 3, label: "基建" },
      { value: 4, label: "科技创新" },
      { value: 5, label: "其他" },
      { value: 6, label: "工单模式" }
    ]
  },
    {
    name: "生产环境部署区域",
    dict: "systemAreaId",
    key: "systemAreaId",
    order: 1,
    dictMap: [
      { value: 7, label: "网级IDC" },
      { value: 8, label: "网级DMZ" },
      { value: 9, label: "网级安全III区" },
      { value: 1, label: "省级安全III区" },
      { value: 2, label: "省级IDC" },
      { value: 3, label: "省级DMZ" },
      { value: 4, label: "地市级安全III区" },
      { value: 5, label: "地市级IDC" },
      { value: 6, label: "地市级DMZ" }
    ]
  },
  {
    name: "审查专业",
    dict: "optionGroup",
    key: "optionGroup",
    order: 1,
    dictMap: [
      { value: 33, label: "机房技术管控专业" },
      { value: 34, label: "机房可靠性-机房规划专业" },
      { value: 36, label: "机房可靠性-机房设计专业" },
      { value: 37, label: "机房监控专业" },
      { value: 38, label: "机房图实一致专业" },
      { value: 39, label: "机房供配电专业" },
      { value: 40, label: "机房空气调节系统专业" },
      { value: 41, label: "机房性能专业" },
      { value: 42, label: "机房消防专业" },
      { value: 43, label: "机房动环与安防专业" },
      { value: 46, label: "机房运维资料专业" },
      { value: 47, label: "应急预案及演练专业" },
      { value: 48, label: "网络基础设施-网络接入" },
      { value: 49, label: "网络基础设施-网络拓扑" },
      { value: 51, label: "网络基础设施-运行方案" },
      { value: 53, label: "网络方式-运行方式" },
      { value: 54, label: "网络基础设施-定值" },
      { value: 55, label: "网络方式-应急演练" },
      { value: 56, label: "网络调度-监控" },
      { value: 57, label: "机房性能-第三方" },
      { value: 58, label: "机房性能-纤芯测试" },
      { value: 59, label: "源代码审核人员" },
      { value: 1, label: "调度" },
      { value: 2, label: "方式" },
      { value: 3, label: "网安" },
      { value: 4, label: "软件" },
      { value: 5, label: "硬件" },
      { value: 6, label: "运服" },
      { value: 8, label: "运维" },
      { value: 9, label: "方式专业审核人员-可研" },
      { value: 10, label: "网络专业审核人员-可研" },
      { value: 11, label: "调度专业审核人员-可研" },
      { value: 12, label: "技术专业审核人员-可靠性" },
      { value: 13, label: "技术专业审核人员-软件成分" },
      { value: 14, label: "调度专业审核人员" },
      { value: 15, label: "入网安评审核人员" },
      { value: 16, label: "第三方测试审核人员" },
      { value: 17, label: "安全众测审核人员" },
      { value: 18, label: "等保测评审核人员" },
      { value: 19, label: "安全专业审核人员" },
      { value: 20, label: "安全专业审核人员-安全集成" },
      { value: 21, label: "安全专业审核人员--安全管控工具" },
      { value: 22, label: "技术专业审核人员-客服接入" },
      { value: 23, label: "调度专业审核人员-堡垒机" },
      { value: 24, label: "安全管控工具审查人员-防篡改" },
      { value: 25, label: "自查" },
      { value: 26, label: "网络专业审核人员-详设" },
      { value: 27, label: "技术专业审核人员-高可用" },
      { value: 28, label: "评测专业审核人员-高性能" },
      { value: 29, label: "安全专业审核人员-备份" },
      { value: 30, label: "技术专业审核人员-备份" },
      { value: 31, label: "方式专业审核人员" },
      { value: 32, label: "并网准备阶段" },
      { value: 50, label: "网络基础设施-资产台账" }
    ]
  },
  {
    name: "项目类型",
    dict: "isNetAppId",
    key: "isNetAppId",
    order: 1,
    dictMap: [
      { value: 1, label: "是" },
      { value: 2, label: "否" },
    ]
  },
  {
    name: "并网阶段",
    dict: "stageId",
    key: "stageId",
    order: 1,
    dictMap: [
      { value: 1, label: "并网前期(规划立项)阶段" },
      { value: 2, label: "并网前期(设计)阶段" },
      { value: 3, label: "并网准备阶段" },
      { value: 4, label: "并网启动阶段" },
    ]
  },
  {
    name: "计划类型",
    dict: "planType",
    key: "planType",
    order: 2,
    dictMap: [
      { value: 3, label: "临时计划" },
      { value: 1, label: "月度计划" },
      { value: 2, label: "年度计划" }
    ]
  },
    {
    name: "是否完成当前阶段",
    dict: "isCompleteStage",
    key: "isCompleteStage",
    order: 2,
    dictMap: [
      { value: 1, label: "是" },
      { value: 2, label: "否" }
    ]
  },
  {
    name: "并网类型",
    dict: "categoryId",
    key: "categoryId",
    order: 4,
    dictMap: [
      { value: 1, label: "信息系统类" },
      { value: 2, label: "套装软硬件类" },
      { value: 3, label: "网络并联网类" },
      { value: 4, label: "机房并网类" }
    ]
  },
  {
    name: "投运类型",
    dict: "operationType",
    key: "operationType",
    order: 5,
    dictMap: [
      { value: 1, label: "新建" },
      { value: 2, label: "续建" },
      { value: 3, label: "迁移" }
    ]
  },
  {
    name: "部署方式",
    dict: "systemTypeId",
    key: "systemTypeId",
    order: 6,
    dictMap: [
      { value: 1, label: "网级机房部署" },
      { value: 2, label: "省级机房部署" },
      { value: 3, label: "网省两级机房部署" },
      { value: 4, label: "地市级机房部署" },
      { value: 5, label: "省地两级机房部署" }
    ]
  },
  {
    name: "信息系统等级",
    dict: "systemCategory",
    key: "systemCategory",
    order: 7,
    dictMap: [
      { value: 1, label: "一类关键信息系统" },
      { value: 2, label: "二类关键信息系统" },
      { value: 3, label: "三类关键信息系统" },
      { value: 4, label: "一般信息系统" }
    ]
  }
]

export default dictMap
