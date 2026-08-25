import { createRequire } from "module";

// NOTE: this file is bundled into a single dist/index.js by esbuild, so the
// relative path here must match "../package.json" as seen from dist/index.js
// (one level up to the project root), not from this file's original
// location at src/utils/version.ts. Do not "fix" this to "../../package.json"
// based on this file's own nesting depth.
const require = createRequire(import.meta.url);
const pkg = require("../package.json");

export const VERSION: string = pkg.version;
