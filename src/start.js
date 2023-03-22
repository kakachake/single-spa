import { reroute } from "./navigation/reroute.js";

export let started = false; // 默认没调用start方法

export function start() {
  started = true;
  reroute();
}
