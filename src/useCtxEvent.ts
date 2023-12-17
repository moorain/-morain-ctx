import React, { useEffect } from 'react';
import instance from './ctx';

export default (nameString: string, callback?: any) => {
  const [nameSpace, code] = nameString.split(':');
  const ctx = instance.getContext(nameSpace);

  useEffect(() => {
    if (callback) {
      ctx.listen(code, callback);
      return () => {
        ctx.remove(code, callback);
      };
    }
  }, []);

  return (params?: any) => {
    ctx.run(code, params);
  };
};
