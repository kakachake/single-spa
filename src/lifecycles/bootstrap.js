import {
  BOOTSTARPING,
  NOT_BOOTSTRAPE,
  NOT_MOUNTED,
} from "../application/app.help.js";

export function toBootstrapPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_BOOTSTRAPE) {
      return app;
    }
    app.status = BOOTSTARPING;

    return Promise.resolve(app.bootstrap(app.customProps)).then(() => {
      app.status = NOT_MOUNTED;
      return app;
    });
  });
}
