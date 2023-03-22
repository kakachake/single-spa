import path from "path";
import url from "url";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export default {
  input: "./src/single-spa.js",
  output: {
    file: path.resolve(__dirname, "dist/index.js"),
    format: "esm",
    sourcemap: true,
  },
};
