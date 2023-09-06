import { EffectParams, GuiParams, SceneParams } from "./Entity";
import { EffectGui } from "./gui/EffectGui";
export declare class GuiTools {
    private sceneConfigMap;
    private _sceneName;
    effectGui?: EffectGui;
    private lightGui;
    private sceneGui;
    private meshGui;
    private static instance;
    static getInstance(): GuiTools;
    private constructor();
    private getFileName;
    private export;
    parse(sceneParams: SceneParams, guiParams: GuiParams, effectParams?: EffectParams): void;
    private guiEvent;
    private initEvents;
    registerConfig(sceneName: string, config: any): void;
    enableGui: boolean;
}
