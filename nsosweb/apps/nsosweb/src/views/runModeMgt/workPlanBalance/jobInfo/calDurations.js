/**
 * 计算服务中断时间（完整版）
 * @param {string} timeList 时间字符串，如："停机:2025-07-03 14:00:00～2025-07-03 22:00:00"
 * @returns {Object} 包含三类时间段总时长的对象
 */
function calculateServiceDowntime(timeList) {
  // 初始化结果结构
  const result = {
    isHalt: { duration: '0小时0分', periods: [] },    // 停机
    isServe: { duration: '0小时0分', periods: [] },    // 停服
    noHaltServe: { duration: '0小时0分', periods: [] } // 服务降级
  };

  // 类别映射表（中文 -> 英文键）
  const categoryMap = {
    '停机': 'isHalt',
    '停服': 'isServe',
    '服务降级': 'noHaltServe'
  };

  // 空值检查
  if (!timeList || typeof timeList !== 'string') {
    return result;
  }

  try {
    // 分割不同服务类别（兼容中英文分号）
    const categories = timeList.split(/[;；]/).filter(item => item.trim());
    const foundCategories = new Set();

    categories.forEach(categoryStr => {
      // 分割类别前缀和时间段（兼容中英文冒号）
      const separatorIndex = findFirstSeparator(categoryStr, [':', '：']);
      if (separatorIndex === -1) return;

      const prefix = categoryStr.slice(0, separatorIndex).trim();
      const timeRangesStr = categoryStr.slice(separatorIndex + 1).trim();
      
      // 检查是否为有效类别
      const englishKey = categoryMap[prefix];
      if (!englishKey) return;

      foundCategories.add(englishKey);

      // 分割多个时间段（兼容中英文逗号）
      const timeRanges = timeRangesStr.split(/[,，]/).filter(item => item.trim());
      const uniquePeriods = new Set();

      timeRanges.forEach(timeRange => {
        // 分割起止时间（兼容中英文波浪号）
        const timeSeparatorIndex = findFirstSeparator(timeRange, ['～', '~']);
        if (timeSeparatorIndex === -1) return;

        const startTime = timeRange.slice(0, timeSeparatorIndex).trim();
        const endTime = timeRange.slice(timeSeparatorIndex + 1).trim();

        // 时间段去重
        const periodKey = `${startTime}_${endTime}`;
        if (uniquePeriods.has(periodKey)) return;
        uniquePeriods.add(periodKey);

        // 计算时间差（分钟）
        const diffMinutes = calculateTimeDiff(startTime, endTime);
        if (diffMinutes <= 0) return; // 忽略无效时间段

        // 记录时间段详情
        result[englishKey].periods.push({ 
          startTime, 
          endTime,
          minutes: diffMinutes
        });

        // 累加时长
        result[englishKey].duration = addDurations(
          result[englishKey].duration, 
          minutesToDuration(diffMinutes)
        );
      });
    });

    // 格式化输出（移除零值单位）
    Object.keys(result).forEach(key => {
      result[key].duration = formatDuration(result[key].duration);
    });

    return result;
  } catch (e) {
    console.error('服务中断计算异常:', e);
    return result;
  }
}

// 工具函数：查找第一个匹配的分隔符位置
function findFirstSeparator(str, separators) {
  for (const sep of separators) {
    const index = str.indexOf(sep);
    if (index !== -1) return index;
  }
  return -1;
}

// 工具函数：安全解析时间（解决时区问题）
function parseDateTime(datetimeStr) {
  const [datePart, timePart] = datetimeStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

// 工具函数：计算时间差（分钟）
function calculateTimeDiff(startStr, endStr) {
  try {
    const start = parseDateTime(startStr);
    const end = parseDateTime(endStr);
    return Math.round((end - start) / (1000 * 60)); // 转为分钟
  } catch (e) {
    console.error(`时间计算错误: ${startStr} ~ ${endStr}`, e);
    return 0;
  }
}

// 工具函数：分钟转时长字符串
function minutesToDuration(totalMinutes) {
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  
  // 智能拼接非零部分
  const parts = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0 || days > 0) parts.push(`${hours}小时`);
  parts.push(`${minutes}分`);
  
  return parts.join('');
}

// 工具函数：累加两个时长字符串
function addDurations(dur1, dur2) {
  // 解析时长字符串
  const parse = (str) => {
    const days = (str.match(/(\d+)天/) || [0, 0])[1];
    const hours = (str.match(/(\d+)小时/) || [0, 0])[1];
    const minutes = (str.match(/(\d+)分/) || [0, 0])[1];
    return {
      days: parseInt(days) || 0,
      hours: parseInt(hours) || 0,
      minutes: parseInt(minutes) || 0
    };
  };

  const t1 = parse(dur1);
  const t2 = parse(dur2);

  // 计算总分钟数
  const totalMinutes = (t1.days + t2.days) * 1440 + 
                      (t1.hours + t2.hours) * 60 + 
                      (t1.minutes + t2.minutes);

  return minutesToDuration(totalMinutes);
}

// 工具函数：优化时长显示格式
function formatDuration(durationStr) {
  // 处理全零情况
  if (/^0天0小时0分$/.test(durationStr)) return '0小时0分';
  
  // 移除零值单位（保留0小时）
  return durationStr
    .replace(/^0天/, '')
    .replace(/(^|天)0小时/, '$1')
    .replace(/天$/, '') // 处理"1天"的情况
    .replace(/^0分$/, '0小时0分');
}
export default calculateServiceDowntime
