import { requestClient,baseRequestClient } from '#/api/request'

/**
 * 月报发布页
 * @returns
 */

// 获取收资任务列表
export async function getCollectionTasksApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/searchTasks`, data)
}

// 新增或更新收资任务
export async function insertCollectionTaskApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/saveOrUpdateTask`, data)
}

// 发布收资任务
export async function publishCollectionTaskApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/publishTask`, data)
}

// 获取收资任务填报情况
export async function getTaskFillDetailApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/getTaskFillDetail`, data)
}

// 获取收资任务详情
export async function getColTaskDetailApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/getTaskDetail`, data)
}

// 获取任务对应的表格
export async function getTablesByTaskIdApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/getTablesByTaskId`, data)
}

// 获取表格对应的字段
export async function getTableFieldsApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/getTableFieldsByTableId`, data)
}

// 获取本人填报的表格数据
export async function getSelfFillListApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/getSelfFillListByTableId`, data)
}

// 获取填报任务列表
export async function getFillListApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/searchFillTasks`, data)
}

// 收资信息填报提交
export async function saveFillDatatApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/addFill`, data)
}

// 收资信息填报提交
export async function submitFillInfoApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/addFill`, data)
}

// 删除收资任务
export async function deleteColTasksApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/delTask`, data)
}

// 查看收资填报情况
export async function getColFillProgressApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/getTaskFillDetail`, data)
}


// 可分发人员查询
export async function getColAssigneeListApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/searchAssignee`, data)
}

// 任务分发
export async function ColTaskAssigneeApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionBase/taskAssign`, data)
}



/**
 * 收资负责人管理
 * @returns 
 */

// 获取所有的组织信息
export async function getAllOrgApi() {
  return requestClient.get(`${import.meta.env.VITE_SZRZ}/org/unitTree`)
}

// 初始化组织树，获取一级组织
export async function initOrgApi() {
  return requestClient.get(`${import.meta.env.VITE_SZRZ}/org/initOrgTree`)
}

// 获取组织树孩子信息
export async function getOrgChildrenApi(data) {
  return requestClient.get(`${import.meta.env.VITE_SZRZ}/org/children`, { params: data })
}

// 获取组织负责人关系表
export async function getOrgRelateApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionRelate/pageList`, data)
}

//  查询数认账号
export async function getUserInfoByNameApi(data) {
  return requestClient.post(`${import.meta.env.VITE_SZRZ}/user/selectUser`, data)
}

//  将数认账号添加到本地数据库中/更新负责人
export async function SaveAccountToLocalApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionRelate/saveOrUpdate`, data)
}


// 删除负责人 
export async function DeleteAccountofLocalApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collectionRelate/delete`, data)
}






// 获取运行方式收资信息
export async function getAllCollectionInfo(type) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/searchTask`, type)
}

// 运行方式收资查看详情
export async function getCollectionTmplDetail(id) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/searchTaskDetails`, id)
}

// 运行方式删除
export async function delCollectionList(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/delCollectionTask`, data)
}

// 运行方式收资编辑保存
export async function saveCollectionTmplDetail(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/saveTask`, data)
}

// 获取模板字段
export async function getCollectionTmplField(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/searchTableFields`, data)
}

// 运行方式收资发布
export async function publishSearchTask(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/publishSearchTask`, data)
}

// 运行方式历史收资
export async function getHistoryTask() {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/importHistorySearch`)
}

// 运行方式填报列表查询
export async function getCollectTask(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/getCollectTask`, data)
}

// 运行方式填报列表字段查询
export async function getCollectTableFields(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/getCollectTableFields`, data)
}

export async function setCollectTable(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/setCollectTable`, data)
}

// 查看部门填报情况
export async function getFillInfo(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/getCollectionCondition`, data)
}

// 按表格查看部门填报情况
export async function getDetailsByTableCol(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/taskProgressSpecificDetails`, data)
}

// 查看可分发人员列表
export async function getDistributablePersons(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/collectionTaskAssignSearch`, data)
}

// 分发
export async function distributableTaskApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/collectionTaskAssign`, data)
}

// 导出单个收资表格汇总
// export async function exportCollectionTableApi(data) {
//   return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/exportOneExcel`, data)
// }

/**
 * 单位-负责人管理
 */

// 获取单位-负责人列表
export async function getDeptHeadListApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/searchOrg`, data)
}

// 按单位查询人员列表
export async function getPersonsByDeptApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/searchOrgPersonal`, data)
}

// 更新单位负责人
export async function updateHeadApi(data) {
  return requestClient.post(`${import.meta.env.VITE_NSOSFS}/collection/orgPersonalAppoint`, data)
}


