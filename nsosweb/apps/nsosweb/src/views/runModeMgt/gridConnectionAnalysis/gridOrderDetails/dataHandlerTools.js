export function processDataSafe(data) {
  // 输入验证
  if (!Array.isArray(data)) {
    console.error('输入数据必须是数组');
    return [];
  }
  
  if (data.length === 0) {
    return [];
  }
  
  return data.map((item, index) => {
    try {
      // 创建副本，避免修改原数据
      const processedItem = { ...item };
      
      // 1. 处理attachInfo字段
      processedItem.attachInfo = processAttachInfo(processedItem.attachInfoJson);
      
      // 2. 处理optionGroup字段
      processedItem.optionGroup = processOptionGroup(processedItem.optionGroup);
      
      return processedItem;
    } catch (error) {
      console.error(`处理第 ${index + 1} 条数据时出错:`, error);
      // 返回原始数据，不做处理
      return item;
    }
  });
}

// 处理attachInfoJson的辅助函数
function processAttachInfo(attachInfoJson) {
  // 如果为空或未定义，返回空对象
  if (!attachInfoJson || attachInfoJson.trim() === '') {
    return {};
  }
  
  try {
    const parsed = JSON.parse(attachInfoJson);
    
    // 验证解析结果是否为数组
    if (!Array.isArray(parsed)) {
      console.warn('attachInfoJson解析结果不是数组');
      return {};
    }
    
    // 过滤掉无效的附件项
    const validAttachments = parsed.filter(attach => 
      attach && typeof attach === 'object'
    );
    
    if (validAttachments.length === 0) {
      return {};
    }
    
    // 转换为 { "1": [attach1], "2": [attach2], ... } 格式
    const attachInfo = {};
    validAttachments.forEach((attach, index) => {
      const key = `${index + 1}`;
      attachInfo[key] = [attach];
    });
    
    return attachInfo;
  } catch (error) {
    console.error('解析attachInfoJson失败:', error);
    return {};
  }
}

// 处理optionGroup的辅助函数
function processOptionGroup(optionGroup) {
  // 如果为空或未定义，返回空数组
  if (!optionGroup && optionGroup !== 0) {
    return [];
  }
  
  // 如果是数组，直接返回
  if (Array.isArray(optionGroup)) {
    return optionGroup;
  }
  
  // 如果是字符串
  if (typeof optionGroup === 'string') {
    const str = optionGroup.trim();
    if (str === '') {
      return [];
    }
    
    // 按逗号分割
    const parts = str.split(',')
      .map(part => part.trim())
      .filter(part => part !== '');
    
    if (parts.length === 0) {
      return [];
    }
    
    // 转换为数字或保持字符串
    return parts.map(part => {
      const num = Number(part);
      return isNaN(num) ? part : num;
    });
  }
  
  // 如果是数字，包装成数组
  if (typeof optionGroup === 'number') {
    return [optionGroup];
  }
  
  // 其他类型尝试转换
  try {
    const str = String(optionGroup);
    return processOptionGroup(str);
  } catch (error) {
    console.error('处理optionGroup失败:', error);
    return [];
  }
}
