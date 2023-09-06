import { Light, Scene } from "three";
import { LightGuiExportParams } from "../Entity";
import { BaseGui } from "./BaseGui";
export declare class LightGui extends BaseGui {
    private readonly scene;
    constructor(scene: Scene, guiEnable?: boolean);
    private lightParams;
    private _lights;
    initValues(configMap: Map<string, any>, light: Light[], init?: boolean): void;
    private lightHelpers;
    private initGui;
    private addHelper;
    private removeHelper;
    getExportParams(): LightGuiExportParams;
    updateParams(configMap: Map<string, any>): void;
}
