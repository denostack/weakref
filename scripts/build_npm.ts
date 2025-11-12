import { build, emptyDir } from "@deno/dnt";
import { bgGreen } from "@std/fmt/colors";
import denoJson from "../deno.json" with { type: "json" };

const version = denoJson.version;

console.log(bgGreen(`version: ${version}`));

await emptyDir("./.npm");

await build({
  entryPoints: [
    "./mod.ts",
  ],
  outDir: "./.npm",
  test: false,
  compilerOptions: {
    lib: ["ES2021"],
  },
  shims: {
    deno: false,
  },
  package: {
    name: "weakref",
    version,
    description:
      "IterableWeakSet, IterableWeakMap, and WeakValueMap provide iterable weak collections whose entries disappear automatically when their objects are garbage collected—perfect for caches and registries in any JavaScript runtime.",
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
  postBuild() {
    Deno.copyFileSync("LICENSE", ".npm/LICENSE");
    Deno.copyFileSync("README.md", ".npm/README.md");
  },
});
