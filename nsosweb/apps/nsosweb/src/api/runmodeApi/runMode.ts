import { requestClient, baseRequestClient } from '#/api/request';

/**
 *
 * 特殊运行方式大屏
 */

export interface runModeData {
  categoryUnitName: string;
  deploySystemName: string;
}

// 特殊方式运行大屏查询数据
export async function getSpecialRunModeData(data: runModeData) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/specialMode/getMainInfo',
    data,
  );
}

// 特殊方式运行大屏查询数据 改  左侧信息
export async function getRunModeLeftDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/specialMode/getMainBaseInfo',
    data,
  );
}

// 特殊方式运行大屏查询数据 改  右侧信息
export async function getRunModeRightDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/specialMode/getMainSystemList',
    data,
  );
}

// 获取运行方式大屏标题
export async function getPageTitleApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/specialMode/getName'
  );
}

// 系统探测详情界面  getSpecialModeBySystemName
export async function getDetectData(data: string) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/specialMode/getSpecialModeDeatil',
    data,
  );
}


// 系统运行方式界面
export async function getSpecialRunModeCalendar(data: string) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS +
      '/specialMode/getSpecialModeCalenderBySystemName',
    data,
  );
}

// 获取运行方式变更记录
export async function getSpecialRunModeChangeApi(data: string) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS +
      '/specialMode/changeList',
    data,
  );
}

// 获取运行方式统计折线图 开始和结束时间
export async function getStaticDateRangeApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS +
      '/specialMode/dateRange',
  );
}

// 获取运行方式统计折线图信息
export async function getSpecialRunModeStaticApi(data: string) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS +
      '/specialMode/getByDateRange',
    data,
  );
}

/**
 * 运行方式大屏拨测管理
 */

// 拨测系统分页
export async function getModeProbeSystemListApi(data: string) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS +
      '/modeProbeSystem/pageList',
    data,
  );
}

// 新增/更新系统分页
export async function updateModeProbeSystemApi(data: string) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS +
      '/modeProbeSystem/saveOrUpdate',
    data,
  );
}

// 批量删除
export async function deleteModeProbeSystemApi(data: string) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS +
      '/modeProbeSystem/delete',
    data,
  );
}

