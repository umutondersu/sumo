import React from 'react'
import './Header.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

function Header() {
    return (
        <>
            <div className="header">
                <h2><Link to="/Summary" className="Logo">SUMO</Link></h2>
                <div className="headerLinks">
                    <div className="headerCenter">
                        <ul>
                            <li><Link to="/Summary">SUMMARY</Link></li>
                            <li><Link to="/Profile">PROFILE</Link></li>
                            <li><Link to="/Calculation">CALCULATION</Link></li>
                            <li><Link to="/Advisor">ADVISOR</Link></li>
                            <li><Link to="/Stock">STOCK</Link></li>
                            <li><Link to="/Currency">CURRENCY</Link></li>
                        </ul>
                    </div>
                    
                    <a href="/" className="clientAreaButton"><Button variant="contained">EXIT</Button></a>
                </div>
                
            </div>
        </>
    )
}

export default Header
