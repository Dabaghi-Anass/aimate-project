import axios from "axios";

// const APP_URL = import.meta.env["VITE_REACT_APP_BASE_URL"];
const APP_URL = "http://localhost:4040";

export const fetchStreamedResponse = async (
	userMessage,
	{ onChunk, onFinish, onError }
) => {
	let botResponse = "";
	try {
		const response = await axios.post(
			APP_URL,
			{ prompt: userMessage },
			{ responseType: "stream" }
		);

		if (response.status === 500) {
			onError("server error");
			return;
		}

		for await (const chunk of response.data) {
			botResponse += chunk;
			onChunk(chunk);
		}
		onFinish(botResponse);
	} catch (error) {
		onError("transmition error " + error.message);
	}
};
