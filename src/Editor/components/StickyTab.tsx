import React from "react";

const pos = {
	left: {
		left: 0,
		top: "50%",
		right: "auto",
		transform: "rotate(-90deg)",
		transformOrigin: "top center",
	},
	right: {
		left: "auto",
		top: "50%",
		right: 0,
		transform: "translateY(-100%) rotate(-90deg)",
		transformOrigin: "bottom center",
	},
	bottom: {
		left: "50%",
		right: "auto",
		top: "auto",
		bottom: 0,
		transform: "translateX(-50%)",
	},
	top: {
		left: "50%",
		right: "auto",
		top: "0",
		bottom: "auto",
		transform: "translateX(-50%)",
	},
};

const StickyTab = ({ position = "left" }: { position: keyof typeof pos }) => {
	return (
		<div
			// data-mkeditable="text-vertical"
			style={{
				position: "absolute",
				width: 0,
				overflow: "visible",
				display: "flex",
				justifyContent: "center",
				flexDirection: "row",
				...pos[position],
			}}
		>
			<button
				data-mkeditable="button"
				mkeditable-position="fixed"
				mkeditable-emptyaction="remain"
			>
				Get 10% off
			</button>
		</div>
	);
};

export default StickyTab;
