import { GUI } from "dat.gui";
import { Clock, Color, TextureLoader, sRGBEncoding } from "three";
import { MeshEntry } from "../Entity";
import { BaseGui } from "./BaseGui";
var modelGUI;
var meshGUI;
var meshMap = new Map();
var modelMeshNameList = new Array();
export class MeshGui extends BaseGui {
    constructor(guiEnable = false) {
        super(guiEnable);
        this.modelMap = new Map();
        this._meshes = [];
        this.meshParams = {
            format: 'json',
            color: '#ffffff',
            emissive: '#ffffff',
            map: () => {
                this.chooeseMap();
            },
        };
    }
    updateParams(configMap) {
        this.init(this._models, this._meshes, configMap);
    }
    initModelGui() {
        if (!this.guiEnable)
            return;
        if (modelGUI) {
            modelGUI.destroy();
        }
        modelGUI = new GUI();
        this.addGUIMoveFolder(modelGUI);
        const modelNameList = [];
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
            });
        });
        fun();
    }
    initModel(model) {
        this.setValue(`model_${model.name}_posx`, (value) => { model.position.x = value; });
        this.setValue(`model_${model.name}_posy`, (value) => { model.position.y = value; });
        this.setValue(`model_${model.name}_posz`, (value) => { model.position.z = value; });
        this.setValue(`model_${model.name}_rotationx`, (value) => { model.rotation.x = value; });
        this.setValue(`model_${model.name}_rotationy`, (value) => { model.rotation.y = value; });
        this.setValue(`model_${model.name}_rotationz`, (value) => { model.rotation.z = value; });
        this.setValue(`model_${model.name}_scale`, (value) => { model.scale.set(value, value, value); });
        model.traverse((child) => {
            if (!child.isMesh)
                return;
            child.material.transparent = true;
            this.setMeshValue(child);
            const entry = new MeshEntry(true, child);
            meshMap.set(child.name, entry);
            modelMeshNameList.push(child.name);
        });
        this.initModelGui();
    }
    initMesh(meshes) {
        if (meshes == null || meshes.length == 0)
            return;
        this._meshes = meshes;
        meshes.forEach(child => {
            child.material.transparent = true;
            this.setMeshValue(child);
            const entry = new MeshEntry(false, child);
            meshMap.set(child.name, entry);
        });
    }
    initPosRotScaleGUI(gui, obj, isModel = true) {
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
        }
        else {
            scaleFolder.add(obj.scale, 'x', Math.max(0.01, obj.scale.x - scaleStep), obj.scale.x + scaleStep, 0.01);
            scaleFolder.add(obj.scale, 'y', Math.max(0.01, obj.scale.y - scaleStep), obj.scale.y + scaleStep, 0.01);
            scaleFolder.add(obj.scale, 'z', Math.max(0.01, obj.scale.z - scaleStep), obj.scale.z + scaleStep, 0.01);
        }
        scaleFolder.open();
    }
    setMeshValue(child) {
        this.setValue(`mesh_${child.name}_posx`, (value) => { child.position.x = value; });
        this.setValue(`mesh_${child.name}_posy`, (value) => { child.position.y = value; });
        this.setValue(`mesh_${child.name}_posz`, (value) => { child.position.z = value; });
        this.setValue(`mesh_${child.name}_rotationx`, (value) => { child.rotation.x = value; });
        this.setValue(`mesh_${child.name}_rotationy`, (value) => { child.rotation.y = value; });
        this.setValue(`mesh_${child.name}_rotationz`, (value) => { child.rotation.z = value; });
        this.setValue(`mesh_${child.name}_scalex`, (value) => { child.scale.x = value; });
        this.setValue(`mesh_${child.name}_scaley`, (value) => { child.scale.y = value; });
        this.setValue(`mesh_${child.name}_scalez`, (value) => { child.scale.z = value; });
        this.setValue(`mesh_${child.name}_roughness`, (value) => { child.material.roughness = value; });
        this.setValue(`mesh_${child.name}_metalness`, (value) => { child.material.metalness = value; });
        this.setValue(`mesh_${child.name}_opacity`, (value) => { child.material.opacity = value; });
        this.setValue(`mesh_${child.name}_emissiveIntensity`, (value) => { child.material.emissiveIntensity = value; });
        this.setValue(`mesh_${child.name}_emissive`, (value) => { child.material.emissive = new Color(value); });
        this.setValue(`mesh_${child.name}_color`, (value) => { child.material.color = new Color(value); });
        this.setValue(`mesh_${child.name}_map`, (value) => { child.material.map = this.convertTexture(value); });
    }
    init(models, meshs, configMap, updateSingle = false) {
        this.configMap = configMap;
        this.initMesh(meshs);
        this._models = models;
        this.modelMap.clear();
        models.forEach((val) => {
            this.modelMap.set(val.name, val);
            this.initModel(val);
        });
    }
    convertTexture(value) {
        var texture = new TextureLoader().load(value);
        texture.encoding = sRGBEncoding;
        return texture;
    }
    chooeseMap() {
        if (this.material == null)
            return;
        this.chooeseImage((result) => {
            this.material.map = this.convertTexture(result);
        });
    }
    getExportParams() {
        return {
            meshMap: meshMap,
            models: this._models,
        };
    }
    parseMesh(mesh) {
        if (this.clickMesh == mesh)
            return;
        this.clickMesh = mesh;
        this.material = mesh.material;
        if (!this.guiEnable)
            return;
        if (meshGUI) {
            meshGUI.destroy();
        }
        meshGUI = new GUI();
        this.addGUIMoveFolder(meshGUI);
        const meshFolder = meshGUI.addFolder(`面片：${mesh.name}`);
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
function animateWaitFor(time, callback) {
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
