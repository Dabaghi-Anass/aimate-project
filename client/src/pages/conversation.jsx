import axios from "axios";
import "katex/dist/katex.min.css";
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import robot_sms from "../assets/icons/robot_sms.svg";
import Canvas from "../components/canvas";
import Loading from "../components/loading";
import { MarkDownView } from "../components/MarkDownView";
import NavBar from "../components/navbar";
import ReactionCtx from "../context/reaction";
import { useAnimatedText } from "../hooks/useAnimatedText";
import { useAudio } from "../hooks/useAudio";
import useLocalStorage from "../hooks/useLocalStorage";
import { detectEmotion } from "./vocabulary";
const APP_URL = "http://localhost:4040";
// const APP_URL = import.meta.env["VITE_REACT_APP_BASE_URL"];
export default function Conversation() {
	const { speak, speaking } = useAudio(onBoundary);
	const [pending, setPending] = useState(false);
	const [permission, setPermission] = useState(true);
	const [userMessage, setUserMessage] = useState("");
	const [currentBotResponse, setCurentBotResponse] = useState("");
	const animatedBotResponse = useAnimatedText(currentBotResponse, " ");
	const [currentStreamID, setCurrentStreamID] = useState();
	const { get } = useLocalStorage();
	const [messages, setMessages] = useState([]);
	const messagesContainer = useRef();
	const [currentReaction, setCurrentReaction] = useState("happy");
	const handleChange = ({ target: { value: message } }) => {
		setUserMessage(message);
	};

	// in your React component
	const fetchStreamedResponse = async (userMessage) => {
		let id = `id-${Math.floor(Math.random() * 0xffffff)}`;
		let botResponse = "";
		try {
			const response = await axios.post(
				APP_URL,
				{
					prompt: userMessage,
				},
				{
					responseType: "stream",
				}
			);

			if (response.status === 500) {
				console.log("error ocuured");
				setMessages((prev) => [
					...prev,
					{
						content: "something went wrong try again later",
						author: "user",
						id: "id-" + Math.floor(Math.random() * 0xffffff),
					},
				]);
				displayReaction("sad");
				return;
			}
			setCurrentStreamID(id);
			setMessages((prev) => [
				...prev,
				{
					content: "typing...",
					author: "bot",
					id,
				},
			]);
			for await (const chunk of response.data) {
				console.log(chunk);
				botResponse += chunk;
				setCurentBotResponse((prev) => prev + chunk);
			}

			speak(botResponse, permission);
		} catch (error) {
			console.error("Error from anass", error);
		}
		const messagesCopy = [...messages];
		displayReaction("happy");
	};

	const sendMessage = async () => {
		try {
			if (userMessage.length === 0) return;
			if (speechSynthesis.speaking) {
				speechSynthesis.cancel();
			}
			displayReaction("loading");
			setPending(true);
			setMessages((prev) => [
				...prev,
				{
					content: userMessage,
					author: "user",
					id: `id-${(Math.random() * 0xffffff).toString(16)}`,
				},
			]);
			setUserMessage("");

			await fetchStreamedResponse(userMessage);

			setPending(false);
		} catch (error) {
			console.log(error);
			let id = `id-${(Math.random() * 0xffffff).toString(16)}`;
			setMessages((prev) => [
				...prev,
				{
					content: "somthing went wrong try again later",
					author: "bot",
					id,
				},
			]);
			// displayReaction("sad");
			setPending(false);
		}
	};
	function onBoundary(e) {
		let text = e.currentTarget.text.replace("\n", "").trim();
		if (e.charIndex === text.length) setSpeaking(false);
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

	function scroll() {
		messagesContainer.current.scrollTop =
			messagesContainer.current.scrollHeight;
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
			setUserMessage(rec);
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
			stopSpeech();
		};
	}, []);
	useEffect(() => {
		scroll();
	}, [messages]);
	const [windowSpeaking, setSpeaking] = useState(false);
	useEffect(() => {
		setSpeaking(speechSynthesis.speaking);
	});

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
								if (message.id === currentStreamID)
									return (
										<MarkDownView
											author={message.author}
											key={message.id}
											text={animatedBotResponse}
										/>
									);
								else
									return (
										<MarkDownView
											author={message.author}
											key={message.id}
											text={message.content}
										/>
									);
							})}
						</div>

						<div className='prompt-container'>
							<Loading pending={pending} />
							<img src={robot_sms} alt='' />
							<button
								className='record-btn'
								id='record'
								onClick={recordMessage}
								onKeyUp={(e) => {
									if (e.key === "Enter") sendMessage();
								}}>
								<ion-icon name='mic'></ion-icon>
							</button>
							<input
								type='text'
								className='prompt'
								onKeyUp={(e) => {
									if (e.key === "Enter") sendMessage();
								}}
								value={userMessage}
								onChange={(e) => handleChange(e)}
								placeholder='&#10095; write to mate'
							/>
							<button
								disabled={windowSpeaking}
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
