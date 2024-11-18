import React, { useContext, useEffect, useRef } from "react";
import reactionsImages from "../assets/images/images";
import { ReactionContext } from "../context/reaction";
export default function Canvas() {
	const { reaction: reactionCtx } = useContext(ReactionContext);
	const { current: images } = useRef(reactionsImages);
	const canvasRef = useRef(null);
	let { current: ctx } = useRef(canvasRef?.current?.getContext("2d"));
	const { current: FRAME_RATE } = useRef(4);
	const { current: ROBOT_HEIGHT } = useRef(
		images.happy.height + images.body.height + 20
	);
	const { current: timeStamp } = useRef(1000 / FRAME_RATE);
	let { current: animation } = useRef(null);
	let { current: FRAME } = useRef(0);
	function drawRobot() {
		if (!images) return;
		if (!ctx) return;
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		const { x, y } = getRobotPosition();
		let robotX = (canvasRef.current.width - images.body.width / 4) / 2;
		drawFrame(images[reactionCtx], FRAME, x, y);
		drawFrame(
			images.body,
			FRAME,
			robotX,
			y + images[reactionCtx].height + 20
		);
		drawShadow(ctx);
	}
	function drawShadow(ctx) {
		let x, y, w, h;
		w = images.body.width / 16;
		h = images.body.width / 200;
		let { current: canvas } = canvasRef;
		x = (canvas.width - h) / 2;
		y = canvas.height - w / 2;
		ctx.beginPath();
		ctx.fillStyle = "#99999950";
		// ctx.filter = "hue-rotate(200deg)";
		ctx.ellipse(x, y, w, h, Math.PI, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}
	function getRobotPosition() {
		let img = images.happy;
		let x = (canvasRef.current.width - img.width / 4) / 2;
		let y = (canvasRef.current.height - ROBOT_HEIGHT) / 2;
		return { x, y };
	}
	function drawFrame(img, f, x, y) {
		let w = img.width / 4;
		let h = img.height;
		ctx?.drawImage(img, f * w, 0, w, h, x, y, w, h);
	}
	function getCanvasSize() {
		let width = images.body.width;
		let height = ROBOT_HEIGHT + 100;
		return { width, height };
	}
	function update() {
		if (FRAME >= 3) return (FRAME = 0);
		FRAME++;
	}
	function initializeCanvas() {
		const { width, height } = getCanvasSize();
		ctx = canvasRef?.current?.getContext("2d");
		canvasRef.current.width = width;
		canvasRef.current.height = height;
	}
	function animate() {
		clearInterval(animation);
		animation = setInterval(() => {
			update();
			drawRobot(reactionCtx);
		}, timeStamp);
	}

	useEffect(() => {
		if (!images) return;
		initializeCanvas();
		animate();
		drawRobot(reactionCtx);
		return () => {
			clearInterval(animation);
		};
	}, [reactionCtx]);
	return <canvas ref={canvasRef}></canvas>;
}
