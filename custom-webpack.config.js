const fs = require("fs");
const jsxbin = require("jsxbin");
const webpack = require("webpack");
const mergeFiles = require("merge-files");
const ts = require("typescript");
const path = require("path");
const WebpackWatchPlugin = require("webpack-watch-files-plugin").default;
const LiveReloadPlugin = require("webpack-livereload-plugin");

/*
 * Polyfills to be loaded in the extendscript engine
 */
const hostPolyfills = [
  "node_modules/extendscript-es5-shim/index.js",
  "node_modules/extendscript-es6-shim/index.js",
];

module.exports = (config, options) => {
  const distPath = config.output.path + "\\..";
  config.plugins.push({
    apply: (compiler) => {
      compiler.hooks.afterEmit.tap("MyAfterEmitPlugin", async () => {
        mkdirSyncIfNotExists(distPath + "/CSXS/");
        mkdirSyncIfNotExists(distPath + "/host");
        mkdirSyncIfNotExists("dist/jsx");

        // Compile host.ts to extendscript
        compileHost();

        mergeFiles(hostPolyfills, distPath + "/host/polyfills.jsx");
        fs.copyFileSync(
          "src/CSXS/manifest.xml",
          distPath + "/CSXS/manifest.xml"
        );

        createJSXBin(distPath);
      });
    },
  });

  // Used to watch host/index.ts
  config.plugins.push(
    new WebpackWatchPlugin({
      files: ["./src/host/*.ts"],
    })
  );
  // Optional: Live reloading
  config.plugins.push(new LiveReloadPlugin());
  return config;
};

/**
 * Compiles the host/index.ts to an ES3 js file
 */
function compileHost() {
  const configFileName = "tsconfig.host.json";
  const configFileText = fs.readFileSync(configFileName).toString();
  const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
  const config = ts.parseJsonConfigFileContent(
    result.config,
    ts.sys,
    path.dirname(configFileName)
  );
  const program = ts.createProgram(config.fileNames, config.options);
  program.emit();
}

/**
 * Converts JSX to JSXBin to obscure backend code
 */
function createJSXBin(distPath) {
  jsxbin("dist/jsx/index.js", distPath + "/host/index.jsxbin")
    .then(() => {
      console.log("Generated index.jsxbin");
    })
    .catch((err) => {
      console.error(err);
    });
}

function mkdirSyncIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
