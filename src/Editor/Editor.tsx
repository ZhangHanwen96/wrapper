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
import {
	BasicEditable,
	FormEditable,
	AbstractEditable,
	resetEditable,
	getActiveEditable,
} from "./Basic";
import { mount } from "./components/UI";

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
				<input type="text" />
				<input type="text" />
			</div>
			<input type="text" />
		</form>
	);
};

const Com1 = () => {
	return (
		<>
			<Button />
			<Text />
			<Text2 />
			<FormComp />
		</>
	);
};

const Com2 = () => {
	return (
		<>
			<Button />
			<FormComp />
		</>
	);
};

const Comp = ({ num }: { num: number }) => {
	return num === 0 ? <Com1 /> : <Com2 />;
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
	const currentEditalbeComp = useRef<AbstractEditable[]>([]);
	// const editingElRef = useRef<HTMLElement | null>(null);

	const mountedRef = useRef<any>();

	const [updated, setUpdate] = useState(0);

	const handleDocumentClick = useCallback((e) => {
		// delegate onBlur to document

		const target = (e.target as HTMLElement).closest(
			`.${MKClass.mkEditableWrapper}`
		);

		// if click on editable element or no current element being editing
		// keep passing event
		if (target || !BasicEditable.activeEditable) return true;

		const el = BasicEditable.activeEditable.getNode() as HTMLElement;
		// reset style
		const classes = ["editingActive", "hoverActive"];
		classes.forEach((cls) => el.classList.remove(cls));

		resetEditable();

		sendData({
			target: null,
			type: "done",
		});
	}, []);

	// useEffect(() => {
	// 	if (!containerRef.current) return;

	// 	// Com1 is like Popup, pure UI component

	// 	if (!mountedRef.current) {
	// 		const root = containerRef.current;

	// 		mountedRef.current = mount(root, () => {
	// 			if (!containerRef.current) return;

	// 			const editableNodes = root.querySelectorAll(
	// 				MKClass.dataEditableSelector
	// 			);

	// 			// only element node
	// 			const childEls = [...editableNodes];

	// 			childEls.forEach((el) => {
	// 				let editable: AbstractEditable;
	// 				if (el.nodeName === "FORM") {
	// 					editable = new FormEditable(el as HTMLElement);
	// 				} else {
	// 					editable = new BasicEditable(el as HTMLElement);
	// 				}
	// 				editable.initialize();
	// 				currentEditalbeComp.current.push(editable);
	// 			});

	// 			document.addEventListener("click", handleDocumentClick);
	// 		});
	// 	} else {
	// 		mountedRef.current.update(updated);
	// 	}

	// 	return () => {
	// 		currentEditalbeComp.current.forEach((basicEditable) => {
	// 			basicEditable.destroy();
	// 		});
	// 		currentEditalbeComp.current = [];
	// 		document.removeEventListener("click", handleDocumentClick);
	// 		mountedRef.current.unmount();
	// 	};
	// }, [updated]);

	useEffect(() => {
		if (!containerRef.current) return;

		const root = containerRef.current;

		// Com1 is like Popup, pure UI component
		render(<Com1 />, root, () => {
			if (!containerRef.current) return;

			const editableNodes = root.querySelectorAll(
				MKClass.dataEditableSelector
			);

			// only element node
			const childEls = [...editableNodes];

			childEls.forEach((el) => {
				let editable: AbstractEditable;
				if (el.nodeName === "FORM") {
					editable = new FormEditable(el as HTMLElement);
				} else {
					editable = new BasicEditable(el as HTMLElement);
				}
				editable.initialize();
				currentEditalbeComp.current.push(editable);
			});

			document.addEventListener("click", handleDocumentClick);
		});

		return () => {
			currentEditalbeComp.current.forEach((basicEditable) => {
				basicEditable.destroy();
			});
			currentEditalbeComp.current = [];
			document.removeEventListener("click", handleDocumentClick);
			root && unmountComponentAtNode(root);
		};
	}, [updated]);

	return (
		<>
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
			<button onClick={() => setUpdate((pre) => pre + 1)}>update</button>
		</>
	);
};

export default Editor;
