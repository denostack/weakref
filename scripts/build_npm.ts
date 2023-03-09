import { build, emptyDir } from "dnt/mod.ts";
import { bgGreen } from "fmt/colors.ts";

const cmd = Deno.run({
  cmd: ["git", "describe", "--tags", "--abbrev=0"],
  stdout: "piped",
});
const version = new TextDecoder().decode(await cmd.output()).trim();
cmd.close();

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
      "Extend built-in collections with weak references for efficient garbage collection and optimal performance in memory-intensive applications with IterableWeakSet, IterableWeakMap, and InvertedWeakMap.",
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
