import {
  LOADING_SOURCE_CODE,
  NOT_BOOTSTRAPE,
  NOT_LOADED,
} from "../application/app.help.js";

function flattenArrayToPromise(fns) {
  if (!Array.isArray(fns)) return fns;
  else {
    return function (props) {
      return fns.reduce((lPromise, fn) => {
        return lPromise.then(() => {
          return fn(props);
        });
      }, Promise.resolve());
    };
  }
}

export function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_LOADED) {
      // 此应用加载完毕
      return app;
    }
    app.status = LOADING_SOURCE_CODE; // 正在加载应用
    return Promise.resolve(app.loadApp(app.customProps)).then((v) => {
      const { bootstrap, mount, unmount } = v;
      app.status = NOT_BOOTSTRAPE;
      app.bootstrap = flattenArrayToPromise(bootstrap);
      app.mount = flattenArrayToPromise(mount);
      app.unmount = flattenArrayToPromise(unmount);

      return app;
    });
  });
}
