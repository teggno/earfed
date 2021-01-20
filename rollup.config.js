import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import workbox from "rollup-plugin-workbox-inject";
import { readFileSync } from "fs";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default [
  {
    input: "src/main.ts",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "app",
      file: "public/build/bundle.js",
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess(),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
        },
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: "bundle.css" }),
      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production &&
        livereload({
          watch: "public",
          verbose: false, // Disable console output
          https: {
            key: readFileSync("https/teggno.dev.key"),
            cert: readFileSync("https/teggno.dev.crt"),
          },
        }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/sw.ts",
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),
      // @rollup/plugin-replace is used to replace process.env.NODE_ENV
      // statements in the Workbox libraries to match your current environment.
      // This changes whether logging is enabled ('development') or disabled ('production').
      replace({
        "process.env.NODE_ENV": JSON.stringify(
          production ? "production" : "not_production"
        ),
      }),
      production &&
        workbox({
          globDirectory: "public",
          globPatterns: ["**/*.css", "**/*.js", "**/*.png", "index.html"],
          // ...any other options here...
        }),
      production && terser(),
    ],
    output: {
      sourcemap: !production,
      format: "es",
      name: "serviceworker",
      file: "public/sw.js",
    },
  },
];
