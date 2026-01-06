import { baseRequestClient, requestClient } from '#/api/request';

/**
 * 保存或修改图元和系统名称的关联数据
 */
export async function saveElementSystemApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/graphElement/saveOrUpdate',
    data,
  );
}

/**
 * 分页查询图元信息列表
 */
export async function queryGraphElementListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/graphElement/pageList',
    data,
  );
}
/**
 * 查询系统列表
 */
export async function querySystemListApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSSECURITY + '/graphElement/applicationSystems',
  );
}
/**
 * 查询单位列表
 */
export async function queryUnitListApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSSECURITY + '/graphElement/units',
  );
}

/**
 * 修改图元信息
 */
export async function updateGraphElementApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/graphElement/update',
    data,
  );
}

/**
 * 关联告警计数查询
 */
export async function queryCountApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSSECURITY + '/alarms/querycount',
  );
}

/**
 * 关联告警分页查询
 */
export async function queryAlarmsApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/alarms/queryList',
    data,
  );
}

/**
 * 告警统计
 */
export async function queryAlarmsStatisticsApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/alertInfo/statistics',
    data,
    { showmask: false },
  );
}

/**
 * 根据图元ID查询告警列表-聚合前
 */
export async function getAlertListWithIdApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + `/alertInfo/alertList`,
    data,
  );
}

/**
 * 根据图元ID查询告警列表-聚合后
 */
export async function getGroupAlertListWithIdApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + `/alertInfo/groupAlertList`,
    data,
  );
}

/**
 * 根据告警ID查询告警信息详情
 */
export async function getAlertDetailApi(alertId) {
  return requestClient.get(
    import.meta.env.VITE_NSOSSECURITY + `/alertInfo/detail/${alertId}`,
  );
}

/**
 * 修改告警信息状态
 */
export async function changeAlertStatusApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + `/alertInfo/changeStatus`,
    data,
  );
}

/**
 * 分页查询布防图列表
 */
export async function queryDeploymentMapListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/topoViewData/page',
    data,
    { showmask: false },
  );
}

/**
 * 根据图元id、布防图id获取布防图文件
 */
export async function getTopoViewFileApi(data) {
  return baseRequestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/alertInfo/topoViewFile',
    data,
  );
}

/**
 * 获取布防图文件
 */
export async function getTopoFileContentApi(topoId) {
  return baseRequestClient.get(
    import.meta.env.VITE_NSOSSECURITY + `/topoViewData/downloadSvg/${topoId}`,
  );
}

/**
 * 删除布防图文件
 */
export async function deleteTopoViewApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/topoViewData/deleteTopoView',
    data,
  );
}

/**
 * 获取威胁情报分页
 */
export async function getThreatIntelligenceDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/threatIntelligence/pageList',
    data,
  );
}

/**
 * 新增或修改威胁情报
 */
export async function saveThreatIntelligenceDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/threatIntelligence/saveOrUpdate',
    data,
  );
}

/**
 * 删除威胁情报
 */
export async function deleteThreatIntelligenceDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/threatIntelligence/delete',
    data,
  );
}

/**
 * 获取威胁情报详情
 */
export async function getThreatIntelligenceDetailApi(id) {
  return requestClient.get(
    import.meta.env.VITE_NSOSSECURITY + `/threatIntelligence/get/${id}`,
  );
}

/**
 * 获取漏洞信息分页
 */
export async function getVulnerabilityInfoDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/vulnerabilityInfo/pageList',
    data,
  );
}

/**
 * 新增漏洞信息
 */
export async function addVulnerabilityInfoDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/vulnerabilityInfo/saveOrUpdate',
    data,
  );
}

/**
 * 删除漏洞信息
 */
export async function deleteVulnerabilityInfoDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/vulnerabilityInfo/delete',
    data,
  );
}

/**
 * 获取漏洞详情
 */
export async function getVulnerabilityInfoDetailApi(id) {
  return requestClient.get(
    import.meta.env.VITE_NSOSSECURITY + `/vulnerabilityInfo/get/${id}`,
  );
}

/**
 * 获取drawio服务地址
 */
export async function getDrawioServicePathApi() {
  return requestClient.get(import.meta.env.VITE_NSOSSECURITY + `/drawIo/path`);
}

/**
 * 获取漏洞信息统计数据
 */
export async function getVulnerabilityStatisticsDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/vulnerabilityInfo/statistics',
    data,
    { showmask: false },
  );
}

/**
 * 根据图元id查询对应的漏洞列表
 */
export async function getVulnerabilityListWithEleIdApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/vulnerabilityInfo/vulnerabilityList',
    data,
  );
}

/**
 * 批量修改威胁情报状态
 */
export async function changeThreatStatusApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/threatIntelligence/changeStatus',
    data,
  );
}

/**
 * 批量修改漏洞状态
 */
export async function changeVulnerabilityInfoStatusApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/vulnerabilityInfo/changeStatus',
    data,
  );
}

/**
 * 获取布防图告警统计数量
 */
export async function getAlertInfoStatisticsCountApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSSECURITY + '/alertInfo/statisticsCount',
    data,
    { showmask: false },
  );
}

/**
 * 获取布防图id
 */
export async function getTopoViewIdApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSSECURITY + '/topoViewData/topoViewId',
    { showmask: false },
  );
}
