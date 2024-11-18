import React, { createContext, useState } from "react";

export const ReactionContext = createContext();

export const ReactionContextProvider = ({ children }) => {
	const [reaction, setReaction] = useState("happy");

	const changeReaction = (newValue) => {
		setReaction(newValue);
	};

	return (
		<ReactionContext.Provider value={{ reaction, changeReaction }}>
			{children}
		</ReactionContext.Provider>
	);
};
