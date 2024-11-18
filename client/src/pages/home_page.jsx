import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import iconSrc from "../assets/images/icon.png";
import NavBar from "../components/navbar";
import RobotScene from "../components/RobotScene";
import { initScene } from "../components/threeScene";
import useLocalStorage from "../hooks/useLocalStorage";

export default function () {
	const [canvasSize, setCanvasSize] = useState({});
	const [language, setLanguage] = useState();
	function toggleNavClass() {
		const container = document.querySelector(".hero");
		const nav = document.querySelector("nav");
		if (nav.offsetHeight >= container.getBoundingClientRect().y) {
			nav.classList.add("nav-overlay");
		} else nav.classList.remove("nav-overlay");
	}
	function hookGsapScroll() {
		gsap.registerPlugin(ScrollTrigger);
		document.querySelectorAll(".quote")?.forEach((elem) => {
			let tl = gsap.timeline({
				scrollTrigger: {
					start: "top 80%",
					duration: 5,
					trigger: elem,
				},
			});

			tl.fromTo(
				elem,
				{
					x: -innerWidth,
				},
				{
					x: 0,
				}
			);
		});
	}
	useEffect(() => {
		const { get } = useLocalStorage();
		const lang = get("options")?.language || navigator.language;
		setLanguage(lang);
		hookGsapScroll();
		const canvasContainer = document.querySelector(".hero-image");
		let { width, height } = canvasContainer.getBoundingClientRect();
		if (canvasSize?.width !== width || canvasSize?.height !== height)
			setCanvasSize((prev) => ({
				width,
				height,
			}));
		addEventListener("scroll", toggleNavClass);
		return () => {
			removeEventListener("scroll", toggleNavClass);
		};
	}, []);
	useMemo(() => {
		if (!canvasSize.width) return;
		initScene(canvasSize, "/robot.glb")();
	}, [canvasSize]);

	return (
		<>
			<header className='header'>
				<div className='annonce'>
					<marquee>
						<FormattedMessage
							id='app.anounce'
							defaultMessage='please this is just the beta version if you noticed any bugs please report it so we can fix it asap '
						/>

						<span className='important'>&#9787;</span>
					</marquee>
				</div>
				<NavBar />
				<div className='hero' dir={language === "ar" ? "rtl" : "ltr"}>
					<div className='hero-text'>
						<div className='intro'>
							<h1
								style={{
									letterSpacing: `${
										language === "ar" ? 0 : "0.1rem"
									}`,
								}}>
								<FormattedMessage
									id='app.header'
									defaultMessage='Welcome to the Most Intuitive ChatBot Application Conversations Made Easy!'
								/>
							</h1>
							<p
								style={{
									letterSpacing: `${
										language === "ar" ? 0 : "0.05rem"
									}`,
								}}>
								<FormattedMessage
									id='app.sub-header'
									defaultMessage="based on google llm's"
								/>
							</p>
						</div>
						<div className='cta'>
							<Link to='/chat' className='btn'>
								<FormattedMessage
									id='app.start-chat'
									defaultMessage='start a chat'
								/>
							</Link>
						</div>
					</div>
					<div className='hero-image'>
						<RobotScene size={canvasSize} />
					</div>
				</div>
			</header>
			<section className='page discover-section' id='discover'>
				<div className='quote'>
					<FormattedMessage
						id='app.quote1'
						defaultMessage='Based On OPENAI Text-davinci-003 Language Model'
					/>
				</div>
				<div className='quote user-message'>
					<FormattedMessage
						id='app.quote2'
						defaultMessage='enjoy all chat gpt features and more such as voice activated and also
          voice replies'
					/>
				</div>
				<div className='quote'>
					<FormattedMessage
						id='app.quote3'
						defaultMessage='get the experience of talking with your friend'
					/>
				</div>
				<div className='quote'>
					<FormattedMessage
						id='app.quote4'
						defaultMessage='all these features are for free'
					/>
				</div>
			</section>
			<footer>
				<h1 className='nav-bar-brand'>
					<img src={iconSrc} alt='' className='logo-image' />
					<span>AIMATE</span>
				</h1>
				<div className='social-media'>
					<p>
						<FormattedMessage
							id='app.credits-declare'
							defaultMessage='all credits reserved to developer'
						/>{" "}
						&#169;
					</p>
					<ul>
						<li>
							<a
								target='_blank'
								href='https://www.facebook.com/profile.php?id=100075508960200'>
								<ion-icon
									style={{ borderRadius: "50%" }}
									name='logo-facebook'></ion-icon>
							</a>
						</li>
						<li>
							<a
								target='_blank'
								href='https://www.instagram.com/debbaghianass/'>
								<ion-icon
									style={{ borderRadius: "10px" }}
									name='logo-instagram'></ion-icon>
							</a>
						</li>
						<li>
							<a
								target='_blank'
								href='https://www.linkedin.com/in/anass-dabaghi-5a51141b6/'>
								<ion-icon
									style={{ borderRadius: "10px" }}
									name='logo-linkedin'></ion-icon>
							</a>
						</li>
						<li>
							<a
								target='_blank'
								href='mailto:anass.debbaghi123@gmail.com'>
								<ion-icon
									style={{ borderRadius: "8px" }}
									name='mail'></ion-icon>
							</a>
						</li>
					</ul>
				</div>
			</footer>
		</>
	);
}
