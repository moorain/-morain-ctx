# @morain/ctx Reactivity and Event Dispatch

This component demonstrates how to use the `useCtxEvent`，`useCtxData` hook from the `@morain/ctx` package to handle global events.

## Installation

To use `@morain/ctx` in your React project, you need to install the package as a dependency.

```bash
npm install @morain/ctx
```

## Example

store.js

```typescript
import { ctx } from '@morain/ctx';

ctx.use('global', {
  name: 'name',
});

ctx.use('page', {
  pageName: 'name',
});
```

index.tsx

```typescript
import React from'react';
import { ctx, useCtxEvent, useCtxData } from '@morain/ctx';

const global = ctx.getContext('global');

export default function App() {
  const handleClick = () => {
    console.log('Clicked!');
  };

  const globalData = useCtxData('name');
  const pageName = useCtxData('page:name');

  useCtxEvent('click', handleClick);

  return (
    <div>
      {globalData}
      {pageName}
      <button onClick={() => global.data.name = 'Hello World'}Click Me</button>
    </div>

```
