import type { Router, RouteRecordRaw } from 'vue-router';

import type { ExRouteRecordRaw, MenuRecordRaw } from '@vben-core/typings';

import { filterTree, mapTree } from '@vben-core/shared/utils';

/**
 * 根据 routes 生成菜单列表
 * @param routes
 */
async function generateMenus(
  routes: RouteRecordRaw[],
  router: Router,
): Promise<MenuRecordRaw[]> {
  // 将路由列表转换为一个以 name 为键的对象映射
  // 获取所有router最终的path及name
  const finalRoutesMap: { [key: string]: string } = Object.fromEntries(
    router.getRoutes().map(({ name, path }) => [name, path]),
  );

  let menus = mapTree<ExRouteRecordRaw, MenuRecordRaw>(routes, (route) => {
    // 路由表的路径写法有多种，这里从router获取到最终的path并赋值
    const path = finalRoutesMap[route.name as string] ?? route.path;

    // 转换为菜单结构
    // const path = matchRoute?.path ?? route.path;
    const { meta, name: routeName, redirect, children } = route;
    const {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      hideChildrenInMenu = false,
      icon,
      link,
      order,
      title = '',
    } = meta || {};

    const name = (title || routeName || '') as string;

    // 隐藏子菜单
    let resultChildren = hideChildrenInMenu
      ? []
      : (children as MenuRecordRaw[]);

    // 将菜单的所有父级和父级菜单记录到菜单项内
    if (resultChildren && resultChildren.length > 0) {
      try {
        resultChildren = resultChildren.sort(
          (a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999),
        );
      } catch {}
      resultChildren.forEach((child) => {
        child.parents = [...(route.parents || []), path];
        child.parent = path;
      });
    }
    // 隐藏子菜单
    const resultPath = hideChildrenInMenu ? redirect || path : link || path;
    return {
      activeIcon,
      badge,
      badgeType,
      badgeVariants,
      icon,
      name,
      order,
      parent: route.parent,
      parents: route.parents,
      path: resultPath as string,
      show: !route?.meta?.hideInMenu,
      children: resultChildren || [],
    };
  });

  // 对菜单进行排序
  menus = menus.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const finalMenus = filterTree(menus, (menu) => {
    return !!menu.show;
  });
  // toExcel(routes);
  return finalMenus;
}

function toExcel(routes) {
  let csv =
    '序号,父级序号,模块名称,URL,排序号,是否缓存,是否打开新窗口,是否在菜单中隐藏,组件地址,组件名称,icon图标\n';
  let idCounter = 0;
  const levelMap = {};

  function process(routes, parentId = '') {
    routes.forEach((route) => {
      idCounter++;
      const levelKey = parentId || 'root';
      levelMap[levelKey] = route.meta.order || (levelMap[levelKey] || 0) + 1;

      csv +=
        [
          idCounter,
          parentId || '',
          route.meta?.title || '',
          route.path || '',
          levelMap[levelKey],
          route.meta?.keepAlive ? '是' : '否',
          route.meta?.openInNewWindow ? '是' : '否',
          route.meta?.hideInMenu ? '是' : '否',
          typeof route.component === 'function'
            ? route.component
                .toString()
                .replace(/\n/g, ' ')
                .replace('() => import("/src/views/', '')
                .replace('.vue")', '')
            : route.component?.name || '',
          route.name || '',
          route.meta?.icon?.name || route.meta?.icon || '',
        ].join(',') + '\n';

      if (route.children) process(route.children, idCounter);
    });
  }

  process(routes);
  console.log('csv===', csv); // 替换为您的变量名
  return csv;
}

export { generateMenus };
