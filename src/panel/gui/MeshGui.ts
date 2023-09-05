import { GUI } from "dat.gui";
import { Clock, Color, Mesh, Object3D, Texture, TextureLoader, sRGBEncoding } from "three";
import { MeshEntry, MeshGuiExportParams } from "../Entity";
import { BaseGui } from "./BaseGui";

var modelGUI: GUI;
var meshGUI: GUI;
var meshMap: Map<string, MeshEntry> = new Map();
var modelMeshNameList: Array<string> = new Array();
export class MeshGui extends BaseGui {
    private _models: any[];
    private modelMap: Map<string, any> = new Map();
    exportFun?: Function;

    constructor(guiEnable = false) {
        super(guiEnable);
    }

    updateParams(configMap: Map<string, any>): void {
        this.init(this._models, this._meshes, configMap);
    }

    private modelSubFolder: GUI;
    private initModelGui(): void {
        if (!this.guiEnable) return;
        if (modelGUI) {
            modelGUI.destroy();
        }
        modelGUI = new GUI();
        this.addGUIMoveFolder(modelGUI);
        const modelNameList: string[] = [];
        for (let key of this.modelMap.keys()) {
            modelNameList.push(key);
        }
        const dropdown = { 选择模型: modelNameList[0] };
        var curModel = this.modelMap.get(modelNameList[0]);
        var fun = () => {
            this.modelSubFolder = modelGUI.addFolder(`模型： ${curModel.name}`);
            this.modelSubFolder.open();
            this.initPosRotScaleGUI(this.modelSubFolder, curModel, true);
        };
        modelGUI.add(dropdown, '选择模型').options(modelNameList).onChange((val) => {
            curModel = this.modelMap.get(val);
            if (this.modelSubFolder) {
                modelGUI.removeFolder(this.modelSubFolder);
            }
            animateWaitFor(0.1, () => {
                fun();
            })
        });
        fun();
    }

    private initModel(model: any) {
        this.setValue(`model_${model.name}_posx`, (value: any) => { model.position.x = value; });
        this.setValue(`model_${model.name}_posy`, (value: any) => { model.position.y = value; });
        this.setValue(`model_${model.name}_posz`, (value: any) => { model.position.z = value; });
        this.setValue(`model_${model.name}_rotationx`, (value: any) => { model.rotation.x = value; });
        this.setValue(`model_${model.name}_rotationy`, (value: any) => { model.rotation.y = value; });
        this.setValue(`model_${model.name}_rotationz`, (value: any) => { model.rotation.z = value; });
        this.setValue(`model_${model.name}_scale`, (value: any) => { model.scale.set(value, value, value); });
        model.traverse((child: any) => {
            if (!child.isMesh) return;
            child.material.transparent = true;
            this.setMeshValue(child);
            const entry = new MeshEntry(true, child);
            meshMap.set(child.name, entry);
            modelMeshNameList.push(child.name);
        });
        this.initModelGui();
    }

    private _meshes: Mesh[] = [];
    private initMesh(meshes: Mesh[]) {
        if (meshes == null || meshes.length == 0) return;
        this._meshes = meshes;
        meshes.forEach(child => {
            (child as any).material.transparent = true;
            this.setMeshValue(child);
            const entry = new MeshEntry(false, child);
            meshMap.set(child.name, entry);
        });
    }

    private initPosRotScaleGUI(gui: GUI, obj: Object3D, isModel = true) {
        const positionFolder = gui.addFolder('位置');
        const posStep = 2;
        positionFolder.add(obj.position, 'x', obj.position.x - posStep, obj.position.x + posStep, 0.01);
        positionFolder.add(obj.position, 'y', obj.position.y - posStep, obj.position.y + posStep, 0.01);
        positionFolder.add(obj.position, 'z', obj.position.z - posStep, obj.position.z + posStep, 0.01);
        positionFolder.open();
        const rotationFolder = gui.addFolder('旋转');
        const rotationStep = Math.PI / 2;
        const rotation = obj.rotation;
        rotationFolder.add(rotation, 'x', rotation.x - rotationStep, rotation.x + rotationStep, 0.01);
        rotationFolder.add(rotation, 'y', rotation.y - rotationStep, rotation.y + rotationStep, 0.01);
        rotationFolder.add(rotation, 'z', rotation.z - rotationStep, rotation.z + rotationStep, 0.01);
        rotationFolder.open();
        const scaleFolder = gui.addFolder('缩放');
        const scaleStep = 1;
        if (isModel) {
            scaleFolder.add(obj.scale, 'x', Math.max(0.01, obj.scale.x - scaleStep), obj.scale.x + scaleStep, 0.01).onChange((val) => { obj.scale.set(val, val, val); });
        } else {
            scaleFolder.add(obj.scale, 'x', Math.max(0.01, obj.scale.x - scaleStep), obj.scale.x + scaleStep, 0.01);
            scaleFolder.add(obj.scale, 'y', Math.max(0.01, obj.scale.y - scaleStep), obj.scale.y + scaleStep, 0.01);
            scaleFolder.add(obj.scale, 'z', Math.max(0.01, obj.scale.z - scaleStep), obj.scale.z + scaleStep, 0.01);
        }
        scaleFolder.open();
    }

    private setMeshValue(child: any) {
        this.setValue(`mesh_${child.name}_posx`, (value: any) => { child.position.x = value; });
        this.setValue(`mesh_${child.name}_posy`, (value: any) => { child.position.y = value; });
        this.setValue(`mesh_${child.name}_posz`, (value: any) => { child.position.z = value; });
        this.setValue(`mesh_${child.name}_rotationx`, (value: any) => { child.rotation.x = value; });
        this.setValue(`mesh_${child.name}_rotationy`, (value: any) => { child.rotation.y = value; });
        this.setValue(`mesh_${child.name}_rotationz`, (value: any) => { child.rotation.z = value; });
        this.setValue(`mesh_${child.name}_scalex`, (value: any) => { child.scale.x = value; });
        this.setValue(`mesh_${child.name}_scaley`, (value: any) => { child.scale.y = value; });
        this.setValue(`mesh_${child.name}_scalez`, (value: any) => { child.scale.z = value; });
        this.setValue(`mesh_${child.name}_roughness`, (value: any) => { child.material.roughness = value; });
        this.setValue(`mesh_${child.name}_metalness`, (value: any) => { child.material.metalness = value; });
        this.setValue(`mesh_${child.name}_opacity`, (value: any) => { child.material.opacity = value; });
        this.setValue(`mesh_${child.name}_emissiveIntensity`, (value: any) => { child.material.emissiveIntensity = value; });
        this.setValue(`mesh_${child.name}_emissive`, (value: any) => { child.material.emissive = new Color(value); });
        this.setValue(`mesh_${child.name}_color`, (value: any) => { child.material.color = new Color(value); });
        this.setValue(`mesh_${child.name}_map`, (value: any) => { child.material.map = this.convertTexture(value); });
    }

    init(models: any[], meshs: Mesh[], configMap: Map<string, any>, updateSingle = false) {
        this.configMap = configMap;
        this.initMesh(meshs);
        this._models = models;
        this.modelMap.clear();
        models.forEach((val) => {
            this.modelMap.set(val.name, val);
            this.initModel(val);
        });
    }

    private convertTexture(value: string): Texture {
        var texture = new TextureLoader().load(value);
        texture.encoding = sRGBEncoding;
        return texture;
    }

    private chooeseMap() {
        if (this.material == null) return;
        this.chooeseImage((result: string) => {
            this.material.map = this.convertTexture(result);
        });
    }

    getExportParams(): MeshGuiExportParams {
        return {
            meshMap: meshMap,
            models: this._models,
        }
    }
    private meshParams = {
        format: 'json',
        color: '#ffffff',
        emissive: '#ffffff',
        map: () => {
            this.chooeseMap();
        },
    };
    private material: any;
    private clickMesh: any;
    parseMesh(mesh: any) {
        if (this.clickMesh == mesh) return;
        this.clickMesh = mesh;
        this.material = mesh.material;
        if (!this.guiEnable) return;
        if (meshGUI) {
            meshGUI.destroy();
        }
        meshGUI = new GUI();
        this.addGUIMoveFolder(meshGUI);
        const meshFolder = meshGUI.addFolder(`面片：${mesh.name}`)
        meshFolder.open();
        if (modelMeshNameList.indexOf(mesh.name) < 0) {
            this.initPosRotScaleGUI(meshFolder, mesh, false);
        }
        const meshParamsFolder = meshFolder.addFolder('面片参数');
        if (mesh.material.roughness) {
            meshParamsFolder.add(mesh.material, 'roughness', 0, 1, 0.1).name('粗糙度');
        }
        if (mesh.material.metalness) {
            meshParamsFolder.add(mesh.material, 'metalness', 0, 1, 0.1).name('金属度');
        }
        meshParamsFolder.add(mesh.material, 'opacity', 0, 1, 0.1).name('透明度');
        if (mesh.material.emissiveIntensity) {
            meshParamsFolder.add(mesh.material, 'emissiveIntensity', 0, 1, 0.1).name('自发光亮度');
        }
        if (mesh.material.emissive) {
            this.meshParams.emissive = '#' + mesh.material.emissive.getHexString();
            meshParamsFolder.addColor(this.meshParams, 'emissive').name('自发光颜色').onChange((val) => { mesh.material.emissive = new Color(val); });
        }
        this.meshParams.color = '#' + mesh.material.color.getHexString();
        meshParamsFolder.addColor(this.meshParams, 'color').name('颜色').onChange((val) => { mesh.material.color = new Color(val); });
        meshParamsFolder.add(this.meshParams, 'map').name('贴图');
        meshParamsFolder.open();
    }
}

function animateWaitFor(time: number, callback: any) {
    const clock = new Clock();
    const t1 = clock.getElapsedTime();
    let back = false;
  
    function loop() {
      if (clock.getElapsedTime() - t1 > time) {
        callback();
        back = true;
      }
      if (!back)
        requestAnimationFrame(loop);
    }
    loop();
  }