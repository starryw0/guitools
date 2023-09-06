import { AmbientLight, Color, PerspectiveCamera, PointLight } from "three";
export class FileUtils {
    static generateTSFile(params) {
        var data = `\n export class ${params.fileName} {\n  configMap: Map<string, any> = new Map();\n`;
        data += '\n  constructor()  { ';
        params.meshGuiExportParams.meshMap.forEach((value, key) => {
            var name = key;
            var mesh = value.mesh;
            data += `\n   //mesh ${name}`;
            if (mesh.material.roughness) {
                data += this.getFormatKV(`mesh_${name}_roughness`, mesh.material.roughness);
            }
            if (mesh.material.metalness) {
                data += this.getFormatKV(`mesh_${name}_metalness`, mesh.material.metalness);
            }
            data += this.getFormatKV(`mesh_${name}_opacity`, mesh.material.opacity);
            if (mesh.material.emissive) {
                if (typeof mesh.material.emissive == 'number') { //for such o.material.emissive = 0xff0000;
                    mesh.material.emissive = new Color(mesh.material.emissive);
                }
                data += this.getFormatKV(`mesh_${name}_emissive`, `\'#${mesh.material.emissive.getHexString()}\'`);
            }
            if (mesh.material.emissiveIntensity) {
                data += this.getFormatKV(`mesh_${name}_emissiveIntensity`, mesh.material.emissiveIntensity);
            }
            if (mesh.material.color) {
                data += this.getFormatKV(`mesh_${name}_color`, `\'#${mesh.material.color.getHexString()}\'`);
            }
            //  data += '\n';
            if (!value.isModelMesh) {
                data = FileUtils.appendMeshPosition(data, value.mesh);
                data = FileUtils.appendMeshRotation(data, value.mesh);
                data = FileUtils.appendMeshScale(data, value.mesh);
            }
        });
        if (params.meshGuiExportParams.models) {
            params.meshGuiExportParams.models.forEach((obj) => {
                data = FileUtils.appendModelPosition(data, obj);
                data = FileUtils.appendModelRotation(data, obj);
                data = FileUtils.appendModelScale(data, obj);
            });
        }
        if (params.sceneGuiExportParams.scene) {
            params.sceneGuiExportParams.cameras.forEach((camera) => {
                data = FileUtils.appendCameraConfig(data, camera);
            });
        }
        if (params.lightGuiExportParams.lights && params.lightGuiExportParams.lights.length > 0) {
            params.lightGuiExportParams.lights.forEach((light) => {
                data = FileUtils.appendLight(data, light);
            });
        }
        if (params.effectGuiExportParams) {
            var bloomPassParams = params.effectGuiExportParams.bloomPassParams;
            if (bloomPassParams) {
                data += `\n   // bloomPass `;
                data += this.getFormatKV(`bloomStrength`, bloomPassParams.bloomStrength);
                data += this.getFormatKV(`bloomThreshold`, bloomPassParams.bloomThreshold);
                data += this.getFormatKV(`bloomRadius`, bloomPassParams.bloomRadius);
                data += this.getFormatKV(`exposure`, bloomPassParams.exposure);
            }
            var bokehPassParams = params.effectGuiExportParams.bokehPassParams;
            if (bokehPassParams) {
                data += `\n   // bokehPass `;
                data += this.getFormatKV(`bokehFocus`, bokehPassParams.focus);
                data += this.getFormatKV(`bokehAperture`, bokehPassParams.aperture);
                data += this.getFormatKV(`bokehMaxblur`, bokehPassParams.maxblur);
            }
            if (params.effectGuiExportParams.lutIntensity) {
                data += `\n   // lutIntensity `;
                data += this.getFormatKV(`lutIntensity`, params.effectGuiExportParams.lutIntensity);
            }
        }
        data += '\n }';
        data += '\n}';
        return data;
    }
    static appendLight(data, light) {
        data += `\n   // ${light.name} `;
        data += this.getFormatKV(`${light.name}_color`, `\'#${light.color.getHexString()}\'`);
        data += this.getFormatKV(`${light.name}_intensity`, light.intensity);
        if (light instanceof PointLight) {
            data += this.getFormatKV(`${light.name}_decay`, light.decay);
        }
        if (!(light instanceof AmbientLight)) {
            data += this.getFormatKV(`${light.name}_receiveShadow`, light.receiveShadow);
            data += this.getFormatKV(`${light.name}_posx`, light.position.x);
            data += this.getFormatKV(`${light.name}_posy`, light.position.y);
            data += this.getFormatKV(`${light.name}_posz`, light.position.z);
        }
        return data;
    }
    static appendModelPosition(data, obj) {
        data += `\n   //${obj.name} position`;
        data += this.getFormatKV(`model_${obj.name}_posx`, obj.position.x);
        data += this.getFormatKV(`model_${obj.name}_posy`, obj.position.y);
        data += this.getFormatKV(`model_${obj.name}_posz`, obj.position.z);
        return data;
    }
    static appendModelRotation(data, obj) {
        data += `\n   //${obj.name} rotation`;
        data += this.getFormatKV(`model_${obj.name}_rotationx`, obj.rotation.x);
        data += this.getFormatKV(`model_${obj.name}_rotationy`, obj.rotation.y);
        data += this.getFormatKV(`model_${obj.name}_rotationz`, obj.rotation.z);
        return data;
    }
    static appendModelScale(data, obj) {
        data += `\n   //${obj.name} scale`;
        data += this.getFormatKV(`model_${obj.name}_scale`, obj.scale.x);
        return data;
    }
    static appendMeshPosition(data, mesh) {
        data += `\n   //${mesh.name} position`;
        data += this.getFormatKV(`mesh_${mesh.name}_posx`, mesh.position.x);
        data += this.getFormatKV(`mesh_${mesh.name}_posy`, mesh.position.y);
        data += this.getFormatKV(`mesh_${mesh.name}_posz`, mesh.position.z);
        return data;
    }
    static appendMeshRotation(data, mesh) {
        data += `\n   //${mesh.name} rotation`;
        data += this.getFormatKV(`mesh_${mesh.name}_rotationx`, mesh.rotation.x);
        data += this.getFormatKV(`mesh_${mesh.name}_rotationy`, mesh.rotation.y);
        data += this.getFormatKV(`mesh_${mesh.name}_rotationz`, mesh.rotation.z);
        return data;
    }
    static appendMeshScale(data, mesh) {
        data += `\n   //${mesh.name} rotation`;
        data += this.getFormatKV(`mesh_${mesh.name}_scalex`, mesh.scale.x);
        data += this.getFormatKV(`mesh_${mesh.name}_scaley`, mesh.scale.y);
        data += this.getFormatKV(`mesh_${mesh.name}_scalez`, mesh.scale.z);
        return data;
    }
    static appendCameraConfig(data, camera) {
        data += `\n   //camera ${camera.name} position`;
        data += this.getFormatKV(`camera_${camera.name}_posx`, camera.position.x);
        data += this.getFormatKV(`camera_${camera.name}_posy`, camera.position.y);
        data += this.getFormatKV(`camera_${camera.name}_posz`, camera.position.z);
        data += `\n   //camera ${camera.name} rotation`;
        data += this.getFormatKV(`camera_${camera.name}_rotationx`, camera.rotation.x);
        data += this.getFormatKV(`camera_${camera.name}_rotationy`, camera.rotation.y);
        data += this.getFormatKV(`camera_${camera.name}_rotationz`, camera.rotation.z);
        if (camera instanceof PerspectiveCamera) {
            data += `\n   //camera ${camera.name} fov`;
            data += this.getFormatKV(`camera_${camera.name}_fov`, camera.fov);
        }
        return data;
    }
    static generateJSONFile(params) {
        var configMap = new Map();
        params.meshGuiExportParams.meshMap.forEach((value, key) => {
            var name = key;
            var mesh = value.mesh;
            if (mesh.material.roughness) {
                configMap.set(`mesh_${name}_roughness`, mesh.material.roughness);
            }
            if (mesh.material.metalness) {
                configMap.set(`mesh_${name}_metalness`, mesh.material.metalness);
            }
            configMap.set(`mesh_${name}_opacity`, mesh.material.opacity);
            if (mesh.material.emissive) {
                if (typeof mesh.material.emissive == 'number') { //for such o.material.emissive = 0xff0000;
                    mesh.material.emissive = new Color(mesh.material.emissive);
                }
                configMap.set(`mesh_${name}_emissive`, '#' + mesh.material.emissive.getHexString());
            }
            if (mesh.material.emissiveIntensity) {
                configMap.set(`mesh_${name}_emissiveIntensity`, mesh.material.emissiveIntensity);
            }
            if (mesh.material.map) {
                const tex = mesh.material.map;
                const source = tex.source;
                if (source.data.currentSrc) {
                    configMap.set(`mesh_${name}_map`, source.data.currentSrc);
                }
            }
            if (mesh.material.color) {
                configMap.set(`mesh_${name}_color`, '#' + mesh.material.color.getHexString());
            }
            if (!value.isModelMesh) {
                configMap.set(`mesh_${mesh.name}_posx`, value.mesh.position.x);
                configMap.set(`mesh_${mesh.name}_posy`, value.mesh.position.y);
                configMap.set(`mesh_${mesh.name}_posz`, value.mesh.position.z);
                configMap.set(`mesh_${mesh.name}_rotationx`, value.mesh.rotation.x);
                configMap.set(`mesh_${mesh.name}_rotationy`, value.mesh.rotation.y);
                configMap.set(`mesh_${mesh.name}_rotationz`, value.mesh.rotation.z);
                configMap.set(`mesh_${mesh.name}_scalex`, value.mesh.scale.x);
                configMap.set(`mesh_${mesh.name}_scaley`, value.mesh.scale.y);
                configMap.set(`mesh_${mesh.name}_scalez`, value.mesh.scale.z);
            }
        });
        if (params.meshGuiExportParams.models) {
            params.meshGuiExportParams.models.forEach((obj) => {
                configMap.set(`model_${obj.name}_posx`, obj.position.x);
                configMap.set(`model_${obj.name}_posy`, obj.position.y);
                configMap.set(`model_${obj.name}_posz`, obj.position.z);
                configMap.set(`model_${obj.name}_rotationx`, obj.rotation.x);
                configMap.set(`model_${obj.name}_rotationy`, obj.rotation.y);
                configMap.set(`model_${obj.name}_rotationz`, obj.rotation.z);
                configMap.set(`model_${obj.name}_scale`, obj.scale.x);
            });
        }
        if (params.lightGuiExportParams.lights && params.lightGuiExportParams.lights.length > 0) {
            params.lightGuiExportParams.lights.forEach((light) => {
                configMap.set(`${light.name}_color`, '#' + light.color.getHexString());
                configMap.set(`${light.name}_intensity`, light.intensity);
                if (light instanceof PointLight) {
                    configMap.set(`${light.name}_decay`, light.decay);
                }
                if (!(light instanceof AmbientLight)) {
                    configMap.set(`${light.name}_receiveShadow`, light.receiveShadow);
                    configMap.set(`${light.name}_posx`, light.position.x);
                    configMap.set(`${light.name}_posy`, light.position.y);
                    configMap.set(`${light.name}_posz`, light.position.z);
                }
            });
        }
        const cameras = params.sceneGuiExportParams.cameras;
        if (cameras) {
            cameras.forEach((camera) => {
                configMap.set(`camera_${camera.name}_posx`, camera.position.x);
                configMap.set(`camera_${camera.name}_posy`, camera.position.y);
                configMap.set(`camera_${camera.name}_posz`, camera.position.z);
                configMap.set(`camera_${camera.name}_rotationx`, camera.rotation.x);
                configMap.set(`camera_${camera.name}_rotationy`, camera.rotation.y);
                configMap.set(`camera_${camera.name}_rotationz`, camera.rotation.z);
                if (camera instanceof PerspectiveCamera) {
                    configMap.set(`camera_${camera.name}_fov`, camera.fov);
                }
            });
        }
        const scene = params.sceneGuiExportParams.scene;
        if (scene && scene.environment) {
            const tex = scene.environment;
            const source = tex.source;
            if (source.data.currentSrc) {
                configMap.set(`scene_envMap`, source.data.currentSrc);
            }
        }
        if (params.effectGuiExportParams) {
            var bloomPassParams = params.effectGuiExportParams.bloomPassParams;
            if (bloomPassParams) {
                configMap.set('bloomStrength', bloomPassParams.bloomStrength);
                configMap.set('bloomThreshold', bloomPassParams.bloomThreshold);
                configMap.set('bloomRadius', bloomPassParams.bloomRadius);
                configMap.set('exposure', bloomPassParams.exposure);
            }
            var bokehPassParams = params.effectGuiExportParams.bokehPassParams;
            if (bokehPassParams) {
                configMap.set('bokehFocus', bokehPassParams.focus);
                configMap.set('bokehAperture', bokehPassParams.aperture);
                configMap.set('bokehMaxblur', bokehPassParams.maxblur);
            }
            if (params.effectGuiExportParams.lutIntensity) {
                configMap.set('lutIntensity', params.effectGuiExportParams.lutIntensity);
            }
        }
        const json = JSON.stringify(Object.fromEntries(configMap));
        return json;
    }
    static getFormatKV(key, value) {
        return `\n   this.configMap.set(\'${key}\', ${value});`;
    }
    static downFile(fileName, data) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var link = document.createElement("a");
        link.href = urlObject.createObjectURL(export_blob);
        link.download = fileName;
        link.click();
    }
}
