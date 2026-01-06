import { requestClient } from '#/api/request';

/**
 *
 * 排行榜接口
 */
// export async function getTest() {
//   return requestClient.get(import.meta.env.VITE_RUNMODEL + '/api/ss');
// }

export interface RecordDTO {
  scoreItemId: number; // 对应原数据中的 id
  score: number; // 扣分/加分的具体数值
  remark: string; // 备注（原 itemName 或自定义描述）
}

export interface RankingData {
  name: string; // 名称（如个人或团队）
  company: string; // 所属公司
  type: number; // 类型标识（如 1=黑榜，2=红榜）
  recordDTOList: RecordDTO[]; // 扣分/加分记录列表
}

// 排行榜数据插入接口
export async function insertRankingData(data: RankingData) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/pioneerRank/insert`,
    data,
  );
}

export interface searchRankingData {
  pageNo: number;
  pageSize: number;
  name: string;
  company: string;
  type: number;
}

// 排行榜数据查询接口
export async function searchRankingData(data: searchRankingData) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/pioneerRank/search`,
    data,
  );
}

// 排行榜数据删除接口
export async function deleteRankingData(data: { id: number }) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/pioneerRank/delete`,
    data,
  );
}

export interface updateRankingData {
  id: number;
  name: string;
  company: string;
  type: number;
  recordDTOList: RecordDTO[];
}

// 排行榜数据更新接口
export async function updateRankingData(data: updateRankingData) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/pioneerRank/update`,
    data,
  );
}

export interface searchScoreItem {
  pageNo: number;
  pageSize: number;
  name: string;
  company: string;
  type: number;
}

// 查询评分细则数据接口
export async function searchScoreItem(data: searchRankingData) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/scoreItem/search`,
    data,
  );
}

export interface searchPersonScoreItem {
  pageNo: number;
  pageSize: number;
  rankId: number;
}

// 查询个人评分详情接口
export async function searchPersonScoreItem(data: searchRankingData) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/scoreRecord/search`,
    data,
  );
}

export interface AssessmentItem {
  type: string;
  examine: string;
  itemName: string;
  description: string;
  calType: string;
  attackDefense: string;
}

// 插入评分细则
export async function insertScoreItem(data: AssessmentItem) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/scoreItem/insert`,
    data,
  );
}

export interface updateAssessmentItem {
  id: number;
  type: string;
  examine: string;
  itemName: string;
  description: string;
  calType: string;
  attackDefense: string;
}

// 更新评分细则
export async function updateScoreItem(data: updateAssessmentItem) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/scoreItem/update`,
    data,
  );
}

// 删除评分细则
export async function deleteScoreItem(data: { id: number }) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/scoreItem/delete`,
    data,
  );
}

/**
 * 大瓦特智能体
 */

// 查询历史对话
export async function queryHistory() {
  return requestClient.get(
    `${import.meta.env.VITE_NSOSSECURITY}/dwt/queryHistory`,
  );
}

/**
 * 缺陷管理
 */

// 新增应用域
export async function insertAppDomain(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/appDomainInfo/insert`,
    data,
  );
}

// 查询应用域
export async function searchAppDomain(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/appDomainInfo/search`,
    data,
  );
}

// 查询应用域系统关系
export async function searchAppDomainSystemInfo(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/appDomainSystemInfo/search`,
    data,
  );
}
// 更新应用域
export async function updateAppDomain(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/appDomainInfo/update`,
    data,
  );
}

// 删除应用域
export async function deleteAppDomain(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/appDomainInfo/delete`,
    data,
  );
}

// 获取所有应用域
export async function getAllAppDomain() {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/appDomainInfo/getAllDomain`,
  );
}

// 获取系统关联
export async function getSysRelateInfo(data) {
  return requestClient.post(
    `${import.meta.env.VITE_NSOSSECURITY}/systemRelateInfo/search`,
    data,
  );
}
