---
layout: post
title: "Launching React from a Keycloak theme"
tags: 
  - "keycloak" 
  - "react.js"
---

[Keycloak](https://www.keycloak.org/) is highly themable using `freemarker` templates. But I need more than that to support a shared library of UI components used in the rest of my application. The solution is to use a `window.CONFIG` object to provide theme values to a React application which is launched from `registrationLayout` template. The React application can then use the shared components at build time.  

## Template files

A `react-template.ftl` layout is created in the `keycloak` theme. This is root level HTML for the theme and has markup for mounting the React application. 

`react-template.ftl`
```html
<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>App Name</title>
    <meta charset="utf-8"/>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="${url.resourcesPath}/css/reset.css" rel="stylesheet">
    <script defer="defer" src="${url.resourcesPath}/js/main.a9c8f6d7.js"></script>
    <#nested "form">
  </head>
  <body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  </body>
  </html>
</#macro>
```

Note the `<#nested "form">` inside the `<head>` tag

Each themed page in `keycloak` is a simple template which only defines its parent layout and sets the theme values to an object created in global scope. 

`login.ftl`
```html
<#import "react-template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
  <#outputformat "HTML">
    <script>
      window.CONFIG = {
        resourceUrl: "${url.resourcesPath}",
        loginAction: "${url.loginAction?no_esc}",
        forgetPasswordUrl: "${url.loginResetCredentialsUrl}",
        <#if !usernameHidden??>
          usernameHidden: false,
        <#else>
          usernameHidden: true,
        </#if>
        <#if message?has_content>
          message: {
            summary: '${message.summary}',
            type: '${message.type}',
          },
        </#if>
        env: "theme"
      };
    </script>
  </#outputformat>
</@layout.registrationLayout>
```

## Deployment

`package.json`: 
```js
"build": "react-scripts build && bash postbuild.sh",
```
This example assumes [Create React App](https://create-react-app.dev/) as a starting point for the React app, hence the `react-scripts` for the build. The important point to note is that the custom `postbuild.sh` is called after the react app is built. 

`postbuild.sh`:
```bash
#!/usr/bin/env bash

# copy app resources to theme folder
pathToResources="./keycloak/themes/lsm/login/resources"
rm -rf $pathToResources
cp -r ./build/static $pathToResources

# get hash from the built index.html
build="$(cat build/index.html)"
regex="(.*main.)(.*)(.js.*)"
if [[ $build =~ $regex ]]; then 
  hash=${BASH_REMATCH[2]}
fi

# replace hash in react-template.ftl
template="$(cat ./keycloak/themes/lsm/login/react-template.ftl)"
if [[ $template =~ $regex ]]; then 
  new="${BASH_REMATCH[1]}$hash${BASH_REMATCH[3]}"
fi
echo "$new" > "./keycloak/themes/lsm/login/react-template.ftl"
```
