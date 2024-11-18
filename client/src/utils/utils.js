import removeMd from "remove-markdown";
import { v4 as uuidv4 } from "uuid";

/**
 * Removes code blocks (both inline and fenced) from a markdown string.
 * @param {string} markdown - The markdown string to process.
 * @returns {string} - The markdown string with code blocks removed.
 */
function removeCodeBlocks(markdown) {
	// Remove fenced code blocks (e.g., ``` or ~~~)
	let noFencedBlocks = markdown.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, "");

	// Remove inline code blocks (e.g., `inline code`)
	let cleanMarkdown = noFencedBlocks.replace(/`[^`]*`/g, "");

	return cleanMarkdown;
}
export function markdownToNormalText(mdText) {
	return removeMd(removeCodeBlocks(mdText));
}

export function uniqueId() {
	return uuidv4();
}
