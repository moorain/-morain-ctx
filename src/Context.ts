type EventListener = Record<string | symbol, Function[]>;

type DefaultData = {
  [key: string]: any;
};

type Prop = string | symbol;

export type CtxInstance = {
  data: any;
  get: (code: string) => any;
  set: (code: string, value: any) => void;
  run: (code: string, params: any) => void;
  on: (code: string, callback: Function) => void;
  off: (code: string, callback: Function) => void;
  listen: (code: string, callback: Function) => void;
  remove: (code: string, callback: Function) => void;
  once: (code: string, callback: (next: any) => void) => void;
};

class Context {
  private data: any;
  private events: Record<string, EventListener>;
  private functionEvents: Record<string, any>;
  private onceRunning: Record<string, any>;
  private context: any;

  constructor() {
    this.events = {};
    this.functionEvents = {};
    this.data = {};
    this.onceRunning = {};
    this.context = {};
  }

  private setupProxy(nameSpace: string, defaultData?: DefaultData) {
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
    this.data[nameSpace] = new Proxy({ ...defaultData }, handler);
  }

  use(nameSpace: string, defaultData?: any) {
    if (nameSpace) {
      this.setupProxy(nameSpace, defaultData);
      this.events[nameSpace] = {};
      this.functionEvents[nameSpace] = {};
      this.onceRunning[nameSpace] = {};
      const context = {
        data: this.data[nameSpace],
        get: (code: string) => {
          return this.data[nameSpace][code];
        },
        set: (code: string, value: any) => {
          this.data[nameSpace][code] = value;
        },
        run: (code: string, params: any) => {
          this._run(nameSpace, code, params);
        },
        on: (code: string, callback: Function) => {
          this._on(nameSpace, code, callback);
        },
        off: (code: string, callback: Function) => {
          this._off(nameSpace, code, callback);
        },
        listen: (code: string, callback: Function) => {
          this._listen(nameSpace, code, callback);
        },
        remove: (code: string, callback: Function) => {
          this._remove(nameSpace, code, callback);
        },
        once: (code: string, callback: (next: any) => void) => {
          if (this.onceRunning[nameSpace][code] !== 'running') {
            this.onceRunning[nameSpace][code] = 'running';
            if (typeof callback === 'function') {
              callback(() => {
                this.onceRunning[nameSpace][code] = 'waitingNext';
              });
            }
          }
        },
      };
      this.context[nameSpace] = context;
    }
  }

  getContext(nameSpace: string) {
    return this.context[nameSpace] as CtxInstance;
  }

  private _getListeners(nameSpace: string, code: Prop) {
    return this.events[nameSpace][code];
  }

  private _getEventListeners(nameSpace: string, code: Prop) {
    return this.functionEvents[nameSpace][code];
  }

  private _triggerChange(nameSpace: string, prop: Prop, value: any) {
    const listener = this._getListeners(nameSpace, prop);
    if (listener) {
      listener.forEach((callback) => {
        callback(value);
      });
    }
  }

  private _run(nameSpace: string, code: string, params: any) {
    const listener = this._getEventListeners(nameSpace, code);
    if (listener) {
      listener.forEach((callback: any) => {
        callback(params);
      });
    }
  }

  private _on(nameSpace: string, code: Prop, callback: Function) {
    const listener = this._getListeners(nameSpace, code);
    if (listener) {
      listener.push(callback);
    } else {
      this.events[nameSpace][code] = [callback];
    }
  }

  private _off(nameSpace: string, code: string, callback: Function) {
    const listeners = this._getListeners(nameSpace, code);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private _listen(nameSpace: string, code: string, callback: Function) {
    const eventListener = this._getEventListeners(nameSpace, code);
    if (eventListener) {
      eventListener.push(callback);
    } else {
      this.functionEvents[nameSpace][code] = [callback];
    }
  }

  private _remove(nameSpace: string, code: string, callback: Function) {
    const listeners = this._getEventListeners(nameSpace, code);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

export default Context;
