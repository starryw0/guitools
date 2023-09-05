import { GUI } from "dat.gui";
import { Camera, CameraHelper, Object3D, PerspectiveCamera, Scene, TextureLoader } from "three";
import { SceneGuiExportParams } from "../Entity";
import { BaseGui } from "./BaseGui";

var sceneGUI: GUI;
export class SceneGui extends BaseGui {
	private scene: Scene;
	private cameraHelpers: Object3D[] = [];
	exportFun?: Function;

	constructor(scene: Scene, readonly cameras: Camera[], guiEnable = false) {
		super(guiEnable);
		this.scene = scene;
	}

	getExportParams(): SceneGuiExportParams {
		return {
			format: this.params.format,
			scene: this.scene,
			cameras: this.cameras,
		};
	}

	private params = {
		map: () => {
			this.chooeseMap();
		},
		save: () => {
			this.exportFun?.();
		},
		format: 'json',
		showHelper: false,
	}
	private chooeseMap() {
		this.chooeseImage((result: string) => {
			const texture = new TextureLoader().load(result);
			this.scene.background = texture;
			this.scene.environment = texture;
		});
	}
	private initGui() {
		if (!this.guiEnable) return;
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
		})
		// sceneGUI.add(this.params, 'showHelper').name('辅助对象').onChange((val) => {
		//     if (val) this.addHelper(); else this.removeHelper();
		// });
		sceneGUI.add(this.params, 'format').options(['ts', 'json']).name('导出格式');
		sceneGUI.add(this.params, 'save').name('导出参数');
	}

	private addHelper() {
		if (!this.guiEnable) return;
		this.cameras.forEach(camera => {
			const helper = new CameraHelper(camera);
			this.cameraHelpers.push(helper);
			this.scene.add(helper);
		});
	}

	private removeHelper() {
		this.cameraHelpers.forEach(helper => {
			this.scene.remove(helper);
		});
		this.cameraHelpers = [];
	}


	updateParams(configMap: Map<string, any>) {
		this.initValues(configMap);
	}

	initValues(configMap: Map<string, any>) {
		this.configMap = configMap;
		this.setValue(`scene_envMap`, (value: any) => {
			const texture = new TextureLoader().load(value as string);
			this.scene.background = texture;
			this.scene.environment = texture;
		});
		this.cameras.forEach((camera) => {
			this.setValue(`camera_${camera.name}_posx`, (value: any) => { camera.position.x = value; });
			this.setValue(`camera_${camera.name}_posy`, (value: any) => { camera.position.y = value; });
			this.setValue(`camera_${camera.name}_posz`, (value: any) => { camera.position.z = value; });
			this.setValue(`camera_${camera.name}_rotationx`, (value: any) => { camera.rotation.x = value; });
			this.setValue(`camera_${camera.name}_rotationy`, (value: any) => { camera.rotation.y = value; });
			this.setValue(`camera_${camera.name}_rotationz`, (value: any) => { camera.rotation.z = value; });
			if (camera instanceof PerspectiveCamera) {
				this.setValue(`camera_${camera.name}_fov`, (value: any) => { camera.fov = value; camera.updateProjectionMatrix(); });
			}
		});

		this.initGui();
	}
}
