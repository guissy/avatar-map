System.config({
  baseURL: "/avatar-map",
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "rxjs": "npm:rxjs@5.0.0-beta.7"
  }
});
