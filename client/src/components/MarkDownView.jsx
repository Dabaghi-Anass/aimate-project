import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkDown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export function MarkDownView({ text, author }) {
	return (
		<ReactMarkDown
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeKatex, rehypeRaw]}
			className={`quote quote-bot${
				author === "user" ? " user-message" : ""
			}`}
			components={{
				code(props) {
					const { children, className, node, ...rest } = props;
					const match = /language-(\w+)/.exec(className || "");
					return match ? (
						<div className='code-block'>
							<span>{match[1]}</span>
							<SyntaxHighlighter
								customStyle={{
									fontSize: ".8rem",
								}}
								{...rest}
								PreTag='pre'
								children={String(children).replace(/\n$/, "")}
								language={match[1]}
								style={theme}
							/>
						</div>
					) : (
						<code {...rest} className={className}>
							{children}
						</code>
					);
				},
			}}>
			{text}
		</ReactMarkDown>
	);
}
