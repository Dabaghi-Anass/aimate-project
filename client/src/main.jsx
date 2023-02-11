import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from 'react-intl';
import translations from "./context/languages/translations.json"
import './index.css'
import useLocalStorage from './hooks/useLocalStorage';

let locale
function getLanguage() {
  const { get } = useLocalStorage()
  const language = get("options")?.language;
  locale = language || navigator.language;
}
getLanguage()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IntlProvider locale={locale} messages={translations[locale]}>
       <BrowserRouter>
          <App />
       </BrowserRouter>
   </IntlProvider>
  </React.StrictMode>
)
