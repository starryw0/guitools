import { GUI } from "dat.gui";
import { CameraHelper, PerspectiveCamera, TextureLoader } from "three";
import { BaseGui } from "./BaseGui";
var sceneGUI;
export class SceneGui extends BaseGui {
    constructor(scene, cameras, guiEnable = false) {
        super(guiEnable);
        this.cameras = cameras;
        this.cameraHelpers = [];
        this.params = {
            map: () => {
                this.chooeseMap();
            },
            save: () => {
                var _a;
                (_a = this.exportFun) === null || _a === void 0 ? void 0 : _a.call(this);
            },
            format: 'json',
            showHelper: false,
        };
        this.scene = scene;
    }
    getExportParams() {
        return {
            format: this.params.format,
            scene: this.scene,
            cameras: this.cameras,
        };
    }
    chooeseMap() {
        this.chooeseImage((result) => {
            const texture = new TextureLoader().load(result);
            this.scene.background = texture;
            this.scene.environment = texture;
        });
    }
    initGui() {
        if (!this.guiEnable)
            return;
        if (sceneGUI) {
            sceneGUI.destroy();
        }
        sceneGUI = new GUI();
        this.addGUIMoveFolder(sceneGUI);
        const sceneFolder = sceneGUI.addFolder('场景');
        sceneFolder.add(this.params, 'map').name('场景贴图');
        sceneFolder.open();
        this.cameras.forEach((camera) => {
            const cameraNameFolder = sceneGUI.addFolder(`相机：${camera.name}`);
            if (camera instanceof PerspectiveCamera) {
                cameraNameFolder.add(camera, 'fov', 30, 90, 1).onChange((val) => {
                    camera.fov = val;
                    camera.updateProjectionMatrix();
                });
            }
            const positionFolder = cameraNameFolder.addFolder('位置');
            const posStep = 2;
            const pos = camera.position;
            positionFolder.add(pos, 'x', pos.x - posStep, pos.x + posStep, 0.01).listen();
            positionFolder.add(pos, 'y', pos.y - posStep, pos.y + posStep, 0.01).listen();
            positionFolder.add(pos, 'z', pos.z - posStep, pos.z + posStep, 0.01).listen();
            positionFolder.open();
            const rotationFolder = cameraNameFolder.addFolder('旋转');
            const rotationStep = Math.PI * 2;
            const rotation = camera.rotation;
            rotationFolder.add(rotation, 'x', rotation.x - rotationStep, rotation.x + rotationStep, 0.01).listen();
            rotationFolder.add(rotation, 'y', rotation.y - rotationStep, rotation.y + rotationStep, 0.01).listen();
            rotationFolder.add(rotation, 'z', rotation.z - rotationStep, rotation.z + rotationStep, 0.01).listen();
            rotationFolder.open();
        });
        // sceneGUI.add(this.params, 'showHelper').name('辅助对象').onChange((val) => {
        //     if (val) this.addHelper(); else this.removeHelper();
        // });
        sceneGUI.add(this.params, 'format').options(['ts', 'json']).name('导出格式');
        sceneGUI.add(this.params, 'save').name('导出参数');
    }
    addHelper() {
        if (!this.guiEnable)
            return;
        this.cameras.forEach(camera => {
            const helper = new CameraHelper(camera);
            this.cameraHelpers.push(helper);
            this.scene.add(helper);
        });
    }
    removeHelper() {
        this.cameraHelpers.forEach(helper => {
            this.scene.remove(helper);
        });
        this.cameraHelpers = [];
    }
    updateParams(configMap) {
        this.initValues(configMap);
    }
    initValues(configMap) {
        this.configMap = configMap;
        this.setValue(`scene_envMap`, (value) => {
            const texture = new TextureLoader().load(value);
            this.scene.background = texture;
            this.scene.environment = texture;
        });
        this.cameras.forEach((camera) => {
            this.setValue(`camera_${camera.name}_posx`, (value) => { camera.position.x = value; });
            this.setValue(`camera_${camera.name}_posy`, (value) => { camera.position.y = value; });
            this.setValue(`camera_${camera.name}_posz`, (value) => { camera.position.z = value; });
            this.setValue(`camera_${camera.name}_rotationx`, (value) => { camera.rotation.x = value; });
            this.setValue(`camera_${camera.name}_rotationy`, (value) => { camera.rotation.y = value; });
            this.setValue(`camera_${camera.name}_rotationz`, (value) => { camera.rotation.z = value; });
            if (camera instanceof PerspectiveCamera) {
                this.setValue(`camera_${camera.name}_fov`, (value) => { camera.fov = value; camera.updateProjectionMatrix(); });
            }
        });
        this.initGui();
    }
}
