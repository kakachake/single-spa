import { getAppChanges, shouldBeActive } from "../application/app.help.js";
import { toBootstrapPromise } from "../lifecycles/bootstrap.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toMountPromise } from "../lifecycles/mount.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import { started } from "../start.js";
import "./naviation-event";
import { callCaptureListeners } from "./naviation-event";

let lastMountPromise = Promise.resolve();

export async function reroute(event) {
  // 每次路径变化或者新增注册发生变化都重新走一遍逻辑

  // 首先获取到需要挂载的、需要卸载的
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  // 加载完毕后 需要去挂载应用
  const loadAppPromise = loadApps();
  if (started) {
    // 用户调用了start方法，我们需要处理当前应用要挂载还是卸载
    return performAppChange();
  }

  return loadAppPromise;

  // 先拿到应用去加载

  function loadApps() {
    // 应用的加载
    return Promise.all(
      appsToLoad.map(toLoadPromise) // 目前我们没用调用start
    ).then(() => callEventListener(event));
  }

  function performAppChange() {
    if (!appsToLoad.length && !appsToMount.length) return;
    // 将不需要的应用卸载掉, 返回一个卸载的promise
    // 1) 稍后测试销毁逻辑
    console.log("lastMountPromise", lastMountPromise);
    const unmountAllPromises = lastMountPromise.then(() => {
      Promise.all(appsToUnmount.map(toUnmountPromise));
    });

    // 加载需要的应用 => 启动对应的应用  => 卸载之前的 => 挂载对应的应用

    // 2) 加载需要的应用（可能这个应用在注册的时候已经被加载了）

    // 加载一下应用
    const loadAndMountPromise = Promise.all(
      [...appsToLoad, ...appsToMount].map((app) => {
        // 当应用加载完毕后，需要启动和挂载，但是要保证挂在前，先卸载掉原来的应用
        return loadAppPromise.then(() =>
          tryBootstarpAndMount(app, unmountAllPromises)
        );
      })
    );
    lastMountPromise = loadAndMountPromise;
    console.log("loadAndMountPromise", loadAndMountPromise);
    return loadAndMountPromise.then(() => callEventListener(event));
  }
  function tryBootstarpAndMount(app, unmountAllPromises) {
    if (shouldBeActive(app)) {
      // 保证卸载完毕再加载
      return toBootstrapPromise(app).then(() =>
        unmountAllPromises.then(() => toMountPromise(app))
      );
    }
  }

  function callEventListener(event) {
    callCaptureListeners(event);
  }
}
