import { Raycaster, Vector2 } from "three";
function isMobile() {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    return flag != null;
}
export class GuiEvent {
    constructor(guiEventParams) {
        this.guiEventParams = guiEventParams;
        this.touch = new Vector2();
        this.pointer = new Vector2();
        this.raycaster = new Raycaster();
        this.clickEvent = false;
        this.container = guiEventParams.containter;
    }
    TouchStart(event) {
        console.log('TouchStart');
        this.clickEvent = false;
        if (isMobile())
            this.touch.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        else
            this.touch.set(event.clientX, event.clientY);
        this.pointer.x = (this.touch.x / this.container.clientWidth) * 2 - 1;
        this.pointer.y = -(this.touch.y / this.container.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.guiEventParams.camera);
        this.intersects = this.raycaster.intersectObjects(this.guiEventParams.scene.children);
        if (this.intersects.length > 0) {
            this.clickEvent = true;
            return;
        }
    }
    TouchMove(event) {
        this.clickEvent = false;
    }
    TouchEnd(event = null) {
        var _a, _b;
        if (this.clickEvent) {
            var obj = (_a = this.intersects[0]) === null || _a === void 0 ? void 0 : _a.object;
            if (obj.isMesh) {
                (_b = this.clickFun) === null || _b === void 0 ? void 0 : _b.call(this, obj);
            }
        }
    }
    Drop(event) {
        event.preventDefault();
        if (!event.dataTransfer)
            return;
        var file = event.dataTransfer.files[0];
        if (!file || !file.name)
            return;
        if (!file.name.endsWith('.json'))
            return;
        var reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            if (!event.target)
                return;
            var jsonMap = new Map(Object.entries(JSON.parse(event.target.result)));
            if (jsonMap && jsonMap.size > 0) {
                (_a = this.dropFun) === null || _a === void 0 ? void 0 : _a.call(this, jsonMap);
            }
        };
        reader.readAsText(file);
    }
    Dragover(event) {
        event.preventDefault();
    }
    registerListeners() {
        this._dragover = this.Dragover.bind(this);
        this._drop = this.Drop.bind(this);
        document.addEventListener('dragover', this._dragover, false);
        document.addEventListener('drop', this._drop, false);
        ClickEvent.getInstance(this.container).registerListeners((event) => { this.TouchStart(event); }, (event) => { this.TouchMove(event); }, (event) => { this.TouchEnd(event); });
    }
    removeListeners() {
        if (this._dragover)
            document.removeEventListener('dragover', this._dragover);
        if (this._drop)
            document.removeEventListener('drop', this._drop);
        ClickEvent.getInstance(this.container).removeListeners();
    }
}
class ClickEvent {
    static getInstance(container) {
        if (!ClickEvent.instance)
            this.instance = new ClickEvent(container);
        return ClickEvent.instance;
    }
    constructor(container) {
        this.mobile = false;
        this.container = container;
        this.mobile = isMobile();
    }
    registerListeners(MouseDown, MouseMove, MouseUp) {
        if (!this.mobile) {
            this._mouseDown = MouseDown.bind(this);
            this._mouseMove = MouseMove.bind(this);
            this._mouseUp = MouseUp.bind(this);
            this.container.addEventListener('mousedown', this._mouseDown);
            this.container.addEventListener('mousemove', this._mouseMove);
            this.container.addEventListener('mouseup', this._mouseUp);
        }
        else {
            this._touchStart = MouseDown.bind(this);
            this._touchMove = MouseMove.bind(this);
            this._touchEnd = MouseUp.bind(this);
            this.container.addEventListener('touchstart', this._touchStart);
            this.container.addEventListener('touchmove', this._touchMove);
            this.container.addEventListener('touchend', this._touchEnd);
        }
    }
    removeListeners() {
        if (!this.mobile) {
            if (this._mouseDown)
                this.container.removeEventListener('mousedown', this._mouseDown);
            if (this._mouseMove)
                this.container.removeEventListener('mousemove', this._mouseMove);
            if (this._mouseUp)
                this.container.removeEventListener('mouseup', this._mouseUp);
        }
        else {
            if (this._touchStart)
                this.container.removeEventListener('touchstart', this._touchStart);
            if (this._touchMove)
                if (this._mouseDown)
                    this.container.removeEventListener('touchmove', this._touchMove);
            if (this._touchEnd)
                this.container.removeEventListener('touchend', this._touchEnd);
        }
    }
}
