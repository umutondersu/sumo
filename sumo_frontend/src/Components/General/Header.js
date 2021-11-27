import React from 'react'
import './Header.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

function Header() {
    return (
        <>
            <div className="header">
                <h2><Link to="/" className="Logo">Team.Aleria</Link></h2>
                <div className="headerLinks">
                    <ul>
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/Store">STORE</Link></li>
                        <li><Link to="/About">ABOUT</Link></li>
                        <li><Link to="/Contact">CONTACT</Link></li>
                        <li><Link to="/Dashboard">Dashboard</Link></li>
                    </ul>
                    <a href="/Panel" className="clientAreaButton"><Button variant="contained">Client Area</Button></a>
                </div>
                
            </div>
        </>
    )
}

export default Header
