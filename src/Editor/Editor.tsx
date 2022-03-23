import React, { useEffect, useState, useRef, useCallback } from "react";
import StickyTab from "./components/StickyTab";
import { MKClass } from "./constant";
import { style } from "./style";
import {
	AbstractEditable,
	resetEditable,
	getActiveEditable,
	initializeEditables,
} from "./Editable";
import { mount } from "./components/UI";

const Button = () => {
	return (
		<button data-mkeditable="button">
			<span>sfsadassfsadas</span>
		</button>
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
			<StickyTab position="left" />
		</>
	);
};

const Editor = ({ jsonData }: { jsonData?: string }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const editalbeList = useRef<AbstractEditable[]>([]);
	// const editingElRef = useRef<HTMLElement | null>(null);

	// for test usage
	const mountedRef = useRef<any>();
	const [data, updateData] = useState(0);

	const handleDocumentClick = useCallback((e) => {
		// delegate onBlur to document
		const target = (e.target as HTMLElement).closest(
			`.${MKClass.mkEditableWrapper}`
		);

		// if click on editable element or no current element being editing
		// keep passing event
		if (target || !AbstractEditable.activeEditable) return true;

		AbstractEditable.eventEmitter.dispatchEvent(
			new CustomEvent("end_editing", {
				detail: {
					editable: AbstractEditable.activeEditable,
				},
			})
		);

		AbstractEditable.activeEditable.resetClass();
		resetEditable();
	}, []);

	useEffect(() => {
		if (!containerRef.current) return;

		// Only mount once, subsequent updates will not re-mount
		if (!mountedRef.current) {
			const root = containerRef.current;

			mountedRef.current = mount(root, () => {
				if (!containerRef.current) return;

				const editableNodes = root.querySelectorAll(
					MKClass.dataEditableSelector
				);

				// only element node
				const childEls = [...editableNodes] as HTMLElement[];

				editalbeList.current = initializeEditables(
					childEls,
					containerRef.current
				);

				document.addEventListener("click", handleDocumentClick);
			});
		} else {
			// Subsequent updates, will need to unwrap and restore original element,
			// otherwise react won't be able to recognize it
			editalbeList.current.forEach((editable) => {
				editable.unwrap();
			});
			mountedRef.current.update(data, () => {
				editalbeList.current.forEach((editable) => {
					// re-wrap the element when updated
					editable.wrap();
				});
			});
		}
	}, [data, jsonData]);

	useEffect(() => {
		return () => {
			editalbeList.current.forEach((basicEditable) => {
				basicEditable.destroy();
			});
			editalbeList.current = [];
			document.removeEventListener("click", handleDocumentClick);
			mountedRef.current.unmount();
		};
	}, []);

	// useEffect(() => {
	// 	const root = containerRef.current;

	// 	setTimeout(() => {
	// 		if (!root) return;

	// 		// Com1 is like Popup, pure UI component
	// 		render(<Com1 />, root, () => {
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
	// 				editalbeList.current.push(editable);
	// 			});

	// 			document.addEventListener("click", handleDocumentClick);
	// 		});
	// 	}, 500);

	// 	return () => {
	// 		editalbeList.current.forEach((basicEditable) => {
	// 			basicEditable.destroy();
	// 		});
	// 		editalbeList.current = [];
	// 		document.removeEventListener("click", handleDocumentClick);

	// 		console.log(root, 111);

	// 		root && unmountComponentAtNode(root);
	// 	};
	// }, [updated]);

	return (
		<>
			<div
				ref={containerRef}
				style={{
					position: "relative",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			></div>
			<button onClick={() => updateData((pre) => pre + 1)}>update</button>
		</>
	);
};

export default Editor;
