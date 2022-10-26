---
layout: post
title: "Nesting classes with postCSS"
tags:
  - "postcss"
  - "webpack"
---

The `postcss` plugin [postcss-nested](https://www.npmjs.com/package/postcss-nested) can be used to scope styles. This is how I configured `webpack` and installed the plugin for my application.

This guide uses:

```
"webpack": "5.72.1",
"postcss": "8.4.17",
"postcss-loader": "7.0.1",
"postcss-nested": "5.0.6",
```

First, install the `postcss` in your application

```
npm i postcss-nested
```

Use `postcss-loader` in your `webpack.config.js`

```js
{
  test: /\.css$/i,
  use: [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    'postcss-loader'
  ]
},
```

Edit `post.config.js` to use the `postcss-nested` plugin.

```js
module.exports = {
  plugins: [require("postcss-nested"), ["autoprefixer"]],
};
```

> **NOTE:** Install a `postcss` syntax highlighter for your editor. Standard `css` doesn't support nesting.

Wrap your target with a unique `id`. The specificity of an `id` attribute is helpful for targeting styles inside the component. It will also provide a degree of protection against name collision with other class names in your app.

```html
<div id="foobar"><ThirdPartyComponent /></div>
```

Now all new styles can be scoped with `#foobar` without having to type it more than once.

For example:

```
#foobar {
  .my-class {
    &__selected {
      font-weight: bold;
    }
  }
}
```

compiles to:

```css
#foobar .my-class__selected {
  font-weight: bold;
}
```
