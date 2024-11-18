import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
export function useAnimatedText(text, delimiter = " ", onFinish, onUpdateText) {
	let animatedCursor = useMotionValue(0);
	let [cursor, setCursor] = useState(0);
	let [prevText, setPrevText] = useState(text);
	let [isSameText, setIsSameText] = useState(true);

	if (prevText !== text) {
		setPrevText(text);
		setIsSameText(text.startsWith(prevText));

		if (!text.startsWith(prevText)) {
			setCursor(0);
		}
	}
	//call onFinish after finishing

	useEffect(() => {
		if (!isSameText) {
			animatedCursor.jump(0);
		}

		let controls = animate(animatedCursor, text.split(delimiter).length, {
			duration: text.length * 0.006,
			ease: "linear",
			onUpdate(latest) {
				setCursor(Math.floor(latest));
				onUpdateText?.(text);
			},
			onComplete: () => {
				if (typeof onFinish === "function") {
					onFinish(text);
				}
			},
		});

		return () => controls.stop();
	}, [animatedCursor, isSameText, text]);

	const part = text.split(delimiter).slice(0, cursor).join(delimiter);
	return part;
}
