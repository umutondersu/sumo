import React from 'react'
import { Link} from 'react-router-dom'
import './Signup.css'
import { useState, useEffect } from 'react'

function Signup() {

    const error = new URLSearchParams(window.location.search).get("error")
    const [emailMessage, setEmailError] = useState("");
    const [passwordMessage, setPasswordError] = useState("");

    useEffect(() => {
        if (error === "password_mismatch") {
            setPasswordError("Password Mismatch");
        }
        if (error === "password_empty") {
            setPasswordError("Password E");
        }
        else if (error === "email_exists") {
            setEmailError("Email Exists")
        }
        else if (error === "invalid_email") {
            setEmailError("Invalid Email")
        }
    },[error]);
    
    return (
        <div className="SignupPage">
            <div className="Signup">
                <div className="left">
                    <h1>SUMO</h1>
                </div>
                <div className="right">
                    <div className="form">
                        <h1>Signup</h1>
                        <form action='auth/signup' method="post">
                            <div className="input-group">
                                <div className="name">
                                    <label htmlFor="name">Name (Optional)
                                        <input type="text" name="name" id="name" placeholder="Name"/>
                                    </label>
                                </div>
                                <div className="surname">
                                    <label htmlFor="surname">Surname (Optional)
                                        <input type="text" name="surname" id="surname" placeholder="Surname"/>
                                    </label>
                                </div>
                            </div>
                            <label htmlFor="email">Email
                                <input type="email" name="email" id="email" placeholder="Email"/>
                                <p className="errorMessage">{emailMessage}</p>
                            </label>
                            <label htmlFor="password">Password
                                <input type="password" name="password" id="password" placeholder="Password"/>
                                <p className="errorMessage">{passwordMessage}</p>
                            </label>
                            <label htmlFor="passwordrepeat">Password Repeat
                                <input type="password" name="passwordrepeat" id="passwordrepeat" placeholder="Password Repeat"/>
                                <p className="errorMessage">{passwordMessage}</p>
                            </label>
                            <button type="submit">Sign Up</button>
                        </form>
                        <Link to="" className="button alreadyhaveaccount">Already have an account?</Link>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    )
}

export default Signup
