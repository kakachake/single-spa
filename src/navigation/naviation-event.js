import { reroute } from "./reroute";

function urlRoute(...args) {
  reroute(...args);
}

window.addEventListener("pushState", urlRoute);

window.addEventListener("popstate", urlRoute);

window.addEventListener("replaceState", urlRoute);

// window.addEventListener("hashchange", urlRoute);

// 需要劫持原生的路由系统，保证我们加载完后再切换路由

const captureEventListeners = {
  hashchange: [],
  popstate: [],
};

const listeningTo = ["hashchange", "popstate"];

const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = function (eventName, callback) {
  // 有要监听的事件，函数不能重复
  if (
    listeningTo.includes(eventName) &&
    captureEventListeners[eventName].some((listener) => listener === callback)
  ) {
    return captureEventListeners[eventName].push(callback);
  }
  console.log(captureEventListeners);
  return originalAddEventListener.apply(this, arguments);
};

window.addEventListener = function (eventName, callback) {
  // 有要监听的事件，函数不能重复
  if (listeningTo.includes(eventName)) {
    return captureEventListeners[eventName].filter(
      (listener) => listener !== callback
    );
  }
  return originalRemoveEventListener.apply(this, arguments);
};

export function callCaptureListeners(e) {
  if (e) {
    const eventType = e.type;
    if (listeningTo.includes[eventType]) {
      captureEventListeners[eventType].forEach((listener) => {
        listener.call(this, e);
      });
    }
  }
}
