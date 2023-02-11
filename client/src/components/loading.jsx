import React from 'react'

const loading = ({pending}) => {
  return (
    <>
      {pending &&
        <div className='loading'>
          <span>Generating Response</span>
          <div>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          </div>
        </div>
      }
    </>
  )
}

export default loading