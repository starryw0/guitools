import interact from 'interactjs';
export class BaseGui {
    constructor(guiEnable) {
        this.guiEnable = false;
        this.moveParams = {
            x: 0,
            y: 0,
        };
        this.guiEnable = guiEnable;
    }
    setValue(key, cb) {
        if (this.configMap.get(key)) {
            cb(this.configMap.get(key));
        }
    }
    chooeseImage(result) {
        var element = document.getElementById("input_choose_image");
        if (element != null) {
            this.input = element;
        }
        else {
            this.input = document.createElement("input");
            this.input.type = "file";
            this.input.accept = "image/png, image/jpeg,image/jpg";
            this.input.style.display = 'none';
            this.input.id = "input_choose_image";
            document.body.appendChild(this.input);
        }
        this.input.onchange = (ev) => {
            var fileReader = new FileReader();
            var file = this.input.files ? this.input.files[0] : null;
            if (!file)
                return;
            fileReader.readAsDataURL(file);
            fileReader.onload = (progressEvent) => {
                result === null || result === void 0 ? void 0 : result.call(this, fileReader.result);
                this.input.remove();
            };
        },
            this.input.click();
    }
    addGUIMoveFolder(gui) {
        const moveFolder = gui.addFolder('拖动');
        const position = { x: 0, y: 0 };
        interact(moveFolder.domElement).draggable({
            inertia: false,
        }).on("dragmove", (event) => {
            position.x += event.dx;
            position.y += event.dy;
            gui.domElement.style.transform =
                `translate(${position.x}px, ${position.y}px)`;
        });
    }
}
