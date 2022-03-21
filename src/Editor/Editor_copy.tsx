import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	forwardRef,
} from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { setAttr, getComputedStyle, wrap } from "./utils";
import { MKClass } from "./constant";
import { style } from "./style";

const Button = () => {
	return (
		<div data-mkeditable="button">
			<span>sfsadassfsadas</span>
		</div>
	);
};

const Text = () => {
	return (
		<h2 data-mkeditable="text">
			<span>I'm h2 text</span>
		</h2>
	);
};

const Text2 = () => {
	return <h2 data-mkeditable="text" className="isEmpty"></h2>;
};

const Tab = () => {
	return (
		<div
			data-mkeditable="text"
			style={{
				writingMode: "vertical-lr",
				position: "fixed",
				left: "0",
				bottom: "35%",
			}}
		>
			Get 10% off
		</div>
	);
};

const FormComp = () => {
	return (
		<form data-mkeditable="form">
			<div>
				<input type="text" readOnly />
				<input type="text" readOnly />
			</div>
			<input type="text" readOnly />
		</form>
	);
};

const sendData = (data: {
	target: HTMLElement | null;
	prevTarget?: HTMLElement;
	type: string;
}) => {
	// console.log(data.target?.nodeType, data.type);
};

const Editor = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const editingElRef = useRef<HTMLElement | null>(null);

	const handleEnter = useCallback((e) => {
		// const target = (e.target as HTMLElement).closest(
		// 	MKClass.dataEditableSelector
		// )!;
		const target = e.currentTarget as HTMLElement;
		// only set when not current editing element
		editingElRef.current !== target && target.classList.add("hoverActive");
	}, []);

	const handleInput = useCallback((e) => {
		// TODO event delegation
		// let t;
		// while(e.target !== editingElRef.current || e.target.parentNode) {
		//     if(e.target.type === '') {
		//         t = e.target;
		//         break;
		//     }
		// }

		// if(!t) {
		//     return
		// }

		const target = e.target as HTMLElement;

		const isEmpty =
			target.innerHTML === "" ||
			target.innerHTML.replace(/s/, "") === "<br>";

		if (isEmpty) {
			console.log("woops empty content");

			// when innerHtml is empty, will auto insert <br>
			if (target.innerHTML.replace(/s/, "") === "<br>") {
				target.innerHTML = "";
			}
			target.classList.add("isEmpty");
		} else {
			if (target.classList.contains("isEmpty")) {
				target.classList.remove("isEmpty");
			}
		}
	}, []);

	const handleLeave = useCallback((e) => {
		// const target = (e.target as HTMLElement).closest(
		// 	MKClass.dataEditableSelector
		// )!;

		const target = e.currentTarget as HTMLElement;
		// only set when not current editing element
		editingElRef.current !== target &&
			target.classList.remove("hoverActive");
	}, []);

	const handleClick = useCallback((e: MouseEvent) => {
		// const target = (e.target as HTMLElement).closest(
		// 	"[data-mkeditable]"
		// )! as HTMLElement;

		const target = e.currentTarget as HTMLElement;

		if (!target) return;

		if (editingElRef.current) {
			// click again in current editing el
			if (editingElRef.current === target) {
				return;
			}
			let prevTarget = editingElRef.current;

			// exist other active editing element
			// remove style from current editing element
			editingElRef.current.classList.remove("editingActive");
			// remove hover style and set editing style to clicked
			editingElRef.current = target;
			editingElRef.current.classList.remove("hoverActive");
			editingElRef.current.classList.add("editingActive");
			sendData({
				target: editingElRef.current,
				prevTarget,
				type: "change_editing_target",
			});
		} else {
			editingElRef.current = target;
			editingElRef.current.classList.remove("hoverActive");
			editingElRef.current.classList.add("editingActive");
			sendData({
				target: editingElRef.current,
				type: "editing",
			});
		}

		if (target.nodeName === "FORM") {
			console.log("form");
			return false;
		}

		// highlight text with selection
		window
			?.getSelection()
			?.setBaseAndExtent(
				editingElRef.current,
				0,
				editingElRef.current,
				editingElRef.current.childNodes.length
			);
	}, []);

	const handleStatusClick = useCallback((e) => {
		// const status = (e.target as HTMLElement).closest(
		// 	".status"
		// ) as HTMLElement;
		const status = e.currentTarget as HTMLElement;

		if (!status) return;

		const target = status.previousElementSibling as HTMLElement;

		// only work when target el is empty
		if (target.classList.contains("isEmpty")) {
			if (editingElRef.current) {
				// click again in current editing el
				if (editingElRef.current === target) {
					return;
				}
				let prevTarget = editingElRef.current;

				// exist other active editing element
				// remove style from current editing element
				editingElRef.current.classList.remove("editingActive");
				// remove hover style and set editing style to clicked
				editingElRef.current = target;
				editingElRef.current.classList.remove("hoverActive");
				editingElRef.current.classList.add("editingActive");
				sendData({
					target: editingElRef.current,
					prevTarget,
					type: "change_editing_target",
				});
			} else {
				editingElRef.current = target;
				editingElRef.current.classList.remove("hoverActive");
				editingElRef.current.classList.add("editingActive");
				sendData({
					target: editingElRef.current,
					type: "editing",
				});
			}
			editingElRef.current.focus();
		}
	}, []);

	const attachEvents = useCallback(
		(children: HTMLElement[]) => {
			children.forEach((el) => {
				el.addEventListener("mouseenter", handleEnter);
				el.addEventListener("mouseleave", handleLeave);
				el.addEventListener("click", handleClick);
				el.addEventListener("input", handleInput);

				// add mkeditable-wrapper and status
				const wrapper = document.createElement("div");
				wrapper.classList.add(MKClass.mkEditableWrapper);
				wrap(el, wrapper);

				const statusDiv = document.createElement("div");
				statusDiv.classList.add("status");
				statusDiv.innerHTML = "Click to Edit";
				wrapper.appendChild(statusDiv);

				// .status handle click only empty
				statusDiv.addEventListener("click", handleStatusClick);

				// get margin-top
				// if (el.nodeName === "H2" && statusEl) {
				// 	const marginTop = getComputedStyle(el, "margin-top");
				// 	console.log(marginTop);
				// 	(statusEl as HTMLElement).style.top = marginTop;
				// }
			});
		},
		[handleEnter, handleLeave, handleClick, handleInput, handleStatusClick]
	);

	const removeEvents = useCallback(
		(children: HTMLElement[]) => {
			// [data-mkeditable]
			children.forEach((el) => {
				el.removeEventListener("mouseenter", handleEnter);
				el.removeEventListener("mouseleave", handleLeave);
				el.removeEventListener("click", handleClick);
				el.removeEventListener("input", handleInput);
			});
			// .status handle click only empty
			children.forEach((el) => {
				const statusEl = el.nextElementSibling;
				statusEl?.removeEventListener("click", handleStatusClick);
			});
		},
		[handleEnter, handleLeave, handleClick, handleInput, handleStatusClick]
	);

	const handleDocumentClick = useCallback((e) => {
		// delegate onBlur to document
		// because blur event on [data-mkeditable] conflict with onClick event

		const target = (e.target as HTMLElement).closest(
			`.${MKClass.mkEditableWrapper}`
		);

		// if click on editable element or no current element being editing
		// keep passing event
		if (target || !editingElRef.current) return true;

		const el = editingElRef.current as HTMLElement;
		// reset style
		const classes = ["editingActive", "hoverActive"];
		classes.forEach((cls) => el.classList.remove(cls));

		editingElRef.current = null;

		sendData({
			target: null,
			type: "done",
		});
	}, []);

	useEffect(() => {
		if (!containerRef.current) return;
		let childEls: Element[];

		// shadow root container
		// const shadowRoot = containerRef.current.attachShadow({ mode: "open" });
		// const styleTag = document.createElement("style");
		// styleTag.innerHTML = style;

		const root = containerRef.current;

		render(
			<>
				<Button />
				<Text />
				<Text2 />
				<FormComp />
			</>,
			root,
			() => {
				if (!containerRef.current) return;
				const editableNodes = root.querySelectorAll(
					MKClass.dataEditableSelector
				);

				// only element node
				childEls = [...editableNodes];

				// contentEditable
				childEls.forEach((el) => {
					if (el.nodeName === "FORM") return;
					el.setAttribute("contenteditable", "true");
				});

				attachEvents(childEls as HTMLElement[]);

				// TODO use document for test only, may change host
				document.addEventListener("click", handleDocumentClick);

				// shadowRoot.prepend(styleTag);
			}
		);

		[...document.querySelectorAll("input")].forEach((e) => {
			e.addEventListener("focus", (e) => {
				return false;
			});
		});

		return () => {
			removeEvents((childEls as HTMLElement[]) || []);
			document.removeEventListener("click", handleDocumentClick);
			root && unmountComponentAtNode(root);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			style={{
				width: 300,
				display: "flex",
				justifyItems: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		></div>
	);
};

export default Editor;
