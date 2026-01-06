import { requestClient,baseRequestClient } from '#/api/request'



/**
 * @description 并网-并网审查项管理
 * @param data
 * @returns 
 */

// 查看并网审查项
export async function getGridCheckPointApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/gcReviewCheckPoint/pageList`, data)
}

// 新增/修改并网审查项
export async function updateGridCheckPointApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/gcReviewCheckPoint/saveOrUpdate`, data)
}

// 删除并网审查项
export async function deleteGridCheckPointApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/gcReviewCheckPoint/delete`, data)
}

// 当前工单审查项列表
export async function getGridCheckResultApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/reviewCheck`, data)
}

// 当前工单审查结论
export async function getGridCheckConclusionApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/getReviewResult`, data)
}

// 审查附件
export async function reviewGridFileApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/checkChapter`, data)
}

// 获取章节名和关键字
export async function getKeywordsAndChaptersApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/getKeywordsAndChapters`, data)
}

// 审查zip内的附件
export async function reviewGridZipFileApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/zipCheckChapter`, data)
}


// 获取zip解压文件列表
export async function getZipFilesApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydCommon/previewZip`, data)
}

// 预览zip内的文件
export async function previewZipFileApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydCommon/previewZipEntry`, data)
}





/**
 * @description 并网-并网清单
 * @param data
 * @returns 
 */

// 查看并网清单
export async function getGridListApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/baseList`, data)
}

// 查看并单工单详情
export async function getGridListDetailApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/orderDetail`, data)
}

// 查看并网计划详情
export async function getGridPlanDetailApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/netPlan/orderDetail`, data)
}

// 查看最后审查单号
export async function getLastCheckApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/netManagement/getLastCheck`, data)
}






/**
 * @description 个人信息设置-常用作业回复设置
 * @param data
 * @returns 
 */
// 常用作业回复查询
export async function getCommonRespnseApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskCommonReply/pageList`, data)
}

// 常用作业使用回复列表
export async function getCommonRespnseListApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskCommonReply/list`, data)
}

// 新增或修改回复
export async function insertCommonRespnseApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskCommonReply/saveOrUpdate`, data)
}

// 获取模块名列表
export async function getRespnseModulesApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskCommonReply/modules`, data)
}

// 删除回复
export async function deleteCommonRespnseApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskCommonReply/delete`, data)
}

/**
 * @description 作业智能审查 处理人组管理
 * @param data
 * @returns 
 */

// 获取处理人组列表
export async function getHandlerGroupApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydUser/group/pageList`, data)
}

// 新增/更新处理人组
export async function updateHandlerGroupApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydUser/group/saveOrUpdate`, data)
}

// 删除处理人组
export async function deleteHandlerGroupApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydUser/group/delete`, data)
}

// 根据处理人组id获取具体处理人
export async function getHandlersByGroupIdApi(groupId) {
  return requestClient.get(`${import.meta.env.VITE_NSOSFS}/ydUser/getUsersByGroupId/${groupId}`)
}

// 保存处理人和处理人组关系
export async function saveHandlerGroupUsersApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydUser/membership/saveOrUpdate`,data)
}

// 替换处理人和处理人组关系
export async function updateHandlerGroupUsersApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydUser//membership/batchReplace`,data)
}

// 删除处理人和处理人组关系
export async function deleteHandlerGroupUsersApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydUser/membership/delete`,data)
}

// 获取所有的用户列表
export async function getHandlerListApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydUser/userList`,data)
}


/**
 * @description 作业智能审查配置页面
 * @param data
 * @returns 
 */

// 审查规则智能查询
export async function getTaskAuditApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskAudit/pageList`, data)
}

// 根据Id查找详细规则
export async function getRulesByIdApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskAudit/getListByRuleId`, data)
}

// 新增或编辑规则
export async function saveOrUpdateRuleApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskAudit/saveOrUpdate`, data)
}

// 批量删除规则
export async function deleteRuleApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskAudit/delete`, data)
}


// 获取规则项字典列表
export async function getRuleDictListApi() {
  return requestClient.get(`${import.meta.env.VITE_NSOSFS}/taskAudit/getDictList`)
}

// 根据字典id 获取比较内容字典
export async function getCompareContentDictApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskAudit/getDictDataByDictId`,data)
}




/**
 * @description 方式待办
 * @param data
 * @returns 
 */

// 获取作业 我的待办列表
export async function getydTodoTasksApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/searchTasks`, data)
}

// 工单撤回
export async function rollbackTasksApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/rollback`, data)
}


/**
 * @description 信息量票工单查询
 * @param data
 * @returns 
 */

// 获取信息两票列表
export async function getworkPlanTasksApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/operationPlan/getOperationChangesList`, data)
}

/**
 * @description 作业关联计划详情页面
 * @param data
 * @returns
 */

// 获取作业详情
export async function getWorkPlanDetailApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/operationPlan/getOperationPlans`, data)
}


/**
 * @description 信息两票详情页面
 * @param data
 * @returns
 */

// 获取作业 作业流程详情
export async function getydTaskProcessApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/searchTaskProcess`, data)
}

// 获取作业台账清单
export async function getydTaskRecodsApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/operationPlan/getItemApp`, data)
}



// 获取工单taskId
export async function getworkPlanTaskApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/getTask`, data)
}


// 获取信息两票详情
export async function getworkPlanTaskDetailApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/operationPlan/getOperationChanges`, data)
}


// 获取环节当前流转信息
export async function getworkTaskConfigApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/getTaskConfig`, data)
}


// 提交当前节点
export async function submitWorkTaskConfigApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/completeTask`, data)
}


// // 获取下一个环节当前流转信息
export async function getworkTaskNextConfigApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/getNextUser`, data)
}

// 获取工单的用户信息
export async function getworkTaskUserListApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/userList`, data)
}


// 智能审查
export async function checkWorkTaskConfigApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/taskCheck`, data)
}

// 智能审查改-调用规则配置页面规则
export async function checkTaskConfigApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/taskAudit/check`, data)
}


// 工单签收
export async function signForOrderApi(data) {
  return baseRequestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/claimTask`, data)
}

// 转发给他人
export async function transferTaskApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/ydTask/trasnferTask`, data)
}
