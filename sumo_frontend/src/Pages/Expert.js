import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import './Expert.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
  }

function Expert() {

    const [profile, setProfile] = useState({});
    const [customers, setCustomers] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({});
    const [customerHabits, setCustomerHabits] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [value, setValue] = useState(0);
    const [selectedCustomerId, setCustomerId] = useState(-1);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleCustomerSelect = (event) => {
        event.preventDefault();
        setCustomerId(event.target.value);
        const userInfo = customers.filter((item) => {
            if (item.user_Id == event.target.value) {
                return item;
            }
        })[0];
        setCustomerInfo(userInfo);
    };

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.message.value);
        const data = {
            author: true,
            message: event.target.message.value,
            customer_Id: customerInfo.user_Id,
            expert_Id: profile.user_Id
        }
        axios.post("/admin/sendmessage", data).then((resp) => {
            axios.get("/admin/getconversation?id="+selectedCustomerId).then((response) => {
                setConversation(response.data);
            });
        });
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

        axios.get("/admin/getcustomers").then((response) => {
            setCustomers(response.data);
        });
    }, []);
    useEffect(() => {
        axios.get("/admin/getcustomers").then((response) => {
            setCustomers(response.data);
        });
        axios.get("/admin/getcustomerhabits?id="+selectedCustomerId).then((response) => {
            setCustomerHabits(response.data);
        });
        axios.get("/admin/getconversation?id="+selectedCustomerId).then((response) => {
            setConversation(response.data);
        });
    }, [selectedCustomerId]);

    useEffect(() => {
        axios.get("/admin/getconversation?id="+selectedCustomerId).then((response) => {
            setConversation(response.data);
        });
    }, [conversation]);

    return (
        <div className="ExpertPage">
            <div className="Expert">
                <div className="expertleft">
                    <h2>Assigned Customers:</h2>
                    {customers.length > 0 ?
                    <div className="customers">
                        {customers.map((item, i) => (
                            <div key={i} className="customerItem">
                                <button value={item.user_Id} onClick={handleCustomerSelect}>{item.name} - {item.email} {selectedCustomerId == item.user_Id ? "(Selected)" : ""}</button>
                            </div>
                            
                        ))}
                    
                    </div>
                    :
                    <h2>No Customers</h2>
                    }
                </div>
                <div className="expertright">
                <Box sx={{width: '100%'}}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="disabled">
                            <Tab label="Customer Info" {...a11yProps(0)}/>
                            <Tab label="Conversation" {...a11yProps(1)}/>
                        </Tabs>
                    </Box>
                </Box>
                <TabPanel value={value} index={0}>
                    {
                        selectedCustomerId == -1 ? "No Customer Selected" : 
                            <div className="customerInfo">
                                <p>
                                    Name: {customerInfo.name}
                                </p>
                                <p>
                                    Email: {customerInfo.email}
                                </p>
                                <p>
                                    Income: {!customerInfo.income ? "0₺" : customerInfo.income + "₺"}
                                </p>
                                <p>
                                    Location: {!customerInfo.location ? "Unknown" : customerInfo.location}
                                </p>
                                <p>
                                    Habits:
                                </p>
                                <ul>
                                    {customerHabits.length > 0 ? customerHabits.map((item,i) => (
                                        <li key={i}>Habit: {item.spending_Type} - Value: {item.spending_Value}</li>
                                    ))
                                    :
                                    "No Habits"
                                    }
                                </ul>
                                
                            </div>
                    }
                </TabPanel>
                <TabPanel value={value} index={1}>
                {
                    selectedCustomerId == -1 ? "No Customer Selected" : 
                    <>
                    <div className="conversation">
                        {
                            conversation.map((item, i) => (<div className={item.author ? "messageexpert" : "messagecustomer"}>
                                <p className={item.author ? "messageexpertcontent" : "messagecustomercontent"}>{item.message}</p>
                            </div>))
                        }
                        <div className="messagecustomer">
                            <p className="messagecustomercontent">Customer Message</p>
                        </div>
                    </div>
                    <div className="line"></div>
                    <form onSubmit={handleMessageSubmit}>
                        <label htmlFor="message">Message:</label>
                        <textarea id="message" name="message" className="messageInput"></textarea>
                        <button type="submit">Send</button>
                    </form>
                    </>
                }
                </TabPanel>
                </div>
            </div>            
        </div>
    )
}

export default Expert
