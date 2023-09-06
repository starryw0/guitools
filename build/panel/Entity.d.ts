import { Camera, Data3DTexture, DataTexture, Light, Mesh, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { BokehPassParamters } from "three/examples/jsm/postprocessing/BokehPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
export declare class MeshEntry {
    readonly isModelMesh: Boolean;
    readonly mesh: Mesh;
    constructor(isModelMesh: Boolean, mesh: Mesh);
}
export interface GuiParams {
    meshGui?: boolean | undefined;
    sceneGui?: boolean | undefined;
    lightGui?: boolean | undefined;
    effectGui?: boolean | undefined;
}
export interface SceneParams {
    sceneName: string;
    containter: HTMLElement;
    scene: Scene;
    camera: Camera;
}
export interface FileParams {
    fileName: string;
    meshGuiExportParams: MeshGuiExportParams;
    lightGuiExportParams: LightGuiExportParams;
    sceneGuiExportParams: SceneGuiExportParams;
    effectGuiExportParams?: EffectGuiExportParams | null;
}
export interface BloomPassParams {
    bloomStrength: 1;
    bloomThreshold: 0;
    bloomRadius: 0;
    exposure: 1;
}
export interface MeshGuiExportParams {
    meshMap: Map<string, MeshEntry>;
    models?: Object3D[];
}
export interface EffectGuiExportParams {
    bokehPassParams?: BokehPassParamters | null;
    bloomPassParams?: BloomPassParams | null;
    lutIntensity?: Number | null;
}
export interface SceneGuiExportParams {
    format: string;
    scene: Scene;
    cameras: Camera[];
}
export interface LightGuiExportParams {
    lights?: Light[] | null | undefined;
}
export interface EffectParams {
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    composer: EffectComposer | undefined;
    bokeh?: boolean | undefined;
    bloom?: boolean | undefined;
    lut?: boolean | undefined;
    lutTexutre?: DataTexture | Data3DTexture;
}
export interface GuiEventParams {
    containter: HTMLElement;
    camera: Camera;
    scene: Scene;
}
