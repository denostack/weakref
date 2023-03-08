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
  package: {
    name: "weakref",
    version,
    description:
      "weakref is a library for weak references. It provides IterableWeakSet, and IterableWeakMap",
    keywords: [
      "weakref",
      "weakset",
      "weakmap",
      "weak",
      "iterable",
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
