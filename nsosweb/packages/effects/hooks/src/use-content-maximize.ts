import { updatePreferences, usePreferences } from '@vben/preferences';
/**
 * 主体区域最大化
 */
export function useContentMaximize() {
  const { contentIsMaximize } = usePreferences();

  function toggleMaximize() {
    const isMaximize = contentIsMaximize.value;

    updatePreferences({
      header: {
        hidden: !isMaximize,
      },
      sidebar: {
        hidden: !isMaximize,
      },
      // 全屏后禁用tabbar
      tabbar: {
        enable: isMaximize,
      },
    });
  }
  return {
    contentIsMaximize,
    toggleMaximize,
  };
}
