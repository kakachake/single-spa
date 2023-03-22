import { MOUNTED, NOT_MOUNTED, UNMOUTING } from "../application/app.help.js";

export function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== MOUNTED) {
      return app;
    }
    app.status = UNMOUTING;
    // app.unmount 方法用户可能写的是一个数组
    return Promise.resolve(app.unmount(app.customProps)).then(() => {
      app.status = NOT_MOUNTED;
    });
  });
}
