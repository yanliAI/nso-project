import { requestClient, baseRequestClient } from '#/api/request';
import { ElMessage } from 'element-plus';
/**
 *
 * 全景监测预警分析
 */
// 获取全部的异常类型
export async function getAllDesc() {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorAlarmLog/getAllDesc`,
  );
}

// 数据清洗
export async function cleanData() {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/dataClean`,
  );
}

// 批量删除脏数据
export async function deleteCleanData(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/batchDelete`,
    data,
  );
}

// 获取数据校核清单
export async function getVerfiyData(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/dataValide`,
    data,
  );
}

// 获取全部的设施类型
export async function getAllSqType() {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorAlarmLog/getAllSqType`,
  );
}

// 获取全部运维单位
export async function getAllUnits() {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorAlarmLog/getAllUnit`,
  );
}

export interface AlarmQueryParams {
  alarmDesc: string;
  alarmSqId: string;
  alarmSqName: string;
  date: string;
  manufacturer: string;
  sqType: string;
  sqUnit: string;
  timeType: string;
}

// 按时间纬度查询数据
export async function getStatisticsByTime(data: AlarmQueryParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorAlarmLog/statisticsByTime`,
    data,
  );
}

// 按设施纬度查询
export async function getStatisticsBySqType(data: AlarmQueryParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorAlarmLog/statisticsBySqType`,
    data,
  );
}

// 按运维单位查询数据
export async function getStatisticsByUnit(data: AlarmQueryParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorAlarmLog/statisticsByUnit`,
    data,
  );
}

// 按生产厂家查询数据
export async function getStatisticsByManufacturer(data: AlarmQueryParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorAlarmLog/statisticsByManufacturer`,
    data,
  );
}

/**
 *
 * 基础设施可视化监视管理
 */
export interface FacilityQueryParams {
  facilityType: string;
  manufacturer: string;
  pageNo: number;
  pageSize: number;
  permissionIds: string[];
  sqId: string;
  sqIp: string;
  sqName: string;
  sqStatus: string;
  subUnit: boolean;
  timeRange: string[];
  unit: string;
  unitId: string;
  unitIds: string[];
  upSqId: string;
}

// 设施查询
export async function getmonitorSq(data: FacilityQueryParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/facilitySearch`,
    data,
  );
}

export async function getmonitorOperation(data: FacilityQueryParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/operationSearch`,
    data,
  );
}

export interface FacilitySubmitParams {
  area: string;
  facilityType: string;
  file: File | string;
  manufacturer: string;
  operationTime: string;
  sqId: string;
  sqIp: string;
  sqName: string;
  sqStatus: string;
  unit: string;
  upSqId: string;
  upSqName: string;
  upSqType: string;
}
// 新增设施
export async function insertMonitorSq(data: FacilitySubmitParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/saveOrUpdate`,
    data,
  );
}

// 删除设施
export async function deleteMonitorSq(data: string) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/delete`,
    data,
  );
}

/**
 * 查看图纸
 */
export async function downloadDrawingApi(filePath) {
  return baseRequestClient.get(
    import.meta.env.VITE_NSOSFS + `/commonFile/download?filePath=${filePath}`,
  );
}
export interface AlarmQueryParams {
  alarmId: string;
  alarmSqId: string;
  alarmSqName: string;
  context: string;
  manufacturer: string;
  pageNo: number;
  pageSize: number;
  permissionIds: string[];
  sqIp: string;
  sqType: string;
  sqUnit: string;
  subUnit: boolean;
  timeRange: string[];
  unitId: string;
  unitIds: string[];
  upSqId: string;
}
// 告警设施查询
export async function getmonitorAlarmSq(data: AlarmQueryParams) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monitorSq/alarmSearch`,
    data,
  );
}

/**
 * 基础设施网络拓扑
 */

export async function getTopoModeStatic() {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/monitorNetTopo/modeStatic`,
  );
}

export async function getTopoalarmInfo() {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/monitorNetTopo/alarmInfoList`,
  );
}

export async function getTopoalarmInfoById(id) {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/monitorNetTopo/detail/${id}`,
  );
}

// 图元告警统计
export async function getTopoElementStatic() {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/monitorNetTopo/elementStatic`,
  );
}

/**
 * 退运管理
 */
export interface returnQueryForm {
  applicationPurpose: string;
  deploymentArea: string;
  hostName: string;
  ipAddress: string;
  locationHost: string;
  osName: string;
  pageNo: number;
  pageSize: number;
  permissionIds: any[];
  resourceType: string;
  subUnit: boolean;
  systemName: string;
  unitId: string;
  unitIds: any[];
}

export async function getReturnAnalysis(data: returnQueryForm) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/returnAnalysis/search`,
    data,
  );
}

// 获取退运charts数据

export async function getCharts() {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/returnAnalysis/getCharts`,
  );
}

/**
 * 月报收资记录
 */

// 月报收资记录查询
export async function queryMonthCollect(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monthCollectRecord/search`,
    data,
  );
}

// 月报收资记录提交
export async function insertMonthCollect(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monthCollectRecord/insert`,
    data,
  );
}

/**
 * 月报模板管理
 */

// 月报模板查询
export async function queryMonthCollectTemplate(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monthCollectTemplate/search`,
    data,
  );
}

// 月报模板新增
export async function insertMonthCollectTemplate(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monthCollectTemplate/insert`,
    data,
  );
}

// 月报模板更新
export async function updateMonthCollectTemplate(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monthCollectTemplate/update`,
    data,
  );
}

// 月报模板审核
export async function auditMonthCollectTemplate(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSFS}/monthCollectTemplate/audit`,
    data,
  );
}

// 月报收资类型查询
export async function getCollectionTypes() {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSFS}/monthCollectTemplate/collectionTypes`,
  );
}
