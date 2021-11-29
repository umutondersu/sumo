import React from 'react'
import './Header.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

function Header() {
    return (
        <>
            <div className="header">
                <h2><Link to="/" className="Logo">SUMO</Link></h2>
                <div className="headerLinks">
                    <ul>
                        <li><Link to="/">SWITCH ACCOUNT</Link></li>
                        <li><Link to="/Profile">PROFILE</Link></li>
                        <li><Link to="/Summary">SUMMARY</Link></li>
                        <li><Link to="/Calculation">CALCULATION</Link></li>
                        <li><Link to="/Advisor">ADVISOR</Link></li>

                        
                    </ul>
                    <a href="/" className="clientAreaButton"><Button variant="contained">EXIT</Button></a>
                </div>
                
            </div>
        </>
    )
}

export default Header
