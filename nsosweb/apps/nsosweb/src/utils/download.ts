import axios from 'axios';
import { useAccessStore } from '@vben/stores';
import { ElMessage } from 'element-plus'
export async function downloadFile(
  url: string,
  params: any,
  excelName: string,
  method: string = 'post',
) {
  const accessStore = useAccessStore();
  // 所有方法设置 header Authorization
  axios.defaults.headers.common['Authorization'] = formatToken(
    accessStore.accessToken,
  );
  axios({
    method: method,
    url: url,
    responseType: 'blob',
    data: params,
  }).then((res: any) => {
    if(res.code && res.code !== 200 ){
      ElMessage.error('下载异常!')
      return
    }
    // 从响应头Content-Disposition获取文件名
    const contentDisposition = res.headers.get('Content-Disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );
      if (filenameMatch && filenameMatch[1]) {
        try {
          excelName = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
        } catch {}
      }
    }

    var blob = new Blob([res.data], {
      type: 'application/x-msdownload;charset=UTF-8',
    });
    // 创建一个blob的对象链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // 设置下载文件名
    link.setAttribute('download', excelName);
    document.body.appendChild(link);

    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  });
}

function formatToken(token: null | string) {
  return token ? `Bearer ${token}` : null;
}
