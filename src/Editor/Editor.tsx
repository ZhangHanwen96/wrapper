import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	forwardRef,
} from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { setAttr } from "./utils";

const Button = () => {
	return (
		<div className="wrapper">
			<div data-mkEditable="button">sds</div>
		</div>
	);
};

const Text = () => {
	return (
		<div className="wrapper">
			<h2 data-mkEditable="text">
				<span>I'm h2 text</span>
			</h2>
		</div>
	);
};

const Text2 = () => {
	return <h2 data-mkEditable="text" className="isEmpty"></h2>;
};

const sendData = (data: {
	target: HTMLElement | null;
	prevTarget?: HTMLElement;
	type: string;
}) => {
	console.log(data.target?.nodeType, data.type);
};

const Editor = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const editingElRef = useRef<HTMLElement | null>(null);

	const handleBlur = useCallback((e) => {}, []);

	const handleEnter = useCallback((e) => {
		const target = (e.target as HTMLElement).closest("[data-mkEditable]")!;
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

		console.log(target.innerHTML);
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
		const target = (e.target as HTMLElement).closest("[data-mkEditable]")!;
		// only set when not current editing element
		editingElRef.current !== target &&
			target.classList.remove("hoverActive");
	}, []);

	const handleClick = useCallback((e) => {
		console.log("ckick");
		const target = (e.target as HTMLElement).closest(
			"[data-mkEditable]"
		)! as HTMLElement;

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
	}, []);

	const attachEvents = useCallback(
		(children: HTMLElement[]) => {
			children.forEach((el) => {
				el.addEventListener("mouseenter", handleEnter);
				el.addEventListener("mouseleave", handleLeave);
				el.addEventListener("click", handleClick);
				el.addEventListener("blur", handleBlur);
				el.addEventListener("input", handleInput);
				// el.addEventListener("focus", handleFocus);
			});
		},
		[handleEnter, handleLeave, handleClick]
	);

	const removeEvents = useCallback(
		(children: HTMLElement[]) => {
			children.forEach((el) => {
				el.removeEventListener("mouseenter", handleEnter);
				el.removeEventListener("mouseleave", handleLeave);
				el.removeEventListener("click", handleClick);
				el.removeEventListener("blur", handleBlur);
				el.removeEventListener("input", handleInput);
			});
		},
		[handleEnter, handleLeave, handleClick]
	);

	const handleDocumentClick = useCallback((e) => {
		// delegate onBlur to document
		// because blur event on [data-mkEditable] conflict with onClick event
		const target = (e.target as HTMLElement).closest("[data-mkEditable]")!;

		if (target || !editingElRef.current) return;

		const el = editingElRef.current as HTMLElement;
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

		render(
			<>
				<Button />
				<Text />
				<Text2 />
			</>,
			containerRef.current,
			() => {
				if (!containerRef.current) return;
				const editableNodes =
					containerRef.current.querySelectorAll("[data-mkEditable]");

				// only element node
				childEls = [...editableNodes];

				console.log(childEls.length, "total children nums");

				// contentEditable
				childEls.forEach((el) => {
					el.setAttribute("contentEditable", "true");
				});

				attachEvents(childEls as HTMLElement[]);

				// TODO use document for test only, may change host
				document.addEventListener("click", handleDocumentClick);
			}
		);

		return () => {
			removeEvents((childEls as HTMLElement[]) || []);
			document.removeEventListener("click", handleDocumentClick);
			containerRef.current &&
				unmountComponentAtNode(containerRef.current);
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
