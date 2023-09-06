import { BokehPassParamters } from "three/examples/jsm/postprocessing/BokehPass";
import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer';
import { BloomPassParams, EffectGuiExportParams, EffectParams } from '../Entity';
import { BaseGui } from './BaseGui';
export declare class EffectGui extends BaseGui {
    private readonly effectParams;
    private passArray;
    private composer;
    private lutPass;
    private outputPass;
    private gui;
    lutParams: {
        intensity: number;
    };
    private lutMap;
    bokehPassParams: BokehPassParamters;
    bloomPassParams: BloomPassParams;
    private bokehPass;
    private bloomPass;
    constructor(effectParams: EffectParams, guiEnable?: boolean);
    removeAllEffect(): void;
    addPass(pass: Pass): void;
    insertPass(pass: Pass, index: number): void;
    private initGui;
    updateParams(configMap: Map<string, any>): void;
    initValues(configMap: Map<string, any>): void;
    getExportParams(): EffectGuiExportParams;
}
