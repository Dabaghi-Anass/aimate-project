import React from "react";
import { Route, Routes } from "react-router-dom";
import ConversationPage from "./pages/conversation-page";
import Home from "./pages/home_page";
import NotFound from "./pages/not_found";
import Settings from "./pages/settings";
function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/chat' element={<ConversationPage />} />
				<Route path='/settings' element={<Settings />}></Route>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
