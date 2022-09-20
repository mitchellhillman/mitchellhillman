---
layout: post
title: "Micro-frontend architecture with iframes"
tags: 
  - "micro-frontend" 
  - "react.js"
  - "single-spa"
---

I used an `iframe` to accomplish a micro-frontend architecture for a legacy application. In my case, the monolithic application required too much refactoring to adopt a framework like [`single-spa`](https://single-spa.js.org/), but it still needed to add a feature which could be independently deployed and shared with other applications (as well as use modern frameworks for its own development). An iframe was a simple solution but required some hacking for the new micro-frontend UI to be seamlessly embedded into its parent. To accomplish this, the embedded micro-frontend used `window.postMessage` to communicate the UI height and route to the parent. 

## Parent App (core-ui)

Component to render a micro-frontend in an `iframe`

```
import React, { useEffect, useState } from 'react';

const IframeMFE = ({ 
    defaultHeight
    parentPath,
    src,
    title,
  }) => {

  const [height, setHeight] = useState(defaultHeight);

  const handler = (event) => {
    const { frameHeight, frameURL } = event.data;
    if(frameHeight) {
      setHeight(frameHeight);
    }
    if (frameURL) {
      // used by parent app router to enable deep linking
      window.history.pushState('', '', `${parentPath}/${frameURL}`);
    }
  };

  // intentionally outside of useEffect to avoid race condition with child app
  window.addEventListener('message', handler);

  return (
    <iframe
      style={{ height, width: '100%' }}
      frameBorder="0"
      scrolling="no"
      title={title}
      src={src}
    />
  );
};
```
Note: the event listener is intentionally outside of `useEffect` to avoid a race condition with the child app
## Child App (micro-frontend)

Function to test if app is inside an iframe:
```
const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};
```

React hook to communicate with the parent application using `postMessage`:
```
export const usePostFrameHeight = () => {
  useEffect(() => {
    if (inIframe()) {
      window.parent.postMessage( { frameHeight: document.body.clientHeight }, "*" );
    }
  });
};
```
Additionally, each time the micro-frontend navigates to a new route it also needs to send a postMessage with the new location:
```
  window.parent.postMessage({ frameURL: "emails" }, "*");
  navigate(`${constants.rootPath}emails`, { replace: true });
```

## CORS Issues

The child app (micro-frontend) must allow itself to embedded in an iframe. For local development I set the headers for the `webpack-dev-server` to enable this.

Example `webpack.config.js`:
```
module.exports = (env) => ({
  ...
  devServer: {
    ...
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
});
```

Also, The [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) function takes a second parameter for the `targetOrigin`. This can be set to `*` or something more specific. In production this value was set to the deployed URL of the parent application. 