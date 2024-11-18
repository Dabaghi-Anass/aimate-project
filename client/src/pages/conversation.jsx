import "katex/dist/katex.min.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { fetchStreamedResponse } from "../api/api";
import robot_sms from "../assets/icons/robot_sms.svg";
import Canvas from "../components/canvas";
import Loading from "../components/loading";
import { MarkDownView } from "../components/MarkDownView";
import NavBar from "../components/navbar";
import ReactionCtx from "../context/reaction";
import { useAnimatedText } from "../hooks/useAnimatedText";
import { useAudio } from "../hooks/useAudio";
import useLocalStorage from "../hooks/useLocalStorage";
import { markdownToNormalText, uniqueId } from "../utils/utils";
import { detectEmotion } from "./vocabulary";
export default function Conversation() {
	const { get } = useLocalStorage();
	const [currentReaction, setCurrentReaction] = useState("happy");
	const [messages, setMessages] = useState([]);
	const [currentMessageStream, setCurrentMessageStream] = useState("");
	const animatedMessage = useAnimatedText(currentMessageStream);
	const { speak, speaking } = useAudio(onBoundary);
	const [pending, setPending] = useState(false);
	const [permission, setPermission] = useState(false);
	const messagesContainer = useRef();
	const userMessageRef = useRef();

	function scrollToBottom() {
		setTimeout(() => {
			messagesContainer.current.scrollTop =
				messagesContainer.current.scrollHeight + 1000;
			console.log(messagesContainer.current.scrollHeight);
		}, 0);
	}

	function sendMessage() {
		const userMessage = userMessageRef?.current.value;
		if (!userMessage) return;
		setPending(true);
		const msg = userMessage;
		userMessageRef.current.value = "";
		setMessages((prev) => [
			...prev,
			{
				content: msg,
				author: "user",
				id: uniqueId(),
			},
		]);
		getServerResponseToPrompt(msg);
	}

	const getServerResponseToPrompt = useCallback(
		(prompt) => {
			fetchStreamedResponse(prompt, {
				onError: pushErrorMessage,
				onChunk: (chunk) => {
					setCurrentMessageStream((prev) => prev + chunk);
				},
				onFinish: (data) => {
					setPending(false);
					setMessages((prev) => [
						...prev,
						{
							content: data,
							author: "bot",
							id: uniqueId(),
						},
					]);
					setCurrentMessageStream("");
					displayReaction("happy");
					speak(markdownToNormalText(data), permission);
				},
			});
		},
		[permission]
	);

	function pushErrorMessage(error) {
		const id = uniqueId();
		console.log(error);
		setMessages((prev) => [
			...prev,
			{
				content: "something went wrong try again later",
				author: "bot",
				type: "error",
				id,
			},
		]);
		displayReaction("sad");
	}

	function onBoundary(e) {
		let text = e.currentTarget.text.replace("\n", "").trim();
		// if (e.charIndex === text.length) setSpeaking(false);
		let endOfWordIndex = e.charIndex - 1;
		while (text[endOfWordIndex] !== " " && endOfWordIndex <= text.length) {
			endOfWordIndex++;
		}
		let word = text
			.substring(e.charIndex - 2, endOfWordIndex)
			.toLowerCase();
		let emotion = detectEmotion(word);
		if (emotion) displayReaction(emotion);
	}

	const recordMessage = () => {
		window.SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		let options = get("options");
		const recognition = new SpeechRecognition();
		recognition.interimResults = true;
		recognition.lang = options.language || "en-US";
		let rec;
		recognition.addEventListener("result", (e) => {
			rec = e.results[0][0].transcript;
			userMessageRef.current.value = rec;
		});

		recognition.addEventListener("end", () => {
			recognition.stop();
			sendMessage();
		});
		recognition.start();
	};

	function displayReaction(reaction) {
		setCurrentReaction(reaction);
	}
	function stopSpeech() {
		speechSynthesis.cancel();
	}
	function send(e) {
		if (e.key === "Enter") {
			stopSpeech();
			sendMessage();
		}
	}
	useEffect(() => {
		let perm = get("options")?.permission;
		setPermission(!!perm);
		addEventListener("keydown", send);
		return () => {
			removeEventListener("keydown", send);
			window?.speechSynthesis?.cancel();
			stopSpeech();
		};
	}, []);
	useEffect(() => {
		scrollToBottom();
	}, [currentMessageStream, messages]);
	useEffect(() => {
		displayReaction(pending ? "loading" : "happy");
	}, [pending]);

	return (
		<ReactionCtx.Provider value={currentReaction}>
			<div className='conversation'>
				<NavBar theme='dark'></NavBar>
				<main className='chat-container'>
					<section className='robot-animation'>
						<Canvas reaction={currentReaction}></Canvas>
					</section>
					<section className='chat'>
						<div className='messages' ref={messagesContainer}>
							<div className='quote'>
								<FormattedMessage
									id='app.chat-greeting'
									defaultMessage='hello how can i help you'
								/>
							</div>
							{messages.map((message) => {
								return (
									<MarkDownView
										author={message.author}
										key={message.id}
										type={message.type}
										text={message.content}
									/>
								);
							})}
							{currentMessageStream && (
								<MarkDownView
									author='bot'
									text={animatedMessage}
								/>
							)}
						</div>

						<div className='prompt-container'>
							<Loading pending={pending} />
							<img src={robot_sms} alt='' />
							<button
								className='record-btn'
								id='record'
								onClick={recordMessage}
								onKeyUp={async (e) => {
									// if (e.key === "Enter") await sendMessage();
								}}>
								<ion-icon name='mic'></ion-icon>
							</button>
							<input
								type='text'
								ref={userMessageRef}
								className='prompt'
								onKeyUp={(e) => {
									if (e.key === "Enter") sendMessage();
								}}
								placeholder='&#10095; write to mate'
							/>
							<button
								disabled={pending}
								className='send-button'
								onClick={sendMessage}>
								<ion-icon name='send'></ion-icon>
							</button>
						</div>
					</section>
				</main>
			</div>
		</ReactionCtx.Provider>
	);
}
