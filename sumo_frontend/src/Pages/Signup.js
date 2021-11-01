import React from 'react'
import { Link } from 'react-router-dom'
import './Signup.css'

function Signup() {
    return (
        <div className="SignupPage">
            <div className="Signup">
                <div className="left">
                    <h1>SUMO</h1>
                </div>
                <div className="right">
                    <div className="form">
                        <h1>Signup</h1>
                        <form action="signup" method="post">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" id="username" placeholder="Username"/>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" placeholder="Email"/>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder="Password"/>
                            <label htmlFor="passwordrepeat">Password Repeat</label>
                            <input type="password" name="passwordrepeat" id="passwordrepeat" placeholder="Password Repeat"/>
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
