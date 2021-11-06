import React from 'react'
import { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import './Profile.css'
import axios from 'axios';

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {

    if (name.contains(" ")) {
        return {
            sx: {
            bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    else {
        return {
            sx: {
            bgcolor: stringToColor(name),
            },
            children: `${name[0]}}`,
        };
    }
}

function Profile() {

    const [profile, setProfile] = useState({});

    useEffect(() => {

        console.log(localStorage.getItem('accessToken'));
        axios.get("/auth/profile", {
            Authorization: localStorage.getItem('accessToken')
        }).then(response => {
            setProfile(response.data);
        });
    },[]);

    return (
        <div className="ProfilePage">
            <div className="Profile">
                <div className="top">
                    <h2>{profile.name}</h2>
                </div>
                <div className="bottom">

                </div>
            </div>
        </div>
    )
}

export default Profile
