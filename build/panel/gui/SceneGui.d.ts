import { Camera, Scene } from "three";
import { SceneGuiExportParams } from "../Entity";
import { BaseGui } from "./BaseGui";
export declare class SceneGui extends BaseGui {
    readonly cameras: Camera[];
    private scene;
    private cameraHelpers;
    exportFun?: Function;
    constructor(scene: Scene, cameras: Camera[], guiEnable?: boolean);
    getExportParams(): SceneGuiExportParams;
    private params;
    private chooeseMap;
    private initGui;
    private addHelper;
    private removeHelper;
    updateParams(configMap: Map<string, any>): void;
    initValues(configMap: Map<string, any>): void;
}
