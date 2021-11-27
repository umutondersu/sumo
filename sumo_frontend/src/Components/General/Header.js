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
                        <li><Link to="/SUMMARY">SUMMARY</Link></li>
                        <li><Link to="/CALCULATION">CALCULATION</Link></li>
                        <li><Link to="/ADVISOR">ADVISOR</Link></li>
                        <li><Link to="/PROFILE">PROFILE</Link></li>
                    </ul>
                    <a href="/Panel" className="clientAreaButton"><Button variant="contained">EXIT</Button></a>
                </div>
                
            </div>
        </>
    )
}

export default Header
