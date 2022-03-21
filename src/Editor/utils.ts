// const attachEvents = (children: HTMLCollection) => {
//     [...new Set(children)].forEach((el) => {
//         el.addEventListener("mouseenter", handleEnter);
//         el.addEventListener("mouseleave", handleLeave);
//     })
// }

// const removeEvents = (children: HTMLCollection) => {
//     [...new Set(children)].forEach((el) => {
//         el.removeEventListener("mouseenter", handleEnter);
//         el.removeEventListener("mouseleave", handleLeave);
//     })
// }

export const setAttr = (el: HTMLElement, attr: string, value: string) => {
	el.setAttribute(attr, value);
};

export const getComputedStyle = (el: HTMLElement | null, property: string) => {
	if (!el) return "";
	const computed = window.getComputedStyle(el);
	return computed.getPropertyValue(property);
};

// same as Jquery wrap
export const wrap = (
	el: HTMLElement,
	wrapper: HTMLElement,
	option: { selection: boolean } = { selection: false }
) => {
	if (option.selection) {
		wrapWithSelection(el, wrapper);
	} else {
		wrapWithDomManipulation(el, wrapper);
	}
};

const wrapWithDomManipulation = (el: HTMLElement, wrapper: HTMLElement) => {
	const parent = el.parentElement;
	parent?.insertBefore(wrapper, el);
	wrapper.appendChild(el);
};

const wrapWithSelection = (el: HTMLElement, wrapper: HTMLElement) => {
	const range = new Range();
	range.selectNode(el);
	range.surroundContents(wrapper);
};

// unwrap element from parent
export const unwrap = (wrapper: HTMLElement) => {
	const parent = wrapper.parentElement;

	if (!parent) return;

	while (wrapper.firstChild) {
		parent?.insertBefore(wrapper.firstChild, wrapper);
	}

	parent?.removeChild(wrapper);
};

export type EventHandlerMap = Record<string, (e: any) => void>;

const attachEvents = (el: HTMLElement, map: EventHandlerMap) => {
	Object.keys(map).forEach((event) => {
		el.addEventListener(event, map[event]);
	});
};

const detachEvents = (el: HTMLElement, map: EventHandlerMap) => {
	Object.keys(map).forEach((event) => {
		el.removeEventListener(event, map[event]);
	});
};

const prepareEditor = (el: HTMLElement) => {
	// add mkeditable-wrapper and status
	const wrapper = document.createElement("div");
	wrapper.classList.add("mkeditable-wrapper");
	wrap(el, wrapper);

	const statusDiv = document.createElement("div");
	statusDiv.classList.add("status");
	statusDiv.innerHTML = "Click to edit";
	wrapper.appendChild(statusDiv);
};

export const preProcess = (el: HTMLElement, map: EventHandlerMap) => {
	attachEvents(el, map);
	prepareEditor(el);
};

export const postProcess = (el: HTMLElement, map: EventHandlerMap) => {
	detachEvents(el, map);
};
