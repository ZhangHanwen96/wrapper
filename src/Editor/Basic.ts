import { wrap } from "./utils";
import { MKClass } from "./constant";

const EMPTY_CONTENT_PROMPT = {
	button: "Click to add button",
	text: "Click to Edit",
	form: "Click to add field",
	default: "Click to Edit",
};

type TagName = "button" | "text" | "form";

export abstract class AbstractEditable extends EventTarget {
	static activeEditable: AbstractEditable | null;

	// private editing: boolean = false;
	private tagName: TagName;

	constructor(protected node: HTMLElement) {
		super();
		this.node = node;
		this.tagName = node.dataset.mkeditable as TagName;

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleStatusClick = this.handleStatusClick.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	static resetEditable() {
		// AbstractEditable.activeEditable?.setEditing(false);
		AbstractEditable.activeEditable = null;
	}

	public initialize() {
		this.attachEvents();
		this.prepareEditorDom();
	}

	protected prepareEditorDom() {
		// add mkeditable-wrapper and status
		const wrapper = document.createElement("div");
		wrapper.classList.add(MKClass.mkEditableWrapper);
		wrap(this.node, wrapper);

		const statusDiv = document.createElement("div");
		statusDiv.classList.add("status");
		statusDiv.innerHTML = EMPTY_CONTENT_PROMPT[this.tagName || "default"];
		wrapper.appendChild(statusDiv);

		// .status handle click only empty
		statusDiv.addEventListener("click", this.handleStatusClick);
	}

	protected setContentEditable() {
		this.node.setAttribute("contenteditable", "true");
		// this.node.setAttribute("suppresscontenteditablewarning", "true");
	}

	protected attachEvents() {
		this.node.addEventListener("mouseenter", this.handleMouseEnter);
		this.node.addEventListener("mouseleave", this.handleMouseLeave);
		this.node.addEventListener("click", this.handleClick);
		this.node.addEventListener("input", this.handleInput);
	}

	public destroy() {
		this.detachEvents();
		const statusEl = this.node.nextElementSibling;
		statusEl?.removeEventListener("click", this.handleStatusClick);
	}

	protected detachEvents() {
		this.node.removeEventListener("mouseenter", this.handleMouseEnter);
		this.node.removeEventListener("mouseleave", this.handleMouseLeave);
		this.node.removeEventListener("click", this.handleClick);
		this.node.removeEventListener("input", this.handleInput);
	}

	get isUnderEditing() {
		return AbstractEditable.activeEditable === this;
	}

	public getNode() {
		return this.node;
	}

	private setEditing(value: boolean) {
		// this.editing = value;

		if (value == false) {
			this.node.classList.remove("editingActive");
			return;
		}
		AbstractEditable.activeEditable = this;

		this.node.classList.remove("hoverActive");
		this.node.classList.add("editingActive");
	}

	selectContent() {
		window
			?.getSelection()
			?.setBaseAndExtent(
				this.node,
				0,
				this.node,
				this.node.childNodes.length
			);
	}

	protected handleClick(): boolean | void {
		if (AbstractEditable.activeEditable) {
			// this.editing
			if (AbstractEditable.activeEditable === this) return true;
			AbstractEditable.activeEditable.setEditing(false);
		}

		this.setEditing(true);
	}

	protected handleMouseEnter() {
		// const target = this.node;
		// only set when not current editing element or is self
		(!AbstractEditable.activeEditable ||
			AbstractEditable.activeEditable !== this) &&
			this.setIsHover(true);
	}

	protected handleMouseLeave() {
		// const target = this.node;
		// only set when not current editing element or is self
		(!AbstractEditable.activeEditable ||
			AbstractEditable.activeEditable !== this) &&
			this.setIsHover(false);
	}

	protected handleStatusClick() {
		const target = this.node;

		// only work when target el is empty
		if (target.classList.contains("isEmpty")) {
			this.handleClick();
			this.node.focus();
		}
	}

	protected handleInput(e: Event) {
		const target = this.node;

		const isEmpty =
			target.innerHTML === "" ||
			target.innerHTML.replace(/s/, "") === "<br>";

		if (isEmpty) {
			console.log("woops empty content");

			// when innerHtml is empty, will auto insert <br>
			if (target.innerHTML.replace(/s/, "") === "<br>") {
				target.innerHTML = "";
			}
			this.setIsEmpty(true);
		} else {
			this.setIsEmpty(false);
		}
	}

	private setIsHover(hover: boolean) {
		if (hover) {
			this.node.classList.add("hoverActive");
		} else {
			this.node.classList.remove("hoverActive");
		}
	}

	private setIsEmpty(empty: boolean) {
		if (empty) {
			this.node.classList.add("isEmpty");
		} else {
			this.node.classList.remove("isEmpty");
		}
	}
}

export const resetEditable = () => {
	AbstractEditable.resetEditable();
};

export const getActiveEditable = () => {
	return AbstractEditable.activeEditable;
};

export class BasicEditable extends AbstractEditable {
	constructor(node: HTMLElement) {
		super(node);
	}

	protected prepareEditorDom() {
		super.prepareEditorDom();
		this.setContentEditable();
	}

	handleClick() {
		super.handleClick();
		this.selectContent();
	}
}

export class FormEditable extends AbstractEditable {
	constructor(node: HTMLElement) {
		super(node);
	}

	protected prepareEditorDom() {
		super.prepareEditorDom();

		// readonly input el
		const inputEls = this.node.querySelectorAll("input");
		[...inputEls].forEach((el) => {
			el.setAttribute("readonly", "true");
		});
	}

	public dispatch(event: any) {
		switch (event.type) {
			case "add_new_field":
				break;
			default:
				return;
		}
	}
}
