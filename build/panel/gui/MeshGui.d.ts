import { Mesh } from "three";
import { MeshGuiExportParams } from "../Entity";
import { BaseGui } from "./BaseGui";
export declare class MeshGui extends BaseGui {
    private _models;
    private modelMap;
    exportFun?: Function;
    constructor(guiEnable?: boolean);
    updateParams(configMap: Map<string, any>): void;
    private modelSubFolder;
    private initModelGui;
    private initModel;
    private _meshes;
    private initMesh;
    private initPosRotScaleGUI;
    private setMeshValue;
    init(models: any[], meshs: Mesh[], configMap: Map<string, any>, updateSingle?: boolean): void;
    private convertTexture;
    private chooeseMap;
    getExportParams(): MeshGuiExportParams;
    private meshParams;
    private material;
    private clickMesh;
    parseMesh(mesh: any): void;
}
