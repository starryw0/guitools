import { GUI } from "dat.gui";
import { AmbientLight, Color, DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, Light, Object3D, PointLight, PointLightHelper, Scene, SpotLight, SpotLightHelper } from "three";
import { LightGuiExportParams } from "../Entity";
import { BaseGui } from "./BaseGui";

interface LightParams {
	showHelper: boolean,
	color: string,
	sphereSize: number,
	[key: string]: any,
}
var lightGUI: GUI;
export class LightGui extends BaseGui {

	constructor(private readonly scene: Scene, guiEnable = false) {
		super(guiEnable);
	}

	private lightParams: LightParams = {
		showHelper: false,
		color: '#cccccc',
		sphereSize: 0.3,
	}
	private _lights: Light[];
	initValues(configMap: Map<string, any>, light: Light[], init = true) {
		if (light == null || light.length == 0) return;
		this.configMap = configMap;
		this._lights = light;
		this._lights.forEach(light => {
			this.setValue(`${light.name}_color`, (value: any) => { light.color = new Color(value); });
			this.setValue(`${light.name}_intensity`, (value: any) => { light.intensity = value; });
			if (light instanceof PointLight) {
				this.setValue(`${light.name}_decay`, (value: any) => { light.decay = value; });
			}
			if (!(light instanceof AmbientLight)) {
				this.setValue(`${light.name}_posx`, (value: any) => { light.position.x = value; });
				this.setValue(`${light.name}_posy`, (value: any) => { light.position.y = value; });
				this.setValue(`${light.name}_posz`, (value: any) => { light.position.z = value; });
				this.setValue(`${light.name}_castShadow`, (value: any) => { light.castShadow = value; });
			}
		});
		if (init) {
			this.initGui();
		}
	}

	private lightHelpers: Object3D[] = [];
	private initGui() {
		if (!this.guiEnable) return;
		if (lightGUI) {
			lightGUI.destroy();
		}
		lightGUI = new GUI();
		this.addGUIMoveFolder(lightGUI);

		this.removeHelper();
		this._lights.forEach(light => {
			this.lightParams[`${light.name}_color`] = `#${light.color.getHexString()}`;
			const nameFolder = lightGUI.addFolder(`灯光：${light.name}`);
			nameFolder.addColor(this.lightParams, `${light.name}_color`).name('颜色').onChange((val) => {
				light.color = new Color(val);
			});
			nameFolder.add(light, 'intensity', 0, 5).step(0.1).name('强度');
			if (light instanceof PointLight) {
				nameFolder.add(light, 'decay', 0, 10).name('衰减').step(0.1);
			}
			if (!(light instanceof AmbientLight)) {
				const positionFolder = nameFolder.addFolder('位置');
				const posStep = 3;
				positionFolder.add(light.position, 'x', light.position.x - posStep, light.position.x + posStep, 0.01);
				positionFolder.add(light.position, 'y', light.position.y - posStep, light.position.y + posStep, 0.01);
				positionFolder.add(light.position, 'z', light.position.z - posStep, light.position.z + posStep, 0.01);
				nameFolder.add(light, 'castShadow').name('阴影').onChange((val) => { light.castShadow = val; });
			}
			nameFolder.open();
		});
		lightGUI.add(this.lightParams, 'showHelper').name('辅助对象').onChange((val) => {
			if (val) this.addHelper(); else this.removeHelper();
		});
		lightGUI.addColor(this.lightParams, 'color').name('辅助对象颜色');
		lightGUI.add(this.lightParams, 'sphereSize').name('辅助对象尺寸').min(0.1).max(1);
	}

	private addHelper() {
		if (!this.guiEnable) return;
		this._lights.forEach(light => {
			if (light instanceof PointLight) {
				const helper = new PointLightHelper(light, this.lightParams.sphereSize, this.lightParams.color);
				this.lightHelpers.push(helper);
				this.scene.add(helper);
			}
			if (light instanceof DirectionalLight) {
				const helper = new DirectionalLightHelper(light, this.lightParams.sphereSize, this.lightParams.color);
				this.lightHelpers.push(helper);
				this.scene.add(helper);
			}
			if (light instanceof SpotLight) {
				const helper = new SpotLightHelper(light, this.lightParams.color);
				this.lightHelpers.push(helper);
				this.scene.add(helper);
			}
			if (light instanceof HemisphereLight) {
				const helper = new HemisphereLightHelper(light, this.lightParams.sphereSize, this.lightParams.color);
				this.lightHelpers.push(helper);
				this.scene.add(helper);
			}
		});
	}

	private removeHelper() {
		this.lightHelpers.forEach(helper => {
			this.scene.remove(helper);
		});
		this.lightHelpers = [];
	}

	getExportParams(): LightGuiExportParams {
		return {
			lights: this._lights,
		};
	}

	updateParams(configMap: Map<string, any>) {
		this.initValues(configMap, this._lights);
	}
}
