---
layout: post
title: "Custom Node server with webpack"
tags:
  - "webpack"
  - "node.js"
---

My application has a custom `node.js` server for local development. It is very custom and can't be easily replaced by the more idiomatic [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/). I need the custom script to run after the webpack build is complete and I want the server to run automatically.

In `package.json`:

```js
"scripts": {
  "start":
    "webpack --env local development serve --config ./webpack.config.js",
  "server": "cd ./my-custom-server && node ./server.js",
  // other scripts...
}
```

To run the server script I've created an ad-hoc plugin in my webpack config.

In `webpack.config.js`:

```js
module.exports = (env) => {
  return {
    // other settings...
    plugins: [
      // other plugins...
      {
        apply: (compiler) => {
          console.log("Running local server on port 7000");
          compiler.hooks.afterEmit.tap("foobar", () => {
            exec("npm run server");
          });
        },
      },
    ],
  };
};
```

Now, I only run `npm start` and don't need to open a new terminal window for `npm run server`

See webpack documentation on [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/) for more details.
