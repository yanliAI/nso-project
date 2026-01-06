import { defineOverridesPreferences } from '@vben/preferences'

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效 backend
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    defaultAvatar: '/images/person.jpeg',
    // 是否使用后台路由
    accessMode: 'frontend'
  },
  theme: {
    mode: 'light'
  },
  copyright: {
    // companyName: '广州海颐软件有限公司',
    companyName: '',
    companySiteLink: '',
    date: '2025',
    enable: false
  },
  logo: {
    enable: true,
    source: '/favicon.ico'
  },
  tabbar: {
    enable: false
  },
  widget: {
    languageToggle: false,
    notification: true,
    themeToggle: false
  }
})
