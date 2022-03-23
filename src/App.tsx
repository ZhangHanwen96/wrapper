import React, { Component, useMemo, useRef, useState } from "react";
import Editor from "./Editor";
import "./App.css";

function App() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "70vh",
				flexDirection: "column",
				position: "relative",
			}}
		>
			<Editor />
		</div>
	);
}

export default App;
