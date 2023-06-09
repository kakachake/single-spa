import { MOUNTED, MOUNTING, NOT_MOUNTED } from "../application/app.help.js";

export function toMountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_MOUNTED) {
      return app;
    }
    console.log("mountPromise");
    app.status = MOUNTING;
    return Promise.resolve(app.mount(app.customProps)).then(() => {
      app.status = MOUNTED;
      return app;
    });
  });
}
