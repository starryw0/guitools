import { Camera, Group, Light, Mesh } from "three";
import { FileUtils } from "./FileUtils";
import { GuiEvent } from "./GuiEvent";
import { EffectGui } from "./gui/EffectGui";
import { LightGui } from "./gui/LightGui";
import { MeshGui } from "./gui/MeshGui";
import { SceneGui } from "./gui/SceneGui";
var configMap;
export class GuiTools {
    static getInstance() {
        if (!GuiTools.instance)
            this.instance = new GuiTools();
        return GuiTools.instance;
    }
    constructor() {
        this.sceneConfigMap = new Map();
        this._sceneName = '';
        this.enableGui = false;
    }
    getFileName() {
        return `${this._sceneName}GuiConfig`;
    }
    export() {
        var _a;
        var sceneGuiExportParams = this.sceneGui.getExportParams();
        const fileParams = {
            fileName: this.getFileName(),
            meshGuiExportParams: this.meshGui.getExportParams(),
            sceneGuiExportParams: sceneGuiExportParams,
            lightGuiExportParams: this.lightGui.getExportParams(),
            effectGuiExportParams: (_a = this.effectGui) === null || _a === void 0 ? void 0 : _a.getExportParams(),
        };
        if (sceneGuiExportParams.format == 'ts') {
            var data = FileUtils.generateTSFile(fileParams);
            FileUtils.downFile(`${this.getFileName()}.ts`, data);
        }
        else if (sceneGuiExportParams.format == 'json') {
            var data = FileUtils.generateJSONFile(fileParams);
            FileUtils.downFile(`${this.getFileName()}.json`, data);
        }
    }
    parse(sceneParams, guiParams, effectParams) {
        var _a;
        this.initEvents(sceneParams);
        configMap = (_a = this.sceneConfigMap.get(sceneParams.sceneName)) !== null && _a !== void 0 ? _a : new Map();
        this._sceneName = sceneParams.sceneName;
        if (!sceneParams.camera.name)
            sceneParams.camera.name = 'Main_Camera';
        var cameras = [sceneParams.camera];
        var lights = [];
        var meshs = [];
        var models = [];
        sceneParams.scene.traverse((child) => {
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
        this.sceneGui.exportFun = () => { this.export(); };
    }
    initEvents(sceneParams) {
        var _a;
        (_a = this.guiEvent) === null || _a === void 0 ? void 0 : _a.removeListeners();
        this.guiEvent = new GuiEvent({
            containter: sceneParams.containter,
            scene: sceneParams.scene,
            camera: sceneParams.camera,
        });
        this.guiEvent.clickFun = (obj) => {
            if (!this.enableGui)
                return;
            this.meshGui.parseMesh(obj);
        };
        this.guiEvent.dropFun = (jsonMap) => {
            var _a;
            if (!this.enableGui)
                return;
            configMap = jsonMap;
            this.sceneGui.updateParams(configMap);
            this.meshGui.updateParams(configMap);
            this.lightGui.updateParams(configMap);
            (_a = this.effectGui) === null || _a === void 0 ? void 0 : _a.updateParams(configMap);
        };
        this.guiEvent.registerListeners();
    }
    registerConfig(sceneName, config) {
        if (sceneName == null || config == null || config.configMap == null)
            return;
        this.sceneConfigMap.set(sceneName, config.configMap);
    }
}
