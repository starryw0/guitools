import { GUI } from 'dat.gui';
import { ReinhardToneMapping, Vector2 } from 'three';
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass';
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { BaseGui } from './BaseGui';
export class EffectGui extends BaseGui {
    constructor(effectParams, guiEnable = false) {
        super(guiEnable);
        this.effectParams = effectParams;
        this.passArray = [];
        this.lutParams = {
            intensity: 1,
        };
        this.lutMap = {
            'filter02Cube': null,
            'filter03Cube': null,
            'cyber': null,
            'normallut': null,
        };
        //景深参数
        this.bokehPassParams = {
            focus: 500,
            aspect: 0,
            aperture: 5,
            maxblur: 0.01,
            // width: window.innerWidth,
            // height: window.innerHeight
        };
        // 辉光参数
        this.bloomPassParams = {
            // 强度
            bloomStrength: 1,
            // 阈值
            bloomThreshold: 0,
            // 半径
            bloomRadius: 0,
            exposure: 1,
        };
        this.guiEnable = guiEnable;
        effectParams.renderer.toneMapping = ReinhardToneMapping;
        effectParams.renderer.clearColor();
        effectParams.renderer.setClearAlpha(1);
        //EffectComposer
        this.composer = effectParams.composer = new EffectComposer(effectParams.renderer);
        //RenderPass
        const renderPass = new RenderPass(effectParams.scene, effectParams.camera);
        this.composer.addPass(renderPass);
        //UnrealBloomPass
        if (effectParams.bloom) {
            this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
            this.bloomPass.threshold = this.bloomPassParams.bloomThreshold;
            this.bloomPass.strength = this.bloomPassParams.bloomStrength;
            this.bloomPass.radius = this.bloomPassParams.bloomRadius;
            this.composer.addPass(this.bloomPass);
            this.passArray.push(this.bloomPass);
        }
        //BokehPass
        if (effectParams.bokeh) {
            this.bokehPassParams.aspect = effectParams.camera.aspect;
            this.bokehPass = new BokehPass(effectParams.scene, effectParams.camera, this.bokehPassParams);
            this.bokehPass.uniforms['aperture'].value = this.bokehPassParams.aperture * 0.00001;
            this.composer.addPass(this.bokehPass);
            this.passArray.push(this.bokehPass);
        }
        //OutputPass
        this.outputPass = new OutputPass();
        this.passArray.push(this.outputPass);
        this.composer.addPass(this.outputPass);
        //LUTPass
        if (effectParams.lut && effectParams.lutTexutre) {
            this.lutPass = new LUTPass({ lut: effectParams.lutTexutre, intensity: this.lutParams.intensity });
            this.composer.addPass(this.lutPass);
            this.passArray.push(this.lutPass);
        }
    }
    removeAllEffect() {
        //this.outputPass = null;
        this.passArray.forEach((pass) => {
            this.composer.removePass(pass);
        });
    }
    addPass(pass) {
        this.passArray.push(pass);
        this.composer.addPass(pass);
        if (!this.outputPass) {
            this.outputPass = new OutputPass();
            this.passArray.push(this.outputPass);
            this.composer.addPass(this.outputPass);
        }
    }
    insertPass(pass, index) {
        this.passArray.push(pass);
        this.composer.insertPass(pass, index);
    }
    initGui() {
        if (!this.guiEnable)
            return;
        if (this.gui) {
            this.gui.destroy();
        }
        this.gui = new GUI();
        this.addGUIMoveFolder(this.gui);
        if (this.effectParams.bokeh) {
            const bokehFloder = this.gui.addFolder('景深');
            bokehFloder.add(this.bokehPassParams, "focus", 10, 3000, 10).name("焦距").onChange((val) => {
                this.bokehPass.uniforms['focus'].value = val;
            });
            bokehFloder.add(this.bokehPassParams, "aperture", 0, 10, 0.1).name("孔径").onChange((val) => {
                this.bokehPass.uniforms['aperture'].value = val * 0.00001;
            });
            bokehFloder.add(this.bokehPassParams, "maxblur", 0, 0.01, 0.001).name("最大模糊").onChange((val) => {
                this.bokehPass.uniforms['maxblur'].value = val;
            });
            bokehFloder.open();
        }
        if (this.effectParams.bloom) {
            const bloomFloder = this.gui.addFolder('辉光');
            bloomFloder.add(this.bloomPassParams, 'bloomThreshold', 0.0, 1.0).step(0.01).name('阈值').onChange((val) => {
                this.bloomPass.threshold = Number(val);
            });
            // 强度 在0-10之间可正常看到物体，超过10会因光线过强而看不见物体，步长建议0.01
            bloomFloder.add(this.bloomPassParams, 'bloomStrength', 0.0, 3.0).step(0.01).name('强度').onChange((val) => {
                this.bloomPass.strength = Number(val);
            });
            bloomFloder.add(this.bloomPassParams, 'bloomRadius', 0.0, 1.0).step(0.01).name('半径').onChange((val) => {
                this.bloomPass.radius = Number(val);
            });
            bloomFloder.open();
            bloomFloder.add(this.bloomPassParams, 'exposure', 0.1, 2).name('曝光').onChange((val) => {
                this.effectParams.renderer.toneMappingExposure = Math.pow(val, 4.0);
            });
        }
        if (this.effectParams.lut && this.effectParams.lutTexutre) {
            const lutFloder = this.gui.addFolder('lut');
            // lutFloder.add(this.lutParams, 'lutPath', Object.keys(this.lutMap)).name('lutName').onChange((value) => {
            //     this.lutPass.lut = this.effectParams.data.GetDataFromName(value)
            // });
            lutFloder.add(this.lutParams, 'intensity').name('强度').min(0).max(1).onChange((value) => {
                this.lutPass.intensity = value;
            });
            lutFloder.open();
        }
    }
    updateParams(configMap) {
        this.initValues(configMap);
    }
    initValues(configMap) {
        this.configMap = configMap;
        if (this.effectParams.bloom) {
            this.setValue(`bloomStrength`, (value) => { this.bloomPassParams.bloomStrength = value; this.bloomPass.strength = value; });
            this.setValue(`bloomThreshold`, (value) => { this.bloomPassParams.bloomThreshold = value; this.bloomPass.threshold = value; });
            this.setValue(`bloomRadius`, (value) => { this.bloomPassParams.bloomRadius = value; this.bloomPass.radius = value; });
            this.setValue(`exposure`, (value) => { this.bloomPassParams.exposure = value; this.effectParams.renderer.toneMappingExposure = Math.pow(value, 4.0); });
        }
        if (this.effectParams.bokeh) {
            this.setValue(`bokehFocus`, (value) => { this.bokehPassParams.focus = value; this.bokehPass.uniforms['focus'].value = value; });
            this.setValue(`bokehAperture`, (value) => { this.bokehPassParams.aperture = value; this.bokehPass.uniforms['aperture'].value = value * 0.00001; });
            this.setValue(`bokehMaxblur`, (value) => { this.bokehPassParams.maxblur = value; this.bokehPass.uniforms['maxblur'].value = value; });
        }
        if (this.effectParams.lut && this.effectParams.lutTexutre) {
            this.setValue(`lutIntensity`, (value) => { this.lutParams.intensity = value; this.lutPass.intensity = value; });
        }
        this.initGui();
    }
    getExportParams() {
        var params = {};
        if (this.effectParams.bloom) {
            params.bloomPassParams = this.bloomPassParams;
        }
        if (this.effectParams.bokeh) {
            params.bokehPassParams = this.bokehPassParams;
        }
        if (this.effectParams.lut) {
            params.lutIntensity = this.lutParams.intensity;
        }
        return params;
    }
}
