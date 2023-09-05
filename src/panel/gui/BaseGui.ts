import { GUI } from "dat.gui";
import interact from 'interactjs';

export abstract class BaseGui {
    protected guiEnable: boolean = false;
    protected configMap: Map<string, any>;

    constructor(guiEnable: boolean) {
        this.guiEnable = guiEnable;
    }

    protected setValue(key: string, cb: Function) {
        if (this.configMap.get(key)) {
            cb(this.configMap.get(key));
        }
    }

    abstract updateParams(configMap: Map<string, any>): void

    abstract getExportParams(): any

    private input: HTMLInputElement;
    protected chooeseImage(result?: Function) {
        var element = document.getElementById("input_choose_image");
        if (element != null) {
            this.input = element as HTMLInputElement;
        } else {
            this.input = document.createElement("input");
            this.input.type = "file";
            this.input.accept = "image/png, image/jpeg,image/jpg";
            this.input.style.display = 'none';
            this.input.id = "input_choose_image";
            document.body.appendChild(this.input);
        }
        this.input.onchange = (ev: Event) => {
            var fileReader = new FileReader();
            var file = this.input.files ? this.input.files[0] : null;
            if (!file) return;
            fileReader.readAsDataURL(file);
            fileReader.onload = (progressEvent: ProgressEvent) => {
                result?.call(this, fileReader.result as string)
                this.input.remove();
            };
        },
            this.input.click();
    }

    moveParams = {
        x: 0,
        y: 0,
    }
    protected addGUIMoveFolder(gui: GUI) {
        const moveFolder = gui.addFolder('拖动');
        const position = { x: 0, y: 0 }
        interact(moveFolder.domElement).draggable({
            inertia: false,
        }).on("dragmove", (event) => {
            position.x += event.dx
            position.y += event.dy
            gui.domElement.style.transform =
                `translate(${position.x}px, ${position.y}px)`
        });
    }
}
