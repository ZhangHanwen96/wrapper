import React, {
	useContext,
	createContext,
	useState,
	useImperativeHandle,
	forwardRef,
	useRef,
	useEffect,
	useCallback,
} from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { useUpdateEffect } from "react-use";
import StickyTab from "./StickyTab";

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

const FormComp = ({ num }: { num: number }) => {
	return (
		<form data-mkeditable="form">
			<div>
				<input type="text" />
				<input type="text" />
			</div>
			<input type="text" />
			<div>{num}</div>
		</form>
	);
};

const eventEmitter = new EventTarget();

type EventDetail = {
	json: number;
	fn: VoidFunction;
};

const UI = forwardRef((props, ref) => {
	const [state, setState] = useState(0);
	const fnRef = useRef<VoidFunction>();

	useImperativeHandle(ref, () => ({
		update: ({ json, fn }: { json: number; fn: VoidFunction }) => {
			setState(json);
			fnRef.current = fn;
		},
	}));

	useUpdateEffect(() => {
		fnRef.current && fnRef.current();
	}, [state]);

	return (
		<div
			style={{
				width: 300,
				display: "flex",
				justifyItems: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<Button />
			<Text />
			<Text2 />
			<FormComp num={state} />
			<StickyTab position="right" />
		</div>
	);
});

const UIWrapper = () => {
	const UIRef = useRef<{ update: (detail: EventDetail) => void }>();

	const handler = useCallback((e: CustomEvent<EventDetail>) => {
		console.log("updateing", e.detail.json);

		UIRef.current?.update(e.detail);
	}, []) as EventListener;

	useEffect(() => {
		eventEmitter.addEventListener("update", handler);

		return () => {
			eventEmitter.removeEventListener("update", handler);
		};
	}, []);

	return <UI ref={UIRef} />;
};

export const mount = (root: HTMLElement, cb: (...args: any) => void) => {
	render(<UIWrapper />, root, cb);

	return {
		update: (json: number, fn: VoidFunction) => {
			eventEmitter.dispatchEvent(
				new CustomEvent("update", { detail: { json, fn } })
			);
		},
		unmount: () => {
			root && unmountComponentAtNode(root);
		},
	};
};
