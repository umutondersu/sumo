import React from 'react'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import './Profile.css'
import axios from 'axios';

function Profile() {

    const [profile, setProfile] = useState({});

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("/auth/isLogin").then((response) => {
            if (response.data.loggedIn === true) {
                setProfile(response.data.user);
            }
            else {
                window.location = "/"
            }
        });
    }, []);

    return (
        <div className="ProfilePage">
            <div className="Profile">
                <div className="top">
                    <Avatar color="#44DD8C" name={profile.name} size="71" textSizeRatio={1.5}/>
                    <h2>Name: {profile.name}</h2>
                    <h2>Email: {profile.email}</h2>
                </div>
                <div className="bottom">

                </div>
            </div>
        </div>
    )
}

export default Profile
