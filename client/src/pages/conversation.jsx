import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Canvas from "../components/canvas";
import { detectEmotion } from "./vocabulary";
import { useAudio } from "../hooks/useAudio";
import ReactionCtx from "../context/reaction";
import NavBar from "../components/navbar";
import robot_sms from "../assets/icons/robot_sms.svg"
import useLocalStorage from "../hooks/useLocalStorage";
import { FormattedMessage } from "react-intl";
import Loading from "../components/loading"
// const APP_URL =  "http://localhost:3000";
const APP_URL =  import.meta.env["VITE_REACT_APP_BASE_URL"]
export default function Conversation() {
  const { speak, speaking } = useAudio(onBoundary);
  const [pending,setPending] = useState(false)
  const [permission,setPermission] = useState(true)
  const [userMessage, setUserMessage] = useState("");
  const {get} = useLocalStorage()
  const [messages, setMessages] = useState([]);
  const messagesContainer = useRef();
  const [currentReaction, setCurrentReaction] = useState("happy");
  const handleChange = ({ target: { value: message } }) => {
    setUserMessage(message);
  };

  const sendMessage = async () => {
    try {
      if (userMessage.length === 0) return;
      if(speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      displayReaction("loading");
      setPending(true)
      setMessages((prev) => [
        ...prev,
        {
          content: userMessage,
          author: "user",
          id: `id-${(Math.random() * 0xffffff).toString(16)}`,
        },
      ]);
      setUserMessage("");
      let id = `id-${Math.floor(Math.random() * 0xffffff)}`;
      const { data } = await axios.post(APP_URL, {
        prompt: userMessage,
      });

      if (data.err || !data) {
        setMessages((prev) => [
          ...prev,
          {
            content: "something went wrong try again later",
            author: "bot",
            id: `id-${(Math.random() * 0xffffff).toString(16)}`,
          },
        ]);
        displayReaction("sad");
      } else {
        setMessages((prev) => [
          ...prev,
          { content: data.content, author: "bot", id },
        ]);
        displayReaction("happy");
         setPending(false)
        speak(data.content,permission);
      }
    } catch (error) {
      let id = `id-${(Math.random() * 0xffffff).toString(16)}`;
      setMessages((prev) => [
        ...prev,
        { content: "somthing went wrong try again later", author: "bot", id },
      ]);
      displayReaction("sad");
       setPending(false)
    }
  };
  function onBoundary(e) {
    let text = e.currentTarget.text.replace("\n", "").trim();
    if(e.charIndex === text.length) setSpeaking(false)
    let endOfWordIndex = e.charIndex - 1;
    while (text[endOfWordIndex] !== " " && endOfWordIndex <= text.length) {
      endOfWordIndex++;
    }
    let word = text.substring(e.charIndex - 2, endOfWordIndex).toLowerCase();
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
  const [windowSpeaking,setSpeaking] = useState(false)
  useEffect(() => {
    setSpeaking(speechSynthesis.speaking)
  })

  return (
    <ReactionCtx.Provider value={currentReaction}>
      <div className="conversation">
        <NavBar theme="dark"></NavBar>
        <main className="chat-container">
          <section className="robot-animation">
            <Canvas reaction={currentReaction}></Canvas>
          </section>
          <section className="chat">
            <div className="messages" ref={messagesContainer}>
                <div className="quote">
                  <FormattedMessage id="app.chat-greeting" defaultMessage="hello how can i help you"/>
                </div>
              {messages.map((message) => (
                <div
                key={message.id}
                className={`quote ${
                  message.author === "user" ? " user-message" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
              ))}
            </div>

            <div className="prompt-container">
              <Loading pending={pending} />
              <img src={robot_sms} alt="" />
              <button
                className="record-btn"
                id="record"
                onClick={recordMessage}
              onKeyUp={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              >
                <ion-icon name="mic"></ion-icon>
              </button>
              <input
                type="text"
                className="prompt"
                onKeyUp={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                value={userMessage}

                onChange={(e) => handleChange(e)}
                placeholder="&#10095; write to mate"
              />
              <button  disabled={windowSpeaking} className="send-button" onClick={sendMessage}>
                <ion-icon name="send"></ion-icon>
              </button>
            </div>
          </section>
        </main>
      </div>
    </ReactionCtx.Provider>
  );
}
