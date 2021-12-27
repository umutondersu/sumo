import React from 'react'
import './AdminHeader.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

function AdminHeader() {
    return (
        <>
            <div className="Adminheader">
                <h2><Link to="/" className="Logo">SUMO</Link></h2>
                <div className="AdminheaderLinks">
                    <a href="/" className="clientAreaButton"><Button variant="contained">EXIT</Button></a>
                </div>
                
            </div>
        </>
    )
}

export default AdminHeader
