import React, { useEffect } from 'react';
import ctx from './ctx';

export default (nameString: string, callback?: any) => {
  useEffect(() => {
    if (callback) {
      ctx.listen(nameString, callback);
      return () => {
        ctx.remove(nameString, callback);
      };
    }
  }, []);

  return (params?: any) => {
    ctx.run(nameString, params);
  };
};
