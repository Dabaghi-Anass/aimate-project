import "katex/dist/katex.min.css";
import React from "react";
import Canvas from "../components/canvas";
import NavBar from "../components/navbar";
import Conversation from "./conversation";
export default function ConversationPage() {
	return (
		<div className='conversation'>
			<NavBar theme='dark'></NavBar>
			<main className='chat-container'>
				<section className='robot-animation'>
					<Canvas />
				</section>
				<Conversation />
			</main>
		</div>
	);
}
