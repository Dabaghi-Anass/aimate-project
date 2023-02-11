import useLocalStorage from "./useLocalStorage";

export function useAudio(onBoundary) {
    const synth = window.speechSynthesis
    function getVoiceCustomization() {
        let {get} = useLocalStorage()
        return get('options')
    }
    function getSpeechableText(text) {
        let speech = new SpeechSynthesisUtterance(text);
       let options = getVoiceCustomization()
        let voices = speechSynthesis.getVoices()
        let voice = voices?.find(voice => voice.name === options.voice)
        speech.voice = voice
        speech.rate = options.rate || 1
        speech.volume = options.volume || 1
        speech.pitch = options.pitch || 1
        
        speech.addEventListener("boundary" , onBoundary)
        return speech
    }
    return {
        speak: (text,permission) => {
            if(permission)  synth.speak(getSpeechableText(text))
        },
        speaking : synth.speaking
    }
}