import React from 'react'
import { Link } from 'react-router-dom'
import {FormattedMessage} from "react-intl"
import NotFoundIcon from "../assets/icons/404.svg"
const NotFound = () => {
  function goBack() {
    history.go(-1)
  }
  return (
    <div className='not-found-page'>
      <div>
          <div className='head'>
        <img src={NotFoundIcon} alt="not-found-img" />
        <h1>404 not found !</h1>
      </div>
      <p>
<FormattedMessage id='app.not-found-message' defaultMessage="the page you are looking for is inexistent please check you spelled the url correctly"/>
         </p>
      <div className="btns">
        <button onClick={goBack} className='btn back-btn'><ion-icon name="return-up-back"></ion-icon>
          <FormattedMessage
        id='app.back'    defaultMessage="back" /></button>
        <Link to="/" className='btn return-btn'>
          <FormattedMessage id='app.home' defaultMessage="return to home page"/>
      </Link>
    </div>
    </div>
    </div>
  )
}

export default NotFound