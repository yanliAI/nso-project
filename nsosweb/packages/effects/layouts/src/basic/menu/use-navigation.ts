import type { RouteRecordNormalized } from 'vue-router';

import { useRouter } from 'vue-router';

import { isHttpUrl, openRouteInNewWindow, nsosOpenRouteInNewWindow,  openWindow } from '@vben/utils';

function useNavigation() {
  const router = useRouter();
  const routes = router.getRoutes();

  const routeMetaMap = new Map<string, RouteRecordNormalized>();

  routes.forEach((route) => {
    routeMetaMap.set(route.path, route);
  });

  const navigation = async (path: string) => {
    const route = routeMetaMap.get(path);
    const { openInNewWindow = false, query = {} } = route?.meta ?? {};
    if (isHttpUrl(path)) {
      openWindow(path, { target: '_blank' });
    } else if (openInNewWindow) {
      let index = path.indexOf('/', 1);
      let target = '_blank'
      if (index > 0) {
        target = 'nsos-' + path.substring(1, index)
      }
      nsosOpenRouteInNewWindow(path, target);
    } else {
      await router.push({
        path,
        query,
      });
    }
  };

  return { navigation };
}

export { useNavigation };
