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

const emitter = new EventTarget();

const UI = forwardRef((props, ref) => {
	const [state, setState] = useState(0);
	console.log(state);
	useImperativeHandle(ref, () => ({
		update: setState,
	}));

	useEffect(() => {}, []);

	return (
		<div>
			{state === 0 ? <Text /> : <Button />}
			<div>{state}</div>
		</div>
	);
});

const Wrapper = () => {
	const controlref = useRef<{ update: (args: any) => void }>();

	const handler = useCallback((e: Event) => {
		console.log("updateing", (e as CustomEvent).detail.json);
		controlref.current?.update((e as CustomEvent).detail.json);
	}, []);

	useEffect(() => {
		emitter.addEventListener("update", handler);

		return () => {
			emitter.removeEventListener("update", handler);
		};
	}, []);

	return <UI ref={controlref} />;
};

export const mount = (root: HTMLElement, cb: (...args: any) => void) => {
	render(<Wrapper />, root, cb);

	return {
		update: (json: number) => {
			emitter.dispatchEvent(
				new CustomEvent("update", { detail: { json } })
			);
		},
		unmount: () => {
			root && unmountComponentAtNode(root);
		},
	};
};
