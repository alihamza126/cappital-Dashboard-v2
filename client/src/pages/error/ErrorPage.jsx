import React from 'react'
import './error.scss'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const navigation=useNavigate();
    return (
        <div className="error-page">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="main">
                <h1>404</h1>
                <p>It looks like you're lost...<br />That's a trouble?</p>
                <button type="button" onClick={()=>navigation(-1)}>Go back</button>
                <br /> <br />
                <button type="button" onClick={()=>navigation('/')}>Goto Home Page</button>
            </div>
        </div>
    )
}

export default ErrorPage