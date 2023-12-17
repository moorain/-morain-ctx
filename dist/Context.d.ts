type Callback = (res?: any) => void;
export type CtxInstance<T> = {
    data: T;
    run: (code: string, params: any) => void;
    listen: (code: string, callback: Callback) => void;
    remove: (code: string, callback: Callback) => void;
    on: (code: string, callback: Callback) => void;
    off: (code: string, callback: Callback) => void;
};
declare class Context {
    private _data;
    private _events;
    private _functionEvents;
    private _onceRunning;
    private _context;
    [key: string]: any;
    constructor();
    private _getNameSpace;
    private _setupProxy;
    private _isValidNamespace;
    use<T>(nameSpace: string, defaultData: T): void;
    private _getListeners;
    private _getEventListeners;
    private _triggerChange;
    destroy(): void;
    getContext<T = any>(nameSpace: string): CtxInstance<T>;
    data(nameSpace?: string): any;
    once(nameString: string, callback: (next: any) => void): void;
    run(nameString: string, params: any): void;
    on(nameString: string, callback: Callback): void;
    off(nameString: string, callback: Callback): void;
    listen(nameString: string, callback: Callback): void;
    remove(nameString: string, callback: Callback): void;
}
export default Context;
