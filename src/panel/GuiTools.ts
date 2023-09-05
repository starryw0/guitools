import { Camera, Group, Light, Mesh } from "three";
import { EffectParams, FileParams, GuiParams, SceneParams } from "./Entity";
import { FileUtils } from "./FileUtils";
import { GuiEvent } from "./GuiEvent";
import { EffectGui } from "./gui/EffectGui";
import { LightGui } from "./gui/LightGui";
import { MeshGui } from "./gui/MeshGui";
import { SceneGui } from "./gui/SceneGui";


var configMap: Map<string, any>;
export class GuiTools {
    private sceneConfigMap: Map<string, Map<string, any>> = new Map();
    private _sceneName: string = '';

    effectGui?: EffectGui;
    private lightGui: LightGui;
    private sceneGui: SceneGui;
    private meshGui: MeshGui;

    private static instance: GuiTools;
    public static getInstance(): GuiTools {
        if (!GuiTools.instance)
            this.instance = new GuiTools();
        return GuiTools.instance;
    }

    private constructor() {
    }

    private getFileName(): string {
        return `${this._sceneName}GuiConfig`;
    }

    private export() {
        var sceneGuiExportParams = this.sceneGui.getExportParams();
        const fileParams: FileParams = {
            fileName: this.getFileName(),
            meshGuiExportParams: this.meshGui.getExportParams(),
            sceneGuiExportParams: sceneGuiExportParams,
            lightGuiExportParams: this.lightGui.getExportParams(),
            effectGuiExportParams: this.effectGui?.getExportParams(),
        };
        if (sceneGuiExportParams.format == 'ts') {
            var data = FileUtils.generateTSFile(fileParams);
            FileUtils.downFile(`${this.getFileName()}.ts`, data);
        } else if (sceneGuiExportParams.format == 'json') {
            var data = FileUtils.generateJSONFile(fileParams);
            FileUtils.downFile(`${this.getFileName()}.json`, data);
        }
    }

    parse(sceneParams: SceneParams, guiParams: GuiParams, effectParams?: EffectParams) {
        this.initEvents(sceneParams);
        configMap = this.sceneConfigMap.get(sceneParams.sceneName) ?? new Map();
        this._sceneName = sceneParams.sceneName;
        if (!sceneParams.camera.name) sceneParams.camera.name = 'Main_Camera';
        var cameras: Camera[] = [sceneParams.camera];
        var lights: Light[] = [];
        var meshs: Mesh[] = [];
        var models: any[] = [];
        sceneParams.scene.traverse((child: any) => {
            if (child.name) {
                if (child instanceof Camera) {
                    cameras.push(child);
                }
                if (child instanceof Mesh) {
                    meshs.push(child);
                }
                if (child instanceof Light) {
                    lights.push(child);
                }
                if (child instanceof Group && child.name.startsWith('model_')) {
                    models.push(child);
                }
            }
        });
        this.meshGui = new MeshGui(this.enableGui && guiParams.meshGui);
        this.meshGui.init(models, meshs, configMap);

        this.lightGui = new LightGui(sceneParams.scene, this.enableGui && guiParams.lightGui);
        this.lightGui.initValues(configMap, lights);

        if (guiParams.effectGui && effectParams) {
            this.effectGui = new EffectGui(effectParams, this.enableGui && guiParams.effectGui);
            this.effectGui.initValues(configMap);
        }

        this.sceneGui = new SceneGui(sceneParams.scene, cameras, this.enableGui && guiParams.sceneGui);
        this.sceneGui.initValues(configMap);
        this.sceneGui.exportFun = () => { this.export() };
    }

    private guiEvent: GuiEvent;
    private initEvents(sceneParams: SceneParams) {
        this.guiEvent?.removeListeners();
        this.guiEvent = new GuiEvent({
            containter: sceneParams.containter,
            scene: sceneParams.scene,
            camera: sceneParams.camera,
        });
        this.guiEvent.clickFun = (obj: any) => {
            if (!this.enableGui) return
            this.meshGui.parseMesh(obj);
        };
        this.guiEvent.dropFun = (jsonMap: Map<string, any>) => {
            if (!this.enableGui) return
            configMap = jsonMap;
            this.sceneGui.updateParams(configMap);
            this.meshGui.updateParams(configMap);
            this.lightGui.updateParams(configMap);
            this.effectGui?.updateParams(configMap);
        };
        this.guiEvent.registerListeners();
    }

    registerConfig(sceneName: string, config: any) {
        if (sceneName == null || config == null || config.configMap == null) return;
        this.sceneConfigMap.set(sceneName, config.configMap);
    }

    enableGui: boolean = false;
}

