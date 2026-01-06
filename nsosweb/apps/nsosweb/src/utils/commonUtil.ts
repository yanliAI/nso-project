import { useDropStore } from '#/store'

export function formatDate(longtime: any) {
  if (!longtime) return ''
  const date = new Date(longtime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
export function formatDateZw(longtime: any) {
  if (!longtime) return ''
  const date = new Date(longtime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}年${month}月${day}日`
}
export function formatDateTime(longtime: any) {
  if (!longtime) return ''
  const date = new Date(longtime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
/**
 * 表格时间类型格式化
 * @returns yyyy-MM-dd
 */
export function tDateFormat(row: any, column: any, cellValue: any) {
  return formatDate(cellValue)
}

/**
 * 表格时间类型格式化
 * @returns yyyy-MM-dd HH:mm:ss
 */
export function tDateTimeFormat(row: any, column: any, cellValue: any) {
  return formatDateTime(cellValue)
}
export function formatToken(token: any) {
  return token ? `Bearer ${token}` : null
}
export function formatDrop(row: any, column: any, cellValue: any) {
  const dropStore = useDropStore()
  let dropList: any = []
  dropStore.get(dropList, [column.columnKey])
  const option = dropList[column.columnKey].find((opt: any) => opt.value == cellValue)
  return option ? option.label : ''
}

export function getHoursDifference(date1time: any, date2time: any) {
  if (!date1time || !date2time) {
    return '0'
  }
  const date1 = new Date(date1time)
  const date2 = new Date(date2time)
  // 确保传入的是 Date 对象
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error('Arguments must be instances of Date')
  }

  // 计算时间差（以毫秒为单位）
  const diffInMilliseconds = Math.abs(date2 - date1)

  // 将毫秒转换为秒
  const diffInSeconds = diffInMilliseconds / 1000

  // 将秒转换为分钟
  const diffInMinutes = diffInSeconds / 60

  // 将分钟转换为小时
  const diffInHours = diffInMinutes / 60

  // 返回时间差（以小时为单位）
  return diffInHours.toFixed(2)
}

/**
 * 计算两个时间的小时差，结束时间为空时默认为当前时间
 * @param starTime long类型开始时间
 * @param finishTime long类型结束时间
 * @returns
 */
export function getDifferenceInHours(starTime: any, finishTime: any) {
  if (!starTime) {
    return '0'
  }
  if (!finishTime) {
    finishTime = new Date().getTime()
  }
  const begin = new Date(starTime)
  const end = new Date(finishTime)

  // 确保传入的是 Date 对象
  if (!(begin instanceof Date) || !(end instanceof Date)) {
    throw new Error('Arguments must be instances of Date')
  }

  // 计算时间差（以毫秒为单位）
  const diffInMilliseconds = end - begin
  if (diffInMilliseconds < 0) {
    return '0'
  }

  // 将毫秒转换为秒
  const diffInSeconds = diffInMilliseconds / 1000

  // 将秒转换为分钟
  const diffInMinutes = diffInSeconds / 60

  // 将分钟转换为小时
  const diffInHours = diffInMinutes / 60

  // 返回时间差（以小时为单位）
  return diffInHours.toFixed(2)
}

/**
 * 流程跟踪
 * @param {*流程ID} processId
 * @param {*流程实例ID} processInsId
 */
export function lookFlow(processId: any, processInsId: any) {
  let width = 800
  let height = 700
  // 获取屏幕宽度和高度
  var screenWidth = window.screen.width
  var screenHeight = window.screen.height

  // 计算新窗口的左边缘和上边缘位置，以使其居中
  var left = (screenWidth - width) / 2
  var top = (screenHeight - height) / 2
  var url = 'http://' + import.meta.env.VITE_JADPWEB + '/bpmp/engine/bpms/flex/BpmsTrackC5.html?processId=' + processId + '&processInsId=' + processInsId + '&webRoot=/bpmp/engine'
  // 使用 window.open 打开新窗口，并设置其位置和大小
  window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`)
}
export function numberToChinese(num: any) {
  if (typeof num !== 'number' || num < 0) {
    return '请输入有效的非负整数'
  }

  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千']
  const bigUnits = ['', '万', '亿', '兆']
  let result = ''

  function convert(number: any) {
    let str = number.toString()
    let chinese = ''
    let zeroCount = 0

    for (let i = 0; i < str.length; i++) {
      let digit = parseInt(str[i])
      let unit = units[str.length - 1 - i]

      if (digit === 0) {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chinese += chineseNumbers[0]
          zeroCount = 0
        }
        chinese += chineseNumbers[digit] + unit
      }
    }

    return chinese
  }

  let index = 0
  while (num > 0) {
    if (num % 10000 !== 0) {
      result = convert(num % 10000) + bigUnits[index] + result
    }
    num = Math.floor(num / 10000)
    index++
  }

  // 处理末尾的零
  result = result.replace(/零+$/, '')
  // 处理中间的多个零
  result = result.replace(/零+/g, '零')
  // 处理万、亿等后面的零
  result = result.replace(/零([万亿])/g, '$1')

  return result || chineseNumbers[0]
}

/**
 * 复制文本内容到剪切板
 * @param {Object} text
 */
export function copyText(text: any) {
  let textarea = document.createElement('input') //创建input对象
  let currentFocus = document.activeElement //当前获得焦点的元素
  document.body.appendChild(textarea) //添加元素
  textarea.value = text
  textarea.focus()
  if (textarea.setSelectionRange) {
    textarea.setSelectionRange(0, textarea.value.length) //获取光标起始位置到结束位置
  } else {
    textarea.select()
  }
  let flag
  try {
    flag = document.execCommand('copy') //执行复制
  } catch (eo) {
    flag = false
  }
  document.body.removeChild(textarea) //删除元素
  if (currentFocus) {
    currentFocus.focus()
  }
  return flag
}

// 计算两个日期时间之间的时长
export function calculateDuration(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime())) return '';
  if (isNaN(endDate.getTime())) return '';

  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) {
    return '开始时间不能大于结束时间';
  }
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const intDaysTime = diffDays * 1000 * 60 * 60 * 24;
  const diffHours = Math.floor((diffMs - intDaysTime) / (1000 * 60 * 60));
  const intHoursTime = diffHours * 1000 * 60 * 60;
  const diffMinutes = Math.floor(
    (diffMs - intDaysTime - intHoursTime) / (1000 * 60),
  );
  if (diffDays <= 0) {
    return `${diffHours}小时${diffMinutes}分钟`;
  }
  return `${diffDays}天${diffHours}小时${diffMinutes}分钟`;
};
