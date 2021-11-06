import React from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Login() {

    const error = new URLSearchParams(window.location.search).get("error")
    const [databaseMessage, setDatabaseError] = useState("");
    const [emailMessage, setEmailError] = useState("");
    const [passwordMessage, setPasswordError] = useState("");

    useEffect(() => {
        if (error === "password_empty") {
            setPasswordError("Password Empty");
        }
        else if (error === "invalid_password") {
            setPasswordError("Invalid Password")
        }
        else if (error === "invalid_email") {
            setEmailError("Invalid Email")
        }
        else if (error === "email_empty") {
            setEmailError("Email Empty")
        }
        else if (error === "database_error") {
            setDatabaseError("Database Error")
        }
    },[error]);

    return (
        <div className="LoginPage">
            <div className="Login">
                <div className="left">
                    <h1>SUMO</h1>
                </div>
                <div className="right">
                    <div className="form">
                        <h1>Login</h1>
                        <p className="errorMessage">{databaseMessage}</p>
                        <form action="auth/login" method="post">
                            <label htmlFor="email">Email
                                <input type="text" name="email" id="email" placeholder="Email"/>
                                <p className="errorMessage">{emailMessage}</p>
                            </label>
                            <label htmlFor="password">Password
                                <input type="password" name="password" id="password" placeholder="Password"/>
                                <p className="errorMessage">{passwordMessage}</p>
                            </label>
                            <button type="submit">Sign In</button>
                            
                        </form>
                        <Link to="Signup" className="button donthaveaccount">Don't have an account?</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
