import React, { Component, useMemo, useRef, useState } from "react";
import Editor from "./Editor";
import "./App.css";

function App() {
	const dataAttr = useMemo(() => {}, []);
	const storeRef = useRef<any>();
	const editingRef = useRef(false);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "70vh",
				flexDirection: "column",
			}}
		>
			{" "}
			<h1 contentEditable>
				<a>im link</a> / Content editable
			</h1>
			<button
				contentEditable
				className="btn"
				data-mkEditable="button"
				onMouseEnter={(e): void => {
					!editingRef.current &&
						(e.target as HTMLButtonElement).classList.add(
							"hoverActive"
						);
				}}
				onMouseLeave={(e): void => {
					!editingRef.current &&
						(e.target as HTMLButtonElement).classList.remove(
							"hoverActive"
						);
				}}
				// onClick={(e) => {
				//   (e.target as HTMLButtonElement).classList.remove('hoverActive');
				//   (e.target as HTMLButtonElement).classList.add('editing');

				//   const container = document.createElement('div');
				//   const childNodes = (e.target as HTMLButtonElement).childNodes;
				//   [...new Set(childNodes)].forEach((node) => {
				//     const cp = node.cloneNode(true);
				//     container.appendChild(cp);
				//   });

				//   storeRef.current = container;

				//   (e.target as HTMLButtonElement).innerHTML = '';
				//   const inputEl = document.createElement('input');
				//   inputEl.innerHTML = 'Please edit ..';
				//   // console.log(e.target);
				//   (e.target as HTMLButtonElement).appendChild(inputEl);
				//   inputEl.focus();

				//   const btnEl = e.target as HTMLButtonElement;
				//   inputEl.onblur = function () {
				//     console.log(btnEl);
				//     (btnEl as HTMLButtonElement).classList.remove('editing');
				//     btnEl.innerHTML = '';
				//     const childNodes = storeRef.current.childNodes as ChildNode[];
				//     [...new Set(childNodes)].forEach((node) => {
				//       const cp = node.cloneNode(true);
				//       btnEl.appendChild(cp);
				//     });
				//   };
				// }}
			>
				Subscribe Now
			</button>
			<hr />
			<Editor />
		</div>
	);
}

export default App;
