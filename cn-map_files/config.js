System.config({
  baseURL: "/avatar-map",
  defaultJSExtensions: true,
  // transpiler: "typescript",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "rxjs": "http://cdn.bootcss.com/rxjs-dom/7.0.3/rx.dom.min.js"
  }
});
