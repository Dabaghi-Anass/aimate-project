import React, { useEffect, useState } from "react";
import logoImage from "../assets/images/settings_image.svg";
import tryImage from "../assets/images/try_button.svg";
import NavBar from "../components/navbar";
import Select from "../components/select";
import RangeInput from "../components/RangeInput";
import useLocalStorage from "../hooks/useLocalStorage"
import { FormattedMessage } from "react-intl"

const Settings = () => {
  const [options, setOptions] = useState({});
  const [error, setError] = useState(0);
  const [testText, setTestText] = useState("");
  const [permission, setPermission] = useState();
  const { get, post, checkIfExist } = useLocalStorage();

  async function setVoice(name) {
    setOptions(prev => ({
      ...prev,
      voice : name
    }))
}
  function handleChange({ currentTarget }) {
    if (currentTarget.name === "voice") {
      return setVoice(currentTarget.value)
    }
    setOptions(prev => ({
      ...prev,
      [currentTarget.name] : +currentTarget.value || currentTarget.value
    }))
  }
  async function playTestText() {
    let { rate, volume, pitch, permission, voice: voiceName, language } = options;
    let voices = await getVoices();
    let voice = await voices.find(voice => voice.name === voiceName);
    if(!permission) return
    const speech = new SpeechSynthesisUtterance();
    speech.rate = rate.toFixed(2)
    speech.text = testText.trim()
    speech.voice = voice
    speech.lang = language
    speech.volume = volume.toFixed(2);
    speech.pitch = pitch.toFixed(2);
    let synth = window.speechSynthesis;
    synth.cancel()
    synth.speak(speech);
  }
  function togglePermission() {
    setPermission(!permission)
    setOptions(prev => ({
      ...prev,
     permission : !permission
    }))
  }
function getVoices() {
    return new Promise(
      function (resolve, reject) {
        let synth = window.speechSynthesis;
        let id;
        id = setInterval(() => {
          if (synth.getVoices().length !== 0) {
            resolve(synth.getVoices());
            clearInterval(id);
          }
        }, 10);
      }
    )
  }
  async function loadVoices() {
    let voices = await getVoices();
    let filtredVoices = await voices.filter(voice => voice.lang === options.language ?? "en-US");
    if (filtredVoices.length === 0) filtredVoices = [voices[0]]
    let optionsVoice = options.voice;
    let voice;
    let voiceToFind = voices.find(voice => voice.name === optionsVoice)
    if (filtredVoices.includes(voiceToFind))
      voice = optionsVoice;
    else voice = filtredVoices[0].name
    setOptions(prev => ({
      ...prev,
      voice: voice,
      voices: filtredVoices
    }))
  }

  async function loadLanguages() {
    let languages = []
    let voices = await getVoices();
    const langsNames = new Intl.DisplayNames([options.language|| document.documentElement.getAttribute("lang") || "en"], { type: 'language' });
    for (let voice of voices) {
      let lng = { name: langsNames.of(voice.lang), value: voice.lang }
      if (!languages.find(e => e.value === voice.lang))
      {
        languages.push(lng);
      }
    }
    languages.push({ name: langsNames.of("ar"), value: "ar" })
    setOptions(prev => ({
      ...prev,
      languages
    }))
  }
  async function loadOptions() {
    let exist = checkIfExist("options");
    if (!exist) {
      let option = {
        rate: 1,
        pitch: 1,
        volume: 1,
        permission: true,
        voice: "Microsoft David - English (United States)",
        language: navigator.language || document.querySelector("html")?.lang || "en-US",
        default : true
      };
      post("options", option);
      setOptions(prev => (option))
    }
    else {
      let optionsFromLocalStorage = get("options");
      let empty = checkEmptyObject(optionsFromLocalStorage)
      if (empty) return;
      setOptions(prev => optionsFromLocalStorage);
      setPermission((prev) => optionsFromLocalStorage.permission)
    }
  }
  function checkEmptyObject(object) {
    if(!object || {...object} == {}) return true
    for (let prop in object) {
      if (object[prop]) return false;
    }
    return true
  }
  useEffect(() => {
    loadOptions()
    loadVoices()
    loadLanguages()
  }, [])
  const changeLang = (languageCode) => {
    if(!languageCode) return
    document.documentElement.setAttribute("lang", languageCode);
  };
  useEffect(() => {
    let empty = checkEmptyObject(options)
    if (empty) return;
    let optionsClone = { ...options }
    delete optionsClone.languages
    delete optionsClone.voices
    post("options",optionsClone)
  },[options])
  useEffect(() => {
    changeLang(options.language)
    loadVoices()
    loadLanguages()
    setError(prev => prev + 1)
  },[options.language])

  return (
    <>
      <NavBar theme="dark"></NavBar>
      <div className="page settings-container">
        <fieldset>
          <legend>
            <FormattedMessage id="app.settings-heading" defaultMessage="Settings"/>
            </legend>
          <legend className="legend-image">
            <img src={logoImage} alt="" />
          </legend>
          <section className="form-group">
            <h4 className="title">
               <FormattedMessage id="app.settings-language-heading" defaultMessage="language"/>
            </h4>

            <div className="form-control">
              <Select
                label={
                  <FormattedMessage id="app.settings-select-language" defaultMessage="select language" />
                }
                disabled={!permission}
                value={options.language || "en"}
                onChange={(e) => handleChange(e)}
                name="language"
                options={options.languages || []}
              />
              {
                error >= 3
                &&
                <p className="warning">
                <FormattedMessage id='app.require-refresh' defaultMessage="language changes detected please refresh the page to apply changes" />
                <span className="icon">&#9888;</span>
                </p>
              }
              {error >= 3 &&
                <button className="btn btn-warning" onClick={() => {
                window.location.pathname = "/"
              }}>refresh</button>}
            </div>
            <div className="form-control">
              <input
                type="text"
                disabled={!permission}
                value={testText}
                onInput={(e) => {
                  setTestText(e.target.value);
                }}
                placeholder="text to try your configuration"
                className="test-input"
                style={{
                  padding: "1rem",
                }}
              />
            </div>
            <div className="form-control try-img-container">
              <img
                src={tryImage}
                alt="click"
                disabled={!permission}
                className="try-btn"
                onClick={playTestText}
              />
            </div>
          </section>
          <section className="form-group">
            <h4 className="title">
              <FormattedMessage
                id="app.settings-voice-heading"
                defaultMessage="voice"
              />
              </h4>
            <div className="form-control check-container">
              <label htmlFor="check-voice">
                 <FormattedMessage
                id="app.settings-disable-voice"
                defaultMessage="disable voice"
              /></label>
              <input
                type="checkbox"
                name="check-voice"
                id="check-voice"
                checked={!permission}
                onChange={togglePermission}
              />
            </div>
            <div className="form-control">
              <Select
                 label={
                  <FormattedMessage id="app.settings-select-voice" defaultMessage="select voice" />
                }
                value={options.voice}
                name="voice"
                onChange={(e) => handleChange(e)}
                options={options.voices || []}
                disabled={!permission}
              />
            </div>
            <div className="form-control">
              <label className="settings-labels" htmlFor="rate">
                <FormattedMessage
                  id="app.settings-rate"
                  defaultMessage="Rate"
                />
                </label>
              <RangeInput
                name="rate"
                value={options.rate ?? 0}
                onChange={(e) => handleChange(e)}
                disabled={!permission}
              />
            </div>
            <div className="form-control">
              <label className="settings-labels" htmlFor="pitch">
                <FormattedMessage
                  id="app.settings-pitch"
                  defaultMessage="Pitch"
                /></label>
              <RangeInput
                value={options.pitch ?? 0}
                name="pitch"
                onChange={(e) => handleChange(e)}
                disabled={!permission}
              />
            </div>
            <div className="form-control">
              <label className="settings-labels" htmlFor="volume">
                <FormattedMessage
                  defaultMessage="Volume"
                  id="app.settings-volume"
                />
              </label>
              <RangeInput
                value={options.volume ?? 0}
                name="volume"
                onChange={(e) => handleChange(e)}
                disabled={!permission}
              />
            </div>
          </section>
        </fieldset>
      </div>
    </>
  );
};
export default Settings;
