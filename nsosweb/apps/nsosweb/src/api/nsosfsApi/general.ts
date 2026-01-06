import { baseRequestClient, requestClient } from '#/api/request';

/**
 * 图纸信息列表
 */
export async function queryDrawingInfoListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingInfo/pageList',
    data,
  );
}

/**
 * 上传图纸文件
 */
export async function uploadDrawingFileApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/commonFile/upload',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

/**
 * 上传图纸信息
 */
export async function saveDrawingInfoApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingInfo/save',
    data,
  );
}

/**
 * 查看图纸
 */
export async function downloadDrawingFileApi(filePath) {
  return baseRequestClient.get(
    import.meta.env.VITE_NSOSFS + `/commonFile/download?filePath=${filePath}`,
  );
}

/**
 * 删除图纸
 */
export async function deleteDrawingFileApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/commonFile/delete',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

/**
 * 删除图纸信息
 */
export async function deleteDrawingInfoApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingInfo/delete',
    data,
  );
}

/**
 * 图纸核查规则分页查询
 */
export async function queryDrawingInfoRuleListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingValidRule/pageList',
    data,
  );
}

/**
 * 新增或修改图纸核查规则
 */
export async function saveDrawingInfoRuleListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingValidRule/saveOrUpdate',
    data,
  );
}

/**
 * 新增或修改图纸核查规则
 */
export async function deleteDrawingInfoRuleListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingValidRule/delete',
    data,
  );
}

/**
 * 核查图纸
 */
export async function drawingValidApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingValid',
    data,
  );
}

/**
 * 图纸质量核查-结果查询
 */
export async function querydrawingValidResultApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingValidResult',
    data,
  );
}

/**
 * 发起图纸治理
 */
export async function approveDrawingGovernanceApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingValidResult/approve',
    data,
  );
}

/**
 * 月报智能生成-各类别完成情况统计
 */
export async function getTypeCompleteStaticApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/monthCollectVisual/typeCompleteStatic',
  );
}

/**
 * 月报智能生成-单位完成情况统计
 */
export async function getUnitCompleteStaticApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/monthCollectVisual/unitCompleteStatic',
  );
}

/**
 * 月报智能生成-各类模板统计
 */
export async function getTypeTemplateStaticApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/monthCollectVisual/typeTemplateStatic',
  );
}

/**
 * 获取v1.1跳转地址
 */
export async function getV11PathApi() {
  return requestClient.get(import.meta.env.VITE_SZRZ + '/path/v11Url');
}

/**
 * 获取智能通讯baseUrl
 */
export async function getIntelDialUrlApi() {
  return requestClient.get(import.meta.env.VITE_SZRZ + '/path/intelDialUrl');
}

/**
 * 获取风控系统跳转地址
 */
export async function getRiskPathApi() {
  return requestClient.get(import.meta.env.VITE_SZRZ + '/path/riskUrl');
}

/**
 * 应急预案分页查询
 */
export async function getEmergencyPlanListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/emergencyPlan/pageList',
    data,
  );
}

/**
 * 查看应急预案详情
 */
export async function getEmergencyPlanDetailApi(planId) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyPlan/detail/${planId}`,
  );
}

/**
 * 新增或修改应急预案
 */
export async function saveEmergencyPlanApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/emergencyPlan/saveOrUpdate',
    data,
  );
}

/**
 * 删除应急预案
 */
export async function deleteEmergencyPlanApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/emergencyPlan/delete',
    data,
  );
}

/**
 * 应急预案-发起审批
 */
export async function startEmergencyPlanProcessApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + `/emergencyPlan/startProcess`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

/**
 * 新增或修改应急卡片
 */
export async function saveEmergencyCardApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/emergencyCard/saveOrUpdate',
    data,
  );
}

/**
 * 应急卡片-发起审批
 */
export async function startEmergencyCardProcessApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/startProcess`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

/**
 * 应急卡片分页查询
 */
export async function getEmergencyCardListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/emergencyCard/pageList',
    data,
  );
}

/**
 * 查看应急卡片详情
 */
export async function getEmergencyCardDetailApi(cardId) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/detail/${cardId}`,
  );
}

/**
 * 部门领导审批-应急卡片
 */
export async function deptLeaderCheckApi(params) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/deptLeaderCheck`,
    {
      params,
    },
  );
}

/**
 * 部门领导审批-应急预案
 */
export async function deptLeaderCheckPlanApi(params) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyPlan/deptLeaderCheck`,
    {
      params,
    },
  );
}

/**
 * 办理一个用户任务
 */
export async function completeTaskApi(taskId, data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + `/task/manage/completeTask/${taskId}`,
    data,
  );
}

/**
 * 流程撤回至上一节点
 */
export async function withdrawProcessApi(taskId) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/dynamic/flow/withdraw/${taskId}`,
  );
}

/**
 * 获取流程任务办理时间轴数据
 */
export async function getTimeLineDataApi(processInstanceId) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + `/flow/monitor/timeLine/${processInstanceId}`,
  );
}

/**
 * 查看应急卡片步骤详情
 */
export async function getEmergencyCardStepDetailApi(stepId) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/stepDetail/${stepId}`,
  );
}

/**
 * 批量删除应急卡片
 */
export async function deleteEmergencyCardApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/delete`,
    data,
  );
}

/**
 * 获取应急预案下拉列表
 */
export async function getEmergencyPlanAllApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyPlan/findAll`,
  );
}

/**
 * 获取负责人列表
 */
export async function getSupervisorListApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/supervisorList`,
  );
}

/**
 * 获取技术部门列表
 */
export async function getTechDeptListApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/techDeptList`,
  );
}

/**
 * 获取部门负责人列表
 */
export async function getDeptLeaderListApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/emergencyCard/deptLeaderList`,
  );
}

/**
 * 获取系统下拉列表
 */
export async function getSystemListApi(sysName) {
  let url =
    import.meta.env.VITE_NSOSFS + `/ydCiDataSystem/search?sysName=${sysName}`;
  // if (sysName) {
  //   url += `?sysName=${sysName}`;
  // }
  return requestClient.get(url);
}

/**
 * 工具管理-流程管理
 */

// 获取模型数据
export async function getModelLists(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/model/manage/modelLists`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

// 新建模型
export async function addModel(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/model/manage/add`,
    data,
  );
}

// 发布模型
export async function publishModelById(modelId) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/model/manage/deploy/${modelId}`,
  );
}

// 删除模型
export async function deleteModelById(id) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/model/manage/remove/${id}`,
  );
}

// 获取模型流程数据
export async function getProcesslists(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/flow/manage/getprocesslists?pageNum=1&pageSize=10`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

// 上传
export async function uploadProcess(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/flow/manage/uploadworkflow`,
    data,
  );
}

// 转换模型
export async function exchangeById(id) {
  return baseRequestClient.get(
    `${import.meta.env.VITE_NSOSFS}/flow/manage/exchangeProcessToModel/${id}`,
  );
}

// 删除流程信息
export async function deleteProcessByDeployId(deployId) {
  const data = {
    ids: deployId,
  };
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/flow/manage/remove/${deployId}`,
    data,
  );
}

// 挂起流程
export async function suspendProcess(params) {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/flow/manage/suspendProcessDefinition`,
    {
      params: params,
    },
  );
}

// 激活
export async function activateProcess(params) {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/flow/manage/activateProcessDefinition`,
    {
      params: params,
    },
  );
}

/**
 * 工具管理-流程监控
 */

// 流程实例
export async function getListProcess(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/flow/monitor/listProcess`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

// 挂起/唤醒流程实例
export async function enableProcess(processInstanceId, enable) {
  const url = enable
    ? `/flow/monitor/run/${processInstanceId}`
    : `/flow/monitor/suspend/${processInstanceId}`;
  return requestClient.get(`${import.meta.env.VITE_NSOSFS}${url}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 执行实例
export async function getListExecutions(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/flow/monitor/listExecutions`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

// 运行历史
export async function getListHistoryProcess(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/flow/monitor/listHistoryProcess`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

// 获取某个历史或者变量
export async function getListByTypeAndId(type, processInstanceId, data) {
  const url =
    type === 'history'
      ? `${import.meta.env.VITE_NSOSFS}/flow/monitor/history/${processInstanceId}`
      : `${import.meta.env.VITE_NSOSFS}/flow/monitor/variables/${processInstanceId}`;
  return requestClient.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// 作业管理
export async function getListJobs(type, data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/flow/monitor/listJobs?type=${type}`,
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}

/**
 * 任务待办
 */

// 获取我的待办
export async function getMyTodoList(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/task/manage/myTodoList`,
    data,
  );
}

// 获取我的已办
export async function getMyCompleteList(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/task/manage/completedList`,
    data,
  );
}

// 获取我的转运
export async function getMyTransferList(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/task/manage/processingList`,
    data,
  );
}

// 获取所有的待办
export async function getAllTodoList(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/task/manage/allTodoList`,
    data,
  );
}

// 操作日志-分页查询
export async function getOperlogPageList(data) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/operlog/page`,
    data,
  );
}

// 操作日志-批量删除
export async function deleteOperlogApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/operlog/delete`,
    data,
  );
}

// 登录日志-分页查询
export async function getLogininforPageList(data) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/logininfor/page`,
    data,
  );
}

// 登录日志-批量删除
export async function deleteLogininforApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/logininfor/delete`,
    data,
  );
}

// 在线用户-分页查询
export async function getOnlinePageList(data) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/online/list`,
    data,
  );
}

// 在线用户-强退
export async function forceLogoutApi(token) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/online/forceLogout/${token}`,
  );
}

// 获取缓存列表
export async function getCacheNameListApi() {
  return requestClient.get(
    `${import.meta.env.VITE_SZRZ}/monitor/cache/getNames`,
  );
}

// 获取指定缓存下的所有键
export async function getCacheKeysApi(cacheName) {
  return requestClient.get(
    `${import.meta.env.VITE_SZRZ}/monitor/cache/getKeys/${cacheName}`,
  );
}

// 根据缓存名称和缓存键获取缓存值
export async function getCacheValueApi(cacheName, cacheKey) {
  return requestClient.get(
    `${import.meta.env.VITE_SZRZ}/monitor/cache/getValue/${cacheName}/${cacheKey}`,
  );
}

// 清除Redis中所有缓存
export async function clearCacheAllApi() {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/cache/clearCacheAll`,
  );
}

// 清除指定缓存键的数据
export async function clearCacheKeyApi(cacheKey) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/cache/clearCacheKey/${cacheKey}`,
  );
}

// 清除指定缓存名称的所有缓存数据
export async function clearCacheNameApi(cacheName) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/monitor/cache/clearCacheName/${cacheName}`,
  );
}

// 根据用户名称模糊搜索
export async function getUserListApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_SZRZ}/user/selectUser`,
    data,
  );
}

// 查询流程用户列表
export async function getFlowUserListApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/actIdUser/pageList`,
    data,
  );
}

// 批量创建流程用户
export async function postFlowUserListApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/actIdUser/batchCreate`,
    data,
  );
}

// 删除流程用户
export async function deleteFlowUserApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/actIdUser/deleteUser`,
    data,
  );
}

// 查询流程用户组列表
export async function getFlowUserGroupListApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/actIdGroup/pageList`,
    data,
  );
}

// 查询流程用户组列表
export async function saveOrUpdateFlowUserGroupApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/actIdGroup/saveOrUpdate`,
    data,
  );
}

// 删除流程用户组
export async function deleteFlowUserGroupApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/actIdGroup/deleteGroup`,
    data,
  );
}

// 获取指定缓存下的所有键
export async function getUsersByGroupIdApi(groupId) {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/actIdGroup/getUsersByGroupId/${groupId}`,
  );
}

// 批量保存用户和组关系
export async function saveMembershipApi(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/actIdGroup/batchReplaceMembership`,
    data,
  );
}
