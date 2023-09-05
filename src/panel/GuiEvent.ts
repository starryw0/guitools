import { Raycaster, Vector2 } from "three";
import { GuiEventParams } from "./Entity";

function isMobile(): boolean {
	let flag = navigator.userAgent.match(
		/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
	);
	return flag != null;
}
export class GuiEvent {
	private container: HTMLElement;
	private _dragover: any;
	private _drop: any;

	clickFun?: Function;
	dropFun?: Function;

	constructor(private readonly guiEventParams: GuiEventParams) {
		this.container = guiEventParams.containter;
	}

	private touch: Vector2 = new Vector2();
	private pointer: Vector2 = new Vector2();
	private raycaster = new Raycaster();
	private clickEvent: boolean = false;
	private intersects: any;

	private TouchStart(event: any) {
		console.log('TouchStart');
		this.clickEvent = false;
		if (isMobile())
			this.touch.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		else
			this.touch.set(event.clientX, event.clientY);

		this.pointer.x = (this.touch.x / this.container.clientWidth) * 2 - 1;
		this.pointer.y = - (this.touch.y / this.container.clientHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.pointer, this.guiEventParams.camera);
		this.intersects = this.raycaster.intersectObjects(this.guiEventParams.scene.children);
		if (this.intersects.length > 0) {
			this.clickEvent = true;
			return;
		}
	}

	private TouchMove(event: any) {
		this.clickEvent = false;
	}

	private TouchEnd(event: any = null) {
		if (this.clickEvent) {
			var obj = this.intersects[0]?.object;
			if (obj.isMesh) {
				this.clickFun?.call(this, obj);
			}
		}
	}

	private Drop(event: DragEvent) {
		event.preventDefault();
		if (!event.dataTransfer) return;
		var file = event.dataTransfer.files[0];
		if (!file || !file.name) return;
		if (!file.name.endsWith('.json')) return;
		var reader = new FileReader();
		reader.onload = (event) => {
			if (!event.target) return;
			var jsonMap: Map<string, any> = new Map(Object.entries(JSON.parse(event.target.result as string)));
			if (jsonMap && jsonMap.size > 0) {
				this.dropFun?.call(this, jsonMap);
			}
		};
		reader.readAsText(file);
	}

	private Dragover(event: DragEvent) {
		event.preventDefault();
	}

	registerListeners() {
		this._dragover = this.Dragover.bind(this);
		this._drop = this.Drop.bind(this);
		document.addEventListener('dragover', this._dragover, false);
		document.addEventListener('drop', this._drop, false);
		ClickEvent.getInstance(this.container).registerListeners(
			(event: any) => { this.TouchStart(event); },
			(event: any) => { this.TouchMove(event); },
			(event: any) => { this.TouchEnd(event); },
		);
	}

	removeListeners() {
		if (this._dragover) document.removeEventListener('dragover', this._dragover);
		if (this._drop) document.removeEventListener('drop', this._drop);
		ClickEvent.getInstance(this.container).removeListeners();
	}
}

class ClickEvent {
	private static instance: ClickEvent;
	public static getInstance(container: HTMLElement): ClickEvent {
		if (!ClickEvent.instance)
			this.instance = new ClickEvent(container);
		return ClickEvent.instance;
	}
	private container: HTMLElement
	mobile: boolean = false;

	constructor(container: HTMLElement) {
		this.container = container;
		this.mobile = isMobile();
	}

	private _mouseDown: any;
	private _mouseMove: any;
	private _mouseUp: any;
	private _touchStart: any;
	private _touchMove: any;
	private _touchEnd: any;

	registerListeners(MouseDown: Function, MouseMove: Function, MouseUp: Function) {
		if (!this.mobile) {
			this._mouseDown = MouseDown.bind(this);
			this._mouseMove = MouseMove.bind(this);
			this._mouseUp = MouseUp.bind(this);
			this.container.addEventListener('mousedown', this._mouseDown);
			this.container.addEventListener('mousemove', this._mouseMove);
			this.container.addEventListener('mouseup', this._mouseUp);
		} else {
			this._touchStart = MouseDown.bind(this);
			this._touchMove = MouseMove.bind(this);
			this._touchEnd = MouseUp.bind(this);
			this.container.addEventListener('touchstart', this._touchStart)
			this.container.addEventListener('touchmove', this._touchMove)
			this.container.addEventListener('touchend', this._touchEnd)
		}
	}

	removeListeners() {
		if (!this.mobile) {
			if (this._mouseDown) this.container.removeEventListener('mousedown', this._mouseDown);
			if (this._mouseMove) this.container.removeEventListener('mousemove', this._mouseMove);
			if (this._mouseUp) this.container.removeEventListener('mouseup', this._mouseUp);
		} else {
			if (this._touchStart) this.container.removeEventListener('touchstart', this._touchStart);
			if (this._touchMove) if (this._mouseDown) this.container.removeEventListener('touchmove', this._touchMove);
			if (this._touchEnd) this.container.removeEventListener('touchend', this._touchEnd);
		}
	}
}
