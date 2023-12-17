type EventListener = Record<string | symbol, Function[]>;

type Prop = string | symbol;
type Callback = (res?: any) => void;

export type CtxInstance<T> = {
  data: T;
  run: (code: string, params: any) => void;
  listen: (code: string, callback: Callback) => void;
  remove: (code: string, callback: Callback) => void;
  on: (code: string, callback: Callback) => void;
  off: (code: string, callback: Callback) => void;
};

class Context {
  private _data: any;
  private _events: Record<string, EventListener>;
  private _functionEvents: Record<string, any>;
  private _onceRunning: Record<string, any>;
  private _context: Record<string, CtxInstance<any>>;
  [key: string]: any;

  constructor() {
    this._events = {};
    this._functionEvents = {};
    this._data = {};
    this._onceRunning = {};
    this._context = {};
    this.use('global', { key: 'globalState' });
  }

  private _getNameSpace(spaceString: string) {
    if (typeof spaceString === 'string') {
      if (spaceString.indexOf(':') > -1) {
        const [name, code] = spaceString.split(':');
        return { name, code };
      } else {
        return { name: 'global', code: spaceString };
      }
    } else {
      throw new Error('nameSpace must be string');
    }
  }

  private _setupProxy(nameSpace: string, defaultData: any) {
    const that = this;
    const handler: ProxyHandler<any> = {
      get(target, prop) {
        return target[prop];
      },
      set(target, prop, value) {
        target[prop] = value;
        that._triggerChange(nameSpace, prop, value);
        return true;
      },
      deleteProperty(target, prop) {
        delete target[prop];
        return true;
      },
    };
    this._data[nameSpace] = new Proxy({ ...defaultData }, handler);
  }

  private _isValidNamespace(nameSpace: string) {
    return typeof nameSpace === 'string';
  }

  public use<T>(nameSpace: string, defaultData: T) {
    if (this._isValidNamespace(nameSpace) && !this._context[nameSpace]) {
      this._setupProxy(nameSpace, defaultData);
      this._events[nameSpace] = {};
      this._functionEvents[nameSpace] = {};
      this._onceRunning[nameSpace] = {};

      const context: CtxInstance<T> = {
        data: this._data[nameSpace] as T,
        run: (code: string, params: any) => {
          this.run(`${nameSpace}:${code}`, params);
        },
        listen: (code: string, callback: Callback) => {
          this.listen(`${nameSpace}:${code}`, callback);
        },
        remove: (code: string, callback: Callback) => {
          this.remove(`${nameSpace}:${code}`, callback);
        },
        on: (code: string, callback: Callback) => {
          this.on(`${nameSpace}:${code}`, callback);
        },
        off: (code: string, callback: Callback) => {
          this.off(`${nameSpace}:${code}`, callback);
        },
      };

      this._context[nameSpace] = context;

      // 动态添加新的访问器
      Object.defineProperty(Context.prototype, nameSpace, {
        get() {
          return this._data[nameSpace] as T;
        },
        enumerable: true,
        configurable: true,
      });
    } else {
      throw new Error('Invalid namespace or namespace already exists!');
    }
  }

  private _getListeners(nameSpace: string, code: Prop) {
    return this._events[nameSpace][code];
  }

  private _getEventListeners(nameSpace: string, code: Prop) {
    return this._functionEvents[nameSpace][code];
  }

  private _triggerChange(nameSpace: string, prop: Prop, value: any) {
    const listener = this._getListeners(nameSpace, prop);
    if (listener) {
      listener.forEach((callback) => {
        callback(value);
      });
    }
  }

  public destroy() {
    this._events = null as any;
    this._functionEvents = null as any;
    this._data = null as any;
    this._onceRunning = null as any;
    this._context = null as any;
  }

  public getContext<T = any>(nameSpace: string) {
    return this._context[nameSpace] as CtxInstance<T>;
  }

  public data(nameSpace = 'global') {
    return this._data[nameSpace];
  }

  public once(nameString: string, callback: (next: any) => void) {
    const { name, code } = this._getNameSpace(nameString);
    if (this._onceRunning[name][code] !== 'running') {
      this._onceRunning[name][code] = 'running';
      if (typeof callback === 'function') {
        callback(() => {
          this._onceRunning[name][code] = 'waitingNext';
        });
      }
    }
  }

  public run(nameString: string, params: any) {
    const { name, code } = this._getNameSpace(nameString);
    const listener = this._getEventListeners(name, code);
    if (listener) {
      listener.forEach((callback: any) => {
        callback(params);
      });
    }
  }

  public on(nameString: string, callback: Callback) {
    const { name, code } = this._getNameSpace(nameString);
    const listener = this._getListeners(name, code);
    if (listener) {
      listener.push(callback);
    } else {
      this._events[name][code] = [callback];
    }
  }

  public off(nameString: string, callback: Callback) {
    const { name, code } = this._getNameSpace(nameString);
    const listeners = this._getListeners(name, code);

    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public listen(nameString: string, callback: Callback) {
    const { name, code } = this._getNameSpace(nameString);
    const eventListener = this._getEventListeners(name, code);
    if (eventListener) {
      eventListener.push(callback);
    } else {
      this._functionEvents[name][code] = [callback];
    }
  }

  public remove(nameString: string, callback: Callback) {
    const { name, code } = this._getNameSpace(nameString);
    const listeners = this._getEventListeners(name, code);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

export default Context;
