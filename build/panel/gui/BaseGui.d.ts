import { GUI } from "dat.gui";
export declare abstract class BaseGui {
    protected guiEnable: boolean;
    protected configMap: Map<string, any>;
    constructor(guiEnable: boolean);
    protected setValue(key: string, cb: Function): void;
    abstract updateParams(configMap: Map<string, any>): void;
    abstract getExportParams(): any;
    private input;
    protected chooeseImage(result?: Function): void;
    moveParams: {
        x: number;
        y: number;
    };
    protected addGUIMoveFolder(gui: GUI): void;
}
