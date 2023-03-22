function wrapFun(obj, fnName) {
  const tempFn = obj[fnName];

  obj[fnName] = function (...args) {
    const event = new CustomEvent(fnName, {
      detail: {
        ...args,
      },
    });
    tempFn.apply(this, args);
    window.dispatchEvent(event);
  };
}

wrapFun(history, "pushState");
wrapFun(history, "replaceState");
