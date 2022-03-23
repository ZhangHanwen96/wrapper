export const setAttr = (
	el: HTMLElement | null,
	attr: string,
	value: string
) => {
	if (!el) return;
	el.setAttribute(attr, value);
};

export const getComputedStyle = (el: HTMLElement | null, property: string) => {
	if (!el) return "";
	const computed = window.getComputedStyle(el);
	return computed.getPropertyValue(property);
};

// wrap wrapper around el
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

// unwrap element from wrapper
export const unwrap = (wrapper: HTMLElement) => {
	const parent = wrapper.parentElement;

	if (!parent) return;

	while (wrapper.firstChild) {
		parent?.insertBefore(wrapper.firstChild, wrapper);
	}

	parent?.removeChild(wrapper);
};

export const computeElementOffset = (
	node: HTMLElement | null,
	rootNode: HTMLElement
): number => {
	if (node === rootNode || !node) {
		return 0;
	}
	return (
		computeElementOffset(node.offsetParent as HTMLElement, rootNode) +
		node.offsetTop
	);
};
