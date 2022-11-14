---
layout: post
title: "Mocking third party libraries for simple local development"
tags:
  - "javascript"
  - "keycloak"
---

My application uses keycloak to handle authentication. This works well, but it makes local development fairly tedious. So, to make my life a little more pleasant, I made a mock version of the keycloak library which runs based on an environment variable. This effectively allows me to switch off authentication while I am developing UI features locally. 

First, I created a local environment config file with a key to toggle keycloak:

`env.local.config.js`

```js
export default {
  KEYCLOAK_DISABLED: false,
};
```

Second, I created a utility file which wraps the third party library and exports a mocked functions instead. Because I am mocking the library the production code does not need to change.

`utils/react-keycloak.js`

```js
import * as reactKeycloak from '@react-keycloak/web';
import localEnv from '../env.local.config';

const { KEYCLOAK_DISABLED } = localEnv;

const MockReactKeycloakProvider = function ({
  children
}) {
  return children;
};

const mockUseKeycloak = () => ({
  keycloak: {
    login: () => { },
    logout: () => { },
    authenticated: true,
    idTokenParsed: {
      authorities: ['EDITOR', 'ADMIN']
    },
    tokenParsed: {
      preferred_username: 'Local User'
    }
  }
});

export const ReactKeycloakProvider = KEYCLOAK_DISABLED
  ? MockReactKeycloakProvider
  : reactKeycloak.ReactKeycloakProvider;

export const useKeycloak = KEYCLOAK_DISABLED
  ? mockUseKeycloak
  : reactKeycloak.useKeycloak;
```

The same pattern could be applied with any third party library which needs to be disabled or mocked.