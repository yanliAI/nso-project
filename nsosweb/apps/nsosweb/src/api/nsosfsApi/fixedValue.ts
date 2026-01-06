import { baseRequestClient, requestClient } from '#/api/request';

/**
 * 定值管理-操作系统分页查询
 */
export async function queryFixedValueOSListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedAutoSupervision/os/pageList',
    data,
  );
}

/**
 * 定值管理-操作系统修改
 */
export async function saveFixedValueOSDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedAutoSupervision/os/edit',
    data,
  );
}

/**
 * 定值管理-根据ID查询操作系统
 */
export async function getOSDataApi(id) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/fixedAutoSupervision/osDetail/${id}`,
  );
}

/**
 * 定值管理-中间件分页查询
 */
export async function queryFixedValueMiddlewareListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedAutoSupervision/middleware/pageList',
    data,
  );
}

/**
 * 定值管理-中间件修改
 */
export async function saveFixedValueMiddlewareDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedAutoSupervision/middleware/edit',
    data,
  );
}

/**
 * 定值管理-根据ID查询中间件
 */
export async function getMiddlewareDataApi(id) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS +
      `/fixedAutoSupervision/middlewareDetail/${id}`,
  );
}


/**
 * 定值管理-数据库分页查询
 */
export async function queryFixedValueDBListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedAutoSupervision/db/pageList',
    data,
  );
}

/**
 * 定值管理-数据库修改
 */
export async function saveFixedValueDBDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedAutoSupervision/db/edit',
    data,
  );
}

/**
 * 定值管理-根据ID查询数据库
 */
export async function getDBDataApi(id) {
  return requestClient.get(
    import.meta.env.VITE_NSOSFS + `/fixedAutoSupervision/dbDetail/${id}`,
  );
}


/**
 * 规则管理-规则库分页查询
 */
export async function queryFixedValueRuleListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedManage/rule/pageList',
    data,
  );
}

/**
 * 规则管理-新增或修改规则库
 */
export async function saveFixedValueRuleDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedManage/rule/saveOrUpdate',
    data,
  );
}

/**
 * 规则管理-删除规则
 */
export async function deleteFixedValueRuleDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedManage/rule/delete',
    data,
  );
}



/**
 * 规则管理-白名单分页查询
 */
export async function queryFixedValueWhiteListApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedManage/whiteList/pageList',
    data,
  );
}

/**
 * 规则管理-新增或修改白名单
 */
export async function saveFixedValueWhiteListDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedManage/whiteList/saveOrUpdate',
    data,
  );
}

/**
 * 规则管理-删除白名单
 */
export async function deleteFixedValueWhiteListDataApi(data) {
  return requestClient.post(
    import.meta.env.VITE_NSOSFS + '/fixedManage/whiteList/delete',
    data,
  );
}


