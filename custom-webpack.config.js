const fs = require("fs");
const jsxbin = require("jsxbin");
const webpack = require("webpack");
const WebpackWatchPlugin = require("webpack-watch-files-plugin").default;
const LiveReloadPlugin = require("webpack-livereload-plugin");
const browserify = require("browserify");
const through = require("through");
const path = require("path");
const Crypto = require("crypto");

const appId = "VT" + Crypto.randomBytes(14).toString("hex").slice(0, 14);
const liveReloadPlugin = new LiveReloadPlugin();

module.exports = (config, options) => {
  const distPath = config.output.path + "\\..";
  config.plugins.push({
    apply: (compiler) => {
      compiler.hooks.afterEmit.tapPromise("CEPPlugin", () => {
        mkdirSyncIfNotExists(distPath + "/CSXS/");
        mkdirSyncIfNotExists(distPath + "/host");
        mkdirSyncIfNotExists("dist/jsx");
        fs.copyFileSync(
          "src/CSXS/manifest.xml",
          distPath + "/CSXS/manifest.xml"
        );

        // Write unique appId
        fs.writeFileSync(distPath + "/client/appId", appId);

        // Compile host.ts to extendscript
        return bundleHost().then(() => {
          console.log("Host bundle created");
          createJSXBin(distPath).then(() => {
            console.log("Generated index.jsxbin");
            liveReloadPlugin.server?.notifyClients([
              distPath + "/host/index.jsxbin",
            ]);
          });
        });
      });
    },
  });

  // Used to watch host/main.ts
  config.plugins.push(
    new WebpackWatchPlugin({
      files: ["./src/host/*.ts"],
    })
  );
  // Optional: Live reloading
  config.plugins.push(liveReloadPlugin);
  return config;
};

/**
 * Uses browersify to bundle dependencies
 */
function bundleHost() {
  return new Promise((resolve) => {
    browserify(["./src/host/main.ts", "./src/host/polyfills.ts"])
      .plugin("tsify", { project: "tsconfig.host.json" })
      .transform(hostGlobalNamespaceTransform, { entry: "./src/host/main.ts" })
      .transform("babelify", { presets: ["extendscript"] })
      .bundle()
      .pipe(fs.createWriteStream("./dist/jsx/index-bundle.js"))
      .on("finish", () => resolve());
  });
}

/**
 * Enables access of public static fields and methods of Main class from adobes global namespace
 */
function hostGlobalNamespaceTransform(file, opts) {
  const fieldRegex =
    /(?<=public\s+static\s+)(?:readonly\s+)?([a-zA-Z_$][0-9a-zA-Z_$]*)(?=:|\s+)/g;
  const funcRegex =
    /(?<=public\s+static\s+)(?:async\s+)?([a-zA-Z_$][0-9a-zA-Z_$]*)(?=\(.*\):?)/g;
  let data = "";
  return through(write, end);

  function write(buf) {
    data += buf.toString();
  }

  function end() {
    if (
      path.resolve(file).toLowerCase() ===
      path.resolve(opts.entry).toLowerCase()
    ) {
      const code = fs.readFileSync(opts.entry, "utf8");
      if (code.match(/class\s+Main/g)) {
        data += `$.global.${appId} = {};\n`;
        data += getGlobalNamespaceStr(code.matchAll(funcRegex));
        data += getGlobalNamespaceStr(code.matchAll(fieldRegex));
      }
    }
    this.queue(data);
    this.queue(null);
  }

  function getGlobalNamespaceStr(keys) {
    let exports = "";
    for (const key of keys) {
      if (key && key.length > 1) {
        exports += `$.global.${appId}.${key[1]} = Main.${key[1]};\n`;
      }
    }
    return exports;
  }
}

/**
 * Converts JSX to JSXBin to obscure backend code
 */
function createJSXBin(distPath) {
  return jsxbin("dist/jsx/index-bundle.js", distPath + "/host/index.jsxbin");
}

function mkdirSyncIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
