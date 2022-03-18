// const attachEvents = (children: HTMLCollection) => {
//     [...new Set(children)].forEach((el) => {
//         el.addEventListener("mouseenter", handleEnter);
//         el.addEventListener("mouseleave", handleLeave);
//     })
// }

// const removeEvents = (children: HTMLCollection) => {
//     [...new Set(children)].forEach((el) => {
//         el.removeEventListener("mouseenter", handleEnter);
//         el.removeEventListener("mouseleave", handleLeave);
//     })
// }

export const setAttr = (el: HTMLElement, attr: string, value: string) => {
	el.setAttribute(attr, value);
};
