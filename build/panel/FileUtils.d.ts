import { FileParams } from "./Entity";
export declare class FileUtils {
    static generateTSFile(params: FileParams): string;
    private static appendLight;
    private static appendModelPosition;
    private static appendModelRotation;
    private static appendModelScale;
    private static appendMeshPosition;
    private static appendMeshRotation;
    private static appendMeshScale;
    private static appendCameraConfig;
    static generateJSONFile(params: FileParams): string;
    private static getFormatKV;
    static downFile(fileName: string, data: string): void;
}
