# Introduction

This is a starter template for developing Adobe CEP extensions using Angular and Spectrum CSS.
Missing ES5 and ES6 features in Adobe's ExtendScript are polyfilled. The host code (JSX) can be written in typescript and is then transpiled to ExtendScript.

_npm run start_ automatically loads the extension in the respective Adobe solutions and "live reloads" the code whenever saving a file while developing. If you are using macOS, adapt the path in the _package.json_ file.

### Technologies used:

- [Extendscript-es5-shim-ts](https://github.com/ExtendScript/extendscript-es5-shim) and [extendscript-es6-shim-ts](https://github.com/ExtendScript/extendscript-es6-shim) for polyfilling ExtendScript
- [CSInterface-TS](https://github.com/BrightShadow/CSInterface-TS) to add the [CSInterface](https://github.com/Adobe-CEP/CEP-Resources) library with typings
- [Spectrum-CSS](https://github.com/adobe/spectrum-css) to adapt the Adobe design standards in the extension
- [Types-for-Adobe](https://github.com/aenhancers/Types-for-Adobe) to get TypeScript types for the respective Adobe products
- [Webpack-livereload-plugin](https://github.com/statianzo/webpack-livereload-plugin) and [webpack-watch-files-plugin](https://github.com/Fridus/webpack-watch-files-plugin) for reloading the plugin panel on code changes
- [Angular](https://github.com/angular/angular)
- [browserify](https://github.com/browserify/browserify) to bundle host code (experimental)
- [babel](https://github.com/babel/babel) to transpile host code to extendscript (experimental)


### Screenshot
![Hello World Panel](https://user-images.githubusercontent.com/18399771/154753703-58a442d5-bb5a-4b7b-a24c-0e84cc4bda13.png)
