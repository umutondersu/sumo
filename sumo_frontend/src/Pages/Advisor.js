import React from 'react'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import './Advisor.css'
import axios from 'axios';
import Header from '../Components/General/Header';
import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { createTheme } from '@mui/material/styles';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const theme = createTheme({
  palette: {
    primary: {
      light: '#2C905B',
      main: '#2C905B',
      dark: '#2C905B',
      contrastText: '#fff',
    },
  },
});
const themelight = createTheme({
    palette: {
      primary: {
          light: '#44dd8c',
          main: '#44dd8c',
          dark: '#44dd8c',
          contrastText: '#000',
        },
    },
  });


function Advisor() {
    
    const [profile, setProfile] = useState({});
    const [conversation, setConversation] = useState([]);
    const [pinned, setPinned] = useState([]);
    const [pinsChanged, setPinschanged] = useState(0);
    const handleChange = (event, newValue) => {
        const data = {
            conversation_Id: event.target.value,
            pinned: event.target.checked
        }
        axios.post("/admin/setpinned", data).then((resp) => {
            axios.get("/admin/getconversation?id="+profile.user_Id).then((response) => {
                setConversation(response.data);
            });
            const p = pinsChanged+1;
            setPinschanged(p);
        });

    };

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.message.value);
        if(event.target.message.value.length == 0) return;
        const data = {
            conversation_Id: 0,
            author: false,
            message: event.target.message.value,
            customer_Id: profile.user_Id,
            expert_Id: profile.expert_Id,
            pinned: false
        }
        axios.post("/admin/sendmessage", data).then((resp) => {
            axios.get("/admin/getconversation?id="+profile.user_Id).then((response) => {
                setConversation(response.data);
            });
        });
        const conv = [...conversation, data];
        setConversation(conv);
        event.target.message.value = "";
    }


    useEffect(() => {
        axios.get("/auth/isLogin").then((response) => {
            if (response.data.loggedIn === true) {
                setProfile(response.data.user);
            }
            else {
                window.location = "/"
            }
        });
        
        axios.get("/auth/profile").then((response) => {
            setProfile(response.data);
            axios.get("/admin/getconversation?id="+response.data.user_Id).then((resp) => {

                setPinned([]);
                var p =[];
                resp.data.map((item) => {
                    if(item.pinned) {
                        p = [...p, item];
                        
                    }
                })
                setPinned(p);
                setConversation(resp.data);
            });
        });

    }, []);

    useEffect(() => {

        axios.get("/admin/getconversation?id="+profile.user_Id).then((resp) => {

            setPinned([]);
            var p =[];
            resp.data.map((item) => {
                if(item.pinned) {
                    p = [...p, item];
                    
                }
            })
            setPinned(p);
            setConversation(resp.data);
        });
        

    }, [pinsChanged]);


    
    return (
        <div className="AdvisorPage">
            <Header />
            <div className="Advisor">
                <div className="advisorleft">
                    <div className="profileInfo">
                        <div className="avatar">
                            <Avatar color="#44DD8C" name={profile.name} size="150" textSizeRatio={1.25}/>
                        </div>
                        <h2>{profile.name}</h2>
                        <h4>Income: {profile.income ? profile.income + "₺" : "Unknown"}</h4>
                        <h4>Location: {profile.location ? profile.location : "Unknown"}</h4>
                    </div>
                </div>
                <div className="advisorright">
                    <div className="advisorchat">
                        <div className="conversation">
                            <div className="chatlabel">Chat</div>
                            {
                                conversation.map((item, i) => (<div key={i} className={item.author ? "advisormessageexpert" : "advisormessagecustomer"}>
                                    <p className={item.author ? "messageexpertcontent" : "messagecustomercontent"}>{item.message} {item.author ? <Checkbox
                                        {...label}
                                        theme={theme}
                                        icon={<BookmarkBorderIcon />}
                                        checked={item.pinned ? true : false}
                                        onChange={handleChange}
                                        value={item.conversation_Id}
                                        checkedIcon={<BookmarkIcon />}
                                    />
                                    : ""}</p>
                                </div>))
                            }
                        </div>
                        <div className="line"></div>
                        <form onSubmit={handleMessageSubmit}>
                            <label htmlFor="message">Message:</label>
                            <textarea id="message" name="message" className="messageInput"></textarea>
                            <Button type="submit" variant="contained" theme={themelight} endIcon={<SendIcon />}>
                                Send
                            </Button>
                        </form>
                    </div>
                    <div className="advisorpins">
                        <div className="pinslabel">Bookmarked Messages</div>
                        <div className="pinned">
                            {
                                pinned.map((item, i) => (
                                    <p key={i} className="pinnedmessage">{item.message}
                                    <Checkbox
                                    {...label}
                                    theme={theme}
                                    icon={<BookmarkBorderIcon />}
                                    onChange={handleChange}
                                    checked={true}
                                    value={item.conversation_Id}
                                    checkedIcon={<BookmarkIcon />}
                                    />
                                    </p>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Advisor
