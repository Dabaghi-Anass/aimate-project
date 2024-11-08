import removeMd from "remove-markdown";
import { v4 as uuidv4 } from "uuid";
export function markdownToNormalText(mdText) {
	return removeMd(mdText);
}

export function uniqueId() {
	return uuidv4();
}
