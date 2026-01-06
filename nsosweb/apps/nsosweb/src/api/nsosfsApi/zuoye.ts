import { baseRequestClient, requestClient } from '#/api/request';

/**
 * 作业人员能力评估列表分页
 */
export async function getAbilityPageListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/portraitBasic/abilityPageList',
    data,
  );
}

/**
 * 根据人员ID查询人员信息详情
 */
export async function getPortraitBasicDetailApi(id) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/portraitBasic/detail/${id}`,
  );
}

/**
 * 获取参数配置
 */
export async function getAssessParameterConfigApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/assessParameterConfig/`,
  );
}

/**
 * 获取人员列表
 */
export async function getPersonnelListApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/assessParameterConfig/personnelList`,
  );
}
/**
 * 工作量评估
 */
export async function getAssessApi(id, data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS +
      `/assessParameterConfig/validateWorkload?id=${id}`,
    data,
  );
}

/**
 * 参数配置保存
 */
export async function saveAssessParameterApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/assessParameterConfig/save',
    data,
  );
}

/**
 * 作业人员画像列表分页
 */
export async function getPortraitPageListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/portraitBasic/portraitPageList',
    data,
  );
}

/**
 * 作业智能审查分页
 */
export async function getTaskCheckPageListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskCheck/pageList',
    data,
  );
}

/**
 * 获取智能审查规则
 */
export async function getTaskCheckRulesApi() {
  return requestClient.get(import.meta.env.VITE_NSOSFS + '/taskCheck/getRules');
}

/**
 * 获取智能审查字段可选项
 */
export async function getTaskCheckFieldsApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/taskCheck/getFieldMetadata',
  );
}

/**
 * 获取智能审查运算关系可选项
 */
export async function getTaskCheckOperatorApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/taskCheck/operators',
  );
}

/**
 * 校验智能审查规则
 */
export async function taskCheckValidateApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskCheck/validate',
    data,
  );
}

/**
 * 保存智能审查规则
 */
export async function saveTaskCheckRulesApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskCheck/saveRules',
    data,
  );
}

/**
 * 作业智能审查执行
 */
export async function taskCheckExecuteApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskCheck/taskCheckExecute',
    data,
  );
}

/**
 * 获取作业详情
 */
export async function getTaskDetailApi(id) {
  return requestClient.get(import.meta.env.VITE_NSOSFS + `/task/detail/${id}`);
}

/**
 * 作业智能分配分页
 */
export async function getTaskDistributeListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskDistribute/pageList',
    data,
  );
}

/**
 * 保存或更新作业信息
 */
export async function saveOrUpdateTaskApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/task/saveOrUpdate',
    data,
  );
}

/**
 * 作业计划平衡分页
 */
export async function getTaskSchedulePageListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskSchedule/pageList',
    data,
  );
}

/**
 * 作业平衡分析
 */
export async function taskScheduleAnalysisApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskSchedule/analysis',
    data,
  );
}

/**
 * 获取作业平衡配置
 */
export async function getScheduleConfigsApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/taskSchedule/configs`,
  );
}

/**
 * 修改作业平衡配置
 */
export async function updateScheduleConfigsApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskSchedule/updateConfigs',
    data,
  );
}

/**
 * 作业均衡管理分页
 */
export async function taskBalancepageListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskBalance/pageList',
    data,
  );
}

/**
 * 作业均衡管理批量调整时间
 */
export async function saveBatchAdjustApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskBalance/batchAdjust',
    data,
  );
}

/**
 * 作业均衡管理-发布
 */
export async function publishTaskBalanceApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/task/publish',
    data,
  );
}

/**
 * 作业发送到云盾
 */
export async function sendTaskToYunDunApi(data) {
  return requestClient.post(import.meta.env.VITE_NSOSFS + '/task/sendYd', data);
}

/**
 * 作业风险评估分页
 */
export async function getRiskAssessmentPageListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskRiskAssessment/pageList',
    data,
  );
}

/**
 * 作业评估专家库分页
 */
export async function getExportAssessPageListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskExportAssessInfo/pageList',
    data,
  );
}

/**
 * 新增或修改作业评估专家库
 */
export async function saveOrUpdateExportAssessApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskExportAssessInfo/saveOrUpdate',
    data,
  );
}

/**
 * 删除作业评估专家库
 */
export async function deleteExportAssessApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskExportAssessInfo/delete',
    data,
  );
}

/**
 * 获取智能分配规则
 */
export async function getTaskDistributeRuleApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/taskDistribute/getRules',
  );
}

/**
 * 保存智能分配规则
 */
export async function saveTaskDistributeRuleApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/taskDistribute/saveRules',
    data,
  );
}

/**
 * 获取作业类型下拉列表
 */
export async function getTaskWorkObjectTypesApi() {
  return baseRequestClient.get(
    import.meta.env.VITE_NSOSFS + '/task/workObjectTypes',
  );
}
/**
 * 获取工作负责人下拉列表
 */
export async function getPortraitBasicWorkLeaderApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/portraitBasic/workLeader',
  );
}
/**
 * 获取专责监护人下拉列表
 */
export async function getPortraitBasicResponsibleGuardianApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/portraitBasic/responsibleGuardian',
  );
}
/**
 * 获取所有人员下拉列表
 */
export async function getPortraitBasicAllPersonnelApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/portraitBasic/allPersonnel',
  );
}
