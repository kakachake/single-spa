// app status

import { apps } from "./app.js";

export const NOT_LOADED = "NOT_LOADED"; // 注册后为该状态， 没有被加载

// load的过程
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // load前设置该状态，表示路径匹配了 要去加载这个资源
export const NOT_BOOTSTRAPE = "NOT_BOOTSTRAPE"; // load后为该状态  表示资源加载完毕了，需要启动，此时还没用启动

// 加载失败
export const LOAD_ERROR = "LOAD_ERROR";

// 启动的过程
export const BOOTSTARPING = "BOOTSTARPING"; // bootstrap前为该状态， 表示启动中
export const NOT_MOUNTED = "NOT_MOUNTED"; // bootstrap后为该状态 || unMount后为该状态，表示启动了，但还没有被挂载，或者已经被卸载了

//挂载流程
export const MOUNTING = "MOUNTING"; // mount前为该状态，表示正在挂载
export const MOUNTED = "MOUNTED"; // mount后为该状态， 表示挂载完成

// 卸载流程
export const UNMOUTING = "UNMOUNTING"; // unMount前为该状态，表示将要卸载

// 看一下这个应用是否正在被激活

export function isActive(app) {
  return (app.stauts = MOUNTED); // 此应用正在被激活
}

// 看一下此应用是否被激活
export function shouldBeActive(app) {
  return app.activeWhen(window.location);
}

export function getAppChanges() {
  const appsToLoad = [];
  const appsToMount = [];
  const appsToUnmount = [];
  apps.forEach((app) => {
    const appShouldBeActive = shouldBeActive(app);
    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        // 1. 标记当前路径下那些应用要被加载
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      case NOT_BOOTSTRAPE:
      case BOOTSTARPING:
      case NOT_MOUNTED:
        // 2. 当前路径下哪些应用要被加载
        if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      case MOUNTED:
      case MOUNTING:
        // 3. 当前路径下哪些应用下要被卸载
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
    }
  });

  return {
    appsToLoad,
    appsToMount,
    appsToUnmount,
  };
}
