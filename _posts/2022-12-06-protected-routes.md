---
layout: post
title: "Making Protected Routes with React Router"
tags:
  - "react"
  - "react-router"
---

Preventing a user from reaching a protected route is as simple as making a higher order component to check for authentication. This tutorial uses [`react-router-dom`](https://reactrouter.com/en/main).

If, for example your app has an *Edit* page which only authenticated users may reach, configure a `Route` like this:

```jsx
<Route
  path="/edit/:taskId"
  element={(
    <Protected authenticated={authenticated}>
      <EditTask currentUser={authenticated?.user} />
    </Protected>
  )}
/>
```

The component for the page is protected by a component called `Protected`. 

> Note: The `Route` component cannot be wrapped with `<Protected />` because `Routes` and `Route`, which come from the `react-router-dom` library must only have children that are `Route`. Wrap the component before passing it as an `element` instead.


## `<Protected />` Component

`<Protected />` receives a prop `authenticated` with a boolean value to tell it what to do with the child component.

```jsx
import React from 'react';
import Login from './Login';

function Protected({ authenticated, children }) {
  return authenticated 
    ? children 
    : <Login loading={authenticated === undefined} />;
}
export default Protected;
```

The internal logic is very simple. Simply return the children if `authenticated` is true, otherwise render the *Login* screen. 

If you need to expand with multiple user roles (such as "Admin" or "Editor") the logic for `<Protected />` stays the same. Provide a boolean value for the authenticated state based on data from the backend as needed. For example:

```jsx
<Route
  path="/edit/:taskId"
  element={(
    <Protected authenticated={authObj.role==='admin' || authObj.role==='editor' }>
      <EditTask currentUser={authenticated?.user} />
    </Protected>
  )}
/>
```
