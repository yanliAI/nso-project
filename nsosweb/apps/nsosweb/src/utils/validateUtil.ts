// IP验证正则
export function validateIP(ip) {
  // 去除前后空格
  ip = ip.trim();
  if (!ip) return false;

  // 简单IPV4验证正则
  const ipRegex =
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\~(25[0-5]|2[0-4]\d|[01]?\d\d?))?$/;

  // 校验IP或IP段
  const result = ipRegex.test(ip);
  if (!result) {
    return false;
  }

  const parts = ip.split('~');
  // 如果没有CIDR部分，视为有效
  if (parts.length === 1) {
    return true;
  }
  const ipParts = parts[0].split('.').map(Number);
  const lastIpPart = ipParts[3];
  const cidr = parseInt(parts[1], 10);

  // 检查CIDR是否大于最后一个IP段
  if (cidr < lastIpPart) {
    // return {
    //   isValid: false,
    //   message: `CIDR值(${cidr})必须大于最后一个IP段的值(${lastIpPart})`,
    // };
    return false;
  }
  return true;
}

// IPv6 校验函数
export function validateIPv6(ip) {
  // 去除前后空格
  ip = ip.trim();
  if (!ip) return false;
  // IPv6 正则表达式（支持完整格式和压缩格式）
  const ipv6Regex =
    /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;

  // IPv6 带 CIDR 的正则表达式
  const ipv6WithCidrRegex =
    /^(((([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4})|(:((:[\da-fA-F]{1,4}){1,6}|:))|([\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:))|(([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:))|(([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:))|(([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:))|(([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?)|(([\da-fA-F]{1,4}:){6}:))~([\da-fA-F]{1,4}))$/;

  // 先检查基本格式
  const basicCheck = ipv6Regex.test(ip) || ipv6WithCidrRegex.test(ip);
  if (!basicCheck) {
    return false;
  }

  // 检查 CIDR 部分
  const parts = ip.split('~');
  if (parts.length === 1) {
    return true; // 没有 CIDR 部分，直接返回有效
  }

  // const cidr = parseInt(parts[1], 10);

  // // IPv6 的 CIDR 范围是 0-128
  // if (cidr < 0 || cidr > 128) {
  //   return false;
  //   // 也可以返回更详细的错误信息
  //   // return {
  //   //   isValid: false,
  //   //   message: `IPv6 CIDR值必须在0-128之间(当前值: ${cidr})`
  //   // };
  // }

  return true;
}
