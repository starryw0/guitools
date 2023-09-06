import { GuiEventParams } from "./Entity";
export declare class GuiEvent {
    private readonly guiEventParams;
    private container;
    private _dragover;
    private _drop;
    clickFun?: Function;
    dropFun?: Function;
    constructor(guiEventParams: GuiEventParams);
    private touch;
    private pointer;
    private raycaster;
    private clickEvent;
    private intersects;
    private TouchStart;
    private TouchMove;
    private TouchEnd;
    private Drop;
    private Dragover;
    registerListeners(): void;
    removeListeners(): void;
}
