import React from "react";
import ReactDOM from "react-dom/client";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import translations from "./context/languages/translations.json";
import { ReactionContextProvider } from "./context/reaction";
import useLocalStorage from "./hooks/useLocalStorage";
import "./index.css";
let locale;
function getLanguage() {
	const { get } = useLocalStorage();
	const language = get("options")?.language;
	locale = language || navigator.language;
}
getLanguage();

ReactDOM.createRoot(document.getElementById("root")).render(
	// <React.StrictMode>
	<IntlProvider locale={locale} messages={translations[locale]}>
		<BrowserRouter>
			<ReactionContextProvider>
				<App />
			</ReactionContextProvider>
		</BrowserRouter>
	</IntlProvider>
	// </React.StrictMode>
);
