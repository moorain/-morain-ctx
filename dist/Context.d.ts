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
declare class Context {
    private data;
    private events;
    private functionEvents;
    private onceRunning;
    private context;
    constructor();
    private setupProxy;
    use(nameSpace: string, defaultData?: any): void;
    getContext(nameSpace: string): CtxInstance;
    private _getListeners;
    private _getEventListeners;
    private _triggerChange;
    private _run;
    private _on;
    private _off;
    private _listen;
    private _remove;
}
export default Context;
