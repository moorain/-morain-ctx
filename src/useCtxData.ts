import { useEffect, useState, useRef } from 'react';
import instance from './ctx';

const pattern = /^([a-zA-Z0-9]+):([a-zA-Z0-9]+)(?:\.[a-zA-Z0-9]+)*$/;

function getValueFromKeys(obj: any, keys: string[]): unknown {
  if (obj == null || !Array.isArray(keys)) return undefined;
  return keys.reduce((accumulator: any, currentKey: string) => {
    return accumulator != null && typeof accumulator === 'object' && currentKey in accumulator
      ? accumulator[currentKey]
      : undefined;
  }, obj);
}

export default <T = any>(spaceString: string) => {
  if (!pattern.test(spaceString) || typeof spaceString !== 'string') {
    // 如果传入的参数不符合规范，抛出错误
    throw new Error('useCtx: 传入的参数不符合规范');
  }

  const [nameSpace, codeString] = spaceString.split(':');

  //获取代理实例
  const ctx = instance.getContext(nameSpace);

  if (!ctx) {
    throw new Error(`useCtx: 未找到命名空间${nameSpace}`);
  }

  const [code, ...rest] = codeString.split('.');

  const stateRef = useRef<T>();

  const [state, setState] = useState<T>(getValueFromKeys(ctx.data[code], rest) as T);

  stateRef.current = state;

  useEffect(() => {
    const handler = (res: any) => {
      const value = getValueFromKeys(res, rest);
      if (value !== stateRef.current) {
        setState(value as any);
      }
    };

    ctx.on(code, handler);
    return () => {
      ctx.off(code, handler);
    };
  }, []);

  return state;
};
