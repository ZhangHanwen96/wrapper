import { wrap, unwrap } from "./utils";
import { MKClass } from "./constant";

const EMPTY_CONTENT_PROMPT = {
	button: "Click to add button",
	text: "Click to Edit",
	form: "Click to add field",
	default: "Click to Edit",
};

enum TagName {
	button = "button",
	text = "text",
	form = "form",
}

enum EmptyAction {
	remain = "remain",
	collapse = "collapse",
}

enum PositionType {
	fixed = "fixed",
}

export const eventEmitter = new EventTarget();

// TODO fix sticky tab positioning
export abstract class AbstractEditable {
	/** HTMLElement which the Editable manipulates */
	protected node: HTMLElement;

	/** Editable current being edited */
	static activeEditable: AbstractEditable | null;

	/** Instance of EventTarget for listening to and dispatching events */
	protected _eventEmitter: EventTarget = eventEmitter;

	/** Whether innerHTML is empty */
	protected isEmpty: boolean = false;

	/** Enum TagName */
	protected tagName: TagName;

	/** Enum PositionType, currently used specificly for sticky-tab */
	protected positionType: PositionType | null;

	/** Action to take when innerHTML is empty. 'collapse' as default */
	protected emptyAction: EmptyAction;

	constructor(node: HTMLElement) {
		this.node = node;

		this.tagName = (node.dataset.mkeditable as TagName) || TagName.text;
		this.positionType = node.getAttribute(
			"mkeditable-position"
		) as PositionType;
		this.emptyAction =
			(node.getAttribute("mkeditable-emptyaction") as EmptyAction) ||
			EmptyAction.collapse;

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleStatusClick = this.handleStatusClick.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	static resetEditable() {
		this.activeEditable = null;
	}

	static get eventEmitter() {
		return eventEmitter;
	}

	resetClass() {
		const classes = ["editingActive", "hoverActive"];
		classes.forEach((cls) => this.node.classList.remove(cls));

		if (this.emptyAction === "remain" && this.isEmpty) {
			this.node.classList.add("hoverActive");
		}
	}

	public initialize() {
		this.attachEvents();
		this.prepareEditorDom();
		this.checkEmptyHTML();
	}

	/**
	 * Wrap [data-mkeditable] with div.mkeditable-wrapper
	 * Insert child status el after [data-mkeditable]
	 * Adjust badge position
	 */
	protected prepareEditorDom() {
		this.wrap();
		// this.adjustBadgePosition()
	}

	public adjustBadgePosition(container: HTMLElement) {
		// TODO adjust badge position according to its position
		if (this.positionType) {
			const rect = this.node.getBoundingClientRect();
			if (
				rect.bottom === container.clientHeight ||
				rect.right === container.clientWidth
			) {
				return;
			}
			this.node.classList.add("badge-bottom");
		}
	}

	public wrap() {
		if (
			this.node.parentElement?.classList.contains(
				MKClass.mkEditableWrapper
			)
		)
			return;

		// add mkeditable-wrapper and status
		const wrapper = document.createElement("div");
		wrapper.classList.add(MKClass.mkEditableWrapper);
		wrap(this.node, wrapper);

		const statusDiv = document.createElement("div");
		statusDiv.classList.add("status");
		statusDiv.innerHTML = EMPTY_CONTENT_PROMPT[this.tagName || "default"];
		wrapper.appendChild(statusDiv);

		// '.status' handle click when isEmpty, expend its paired Editable
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

		this.unwrap();
	}

	public unwrap() {
		const wrapper = this.node.parentElement;
		if (
			!wrapper ||
			!wrapper.classList.contains(MKClass.mkEditableWrapper)
		) {
			return;
		}

		const lastEl = wrapper.lastElementChild;
		lastEl && wrapper.removeChild(lastEl);
		unwrap(wrapper);
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
			if (this.emptyAction === "remain" && this.isEmpty) {
				this.node.classList.add("hoverActive");
			}
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
			if (AbstractEditable.activeEditable === this) return true;
			AbstractEditable.activeEditable.setEditing(false);
		}

		eventEmitter.dispatchEvent(
			new CustomEvent("start_editing", {
				detail: {
					editable: this,
				},
			})
		);

		this.setEditing(true);
	}

	protected handleMouseEnter() {
		// only set when not current editing element or is self
		(!AbstractEditable.activeEditable ||
			AbstractEditable.activeEditable !== this ||
			(!this.isEmpty && this.emptyAction === "remain")) &&
			this.setIsHover(true);
	}

	protected handleMouseLeave() {
		// only set when not current editing element or is self
		(!AbstractEditable.activeEditable ||
			AbstractEditable.activeEditable !== this ||
			(!this.isEmpty && this.emptyAction === "remain")) &&
			this.setIsHover(false);
	}

	protected handleStatusClick() {
		// only work when target el is empty
		if (this.node.classList.contains("isEmpty")) {
			this.handleClick();
			this.node.focus();
		}
	}

	protected handleInput(e: Event) {
		this.checkEmptyHTML();
	}

	protected checkEmptyHTML() {
		const isEmpty =
			this.node.innerHTML === "" ||
			this.node.innerHTML.replace(/s/, "") === "<br>";

		if (isEmpty) {
			console.log("woops! Empty content.");

			// when innerHtml is empty, will auto insert <br>
			if (this.node.innerHTML.replace(/s/, "") === "<br>") {
				this.node.innerHTML = "";
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
		this.isEmpty = empty;

		if (this.emptyAction === "remain") return;

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
	}

	public wrap() {
		super.wrap();

		// readonly input el
		const inputEls = this.node.querySelectorAll("input");
		[...inputEls].forEach((el) => {
			el.setAttribute("readonly", "true");
		});
	}
}

export const initializeEditables = (
	elements: HTMLElement[],
	container?: HTMLDivElement | null
): AbstractEditable[] => {
	let editalbeList: AbstractEditable[] = [];

	elements.forEach((el) => {
		editalbeList.push(initializeEditable(el as HTMLElement));
	});

	// wait for all dom elements rendered
	container &&
		editalbeList.forEach((editable) => {
			editable.adjustBadgePosition(container);
		});

	return editalbeList;
};

export const initializeEditable = (el: HTMLElement): AbstractEditable => {
	let editable: AbstractEditable;

	if (el.nodeName === "FORM") {
		editable = new FormEditable(el as HTMLElement);
	} else {
		editable = new BasicEditable(el as HTMLElement);
	}

	editable.initialize();

	return editable;
};
