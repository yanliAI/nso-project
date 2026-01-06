import { baseRequestClient, requestClient } from '#/api/request';

/**
 * 并网清单查询
 */
export async function queryGridConnectDataListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/gridConnect/pageList',
    data,
  );
}

/**
 * 获取并网默认规则配置
 */
export async function getGridConnectDefaultConfigApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/gridConnect/defaultConfig',
  );
}

/**
 * 获取并网其他规则配置列表
 */
export async function getGridConnectOtherConfigApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/gridConnect/otherConfig',
  );
}
/**
 * 并网配置保存修改
 */
export async function saveGridConnectConfigApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/gridConnect/config/saveOrUpdate',
    data,
  );
}

/**
 * 并网删除规则
 */
export async function deleteGridConnectConfigApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/gridConnect/config/delete',
    data,
  );
}

/**
 * 并网启用规则
 */
export async function enableGridConnectConfigApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/gridConnect/config/enable',
    data,
  );
}


/**
 * 命名智能去重筛查
 */
export async function getNameSimilarityApi() {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + '/gridConnect/nameSimilarity',
  );
}

/**
 * 获取并网审查详情
 */
export async function getGridConnectDetailApi(id) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/gridConnect/detail/${id}`,
  );
}
