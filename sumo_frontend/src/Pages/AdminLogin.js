import React from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

function AdminLogin() {
    const [generalMessage, setGeneralError] = useState("");
    const [emailMessage, setEmailError] = useState("");
    const [passwordMessage, setPasswordError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = {
            email,
            password
        }
        axios
        .post("/auth/adminlogin", data)
        .then(res => {
            console.log(res);

            if(res.data.error) {
                if (res.data.error === "password_empty") {
                    setPasswordError("Password Empty");
                }
                else if (res.data.error === "invalid_password") {
                    setPasswordError("Invalid Password")
                }
                else if (res.data.error === "invalid_email") {
                    setEmailError("Invalid Email")
                }
                else if (res.data.error === "email_empty") {
                    setEmailError("Email Empty")
                }
                else if (res.data.error === "database_error") {
                    setGeneralError("Database Error")
                }
                else if (res.data.error === "user_not_found") {
                    setGeneralError("User not found");
                }
            }
            if (res.data.email) {
                localStorage.setItem('session', res.data);
                if(res.data.admin)
                {
                    window.location = "/Admin"
                }
                else
                {
                    window.location = "/Profile"
                }
            }
        })
        .catch(err => console.log(err));
    }

    return (
        
        <div className="LoginPage">
            <div className="Login">
                <div className="left">
                    <h1>SUMO</h1>
                </div>
                <div className="right">
                    <div className="form">
                        <h1>Admin Login</h1>
                        <p className="errorMessage">{generalMessage}</p>
                        <form onSubmit={handleLogin}>
                            <label htmlFor="email">Email
                                <input type="text" name="email" id="email" placeholder="Email" onChange={(e)=> {setEmail(e.target.value)}}/>
                                <p className="errorMessage">{emailMessage}</p>
                            </label>
                            <label htmlFor="password">Password
                                <input type="password" name="password" id="password" placeholder="Password" onChange={(e)=> {setPassword(e.target.value)}}/>
                                <p className="errorMessage">{passwordMessage}</p>
                            </label>
                            <button type="submit">Login</button>
                            
                        </form>
                        <Link to="" className="button donthaveaccount">Are you a customer?</Link>
                        <Link to="Expertlogin" className="button donthaveaccount">Are you an expert?</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
