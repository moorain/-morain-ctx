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
  hobbies: {
    name: {
      smallName: 'default name',
    },
  },
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

  const name = useCtxData('global:hobbies.name.smallName');
  useCtxEvent('click', handleClick);

  return (
    <div>
      {name}
      <button onClick={() => global.data.hobbies.name.smallName = 'Hello World'}Click Me</button>
    </div>

```
