import { createRequire } from "module";

const require = createRequire(import.meta.url);

function readPackageVersion(): string {
  try {
    return require("../../package.json").version;
  } catch {
    // Bundled dist/index.js lives one level below package.json.
    return require("../package.json").version;
  }
}

export const VERSION: string = readPackageVersion();
