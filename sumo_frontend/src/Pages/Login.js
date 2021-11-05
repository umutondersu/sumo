import React from 'react'
import './Login.css'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <div className="LoginPage">
            <div className="Login">
                <div className="left">
                    <h1>SUMO</h1>
                </div>
                <div className="right">
                    <div className="form">
                        <h1>Login</h1>
                        <form action="login" method="post">
<<<<<<< HEAD
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" id="email" placeholder="Email"/>
=======
                            <label htmlFor="username/email">Username / Email</label>
                            <input type="text" name="username/email" id="username/email" placeholder="Username / Email"/>
>>>>>>> 9e4f80da597985332bc72463ebe671cc0e07b2b4
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder="Password"/>
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
