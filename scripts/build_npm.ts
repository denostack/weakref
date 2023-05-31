import { build, emptyDir } from "dnt/mod.ts";
import { bgGreen } from "fmt/colors.ts";

const denoInfo = JSON.parse(
  Deno.readTextFileSync(new URL("../deno.json", import.meta.url)),
);
const version = denoInfo.version;

console.log(bgGreen(`version: ${version}`));

await emptyDir("./.npm");

await build({
  entryPoints: [
    "./mod.ts",
  ],
  outDir: "./.npm",
  test: false,
  compilerOptions: {
    lib: ["es2022"],
  },
  shims: {
    deno: false,
  },
  package: {
    name: "weakref",
    version,
    description:
      "Extend built-in collections with weak references for efficient garbage collection and optimal performance in memory-intensive applications with IterableWeakSet, IterableWeakMap, and WeakValueMap.",
    keywords: [
      "weakref",
      "weakset",
      "weakmap",
      "weak",
      "iterable",
      "weak references",
    ],
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/denostack/weakref.git",
    },
    bugs: {
      url: "https://github.com/denostack/weakref/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("README.md", ".npm/README.md");
