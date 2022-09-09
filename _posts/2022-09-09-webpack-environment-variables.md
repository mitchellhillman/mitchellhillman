---
layout: post
title: "Environment variables with webpack"
tags: 
  - "webpack" 
---

Webpack supports environment variables at build time using the `DefinePlugin`. I used this technique to avoid manually setting environment specific values in my single page application. 

In `webpack.config.js`:

```
module.exports = (env) => {
  return {    
    // other settings...
    plugins: [
      new webpack.DefinePlugin({
        'process.env.development': JSON.stringify(env.development),
        'process.env.local': JSON.stringify(env.local)
      })
    ]
  }
}
```

Then, in my application I can access the `process.env`. For example:

```
const config = process.env.local ? localConfig : deployedConfig;
```

For more details see webpack's own documentation for the [Environment Plugin](https://webpack.js.org/plugins/environment-plugin/)