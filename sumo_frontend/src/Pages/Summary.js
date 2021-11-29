import React from 'react'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import './Summary.css'
import axios from 'axios';
import Header from '../Components/General/Header';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Chart from "react-google-charts";

function Summary() {

    const [profile, setProfile] = useState({});
    const [habits, setHabits] = useState([]);
    const [habitData, setHabitData] = useState([['Habit', 'Value']]);
    const [totalSpending, setTotalSpending] = useState(0);


    useEffect(() => {
        setHabitData([['Habit', 'Value']]);
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
        });


        axios.get("/auth/habits").then((response) => {
            setHabits(response.data);
            
            if(response.data.length > 0) {
                var habitD = [...habitData]
                var total = totalSpending;
                response.data.map((item, i) => (
                    habitD = [...habitD, [item.spending_Type, parseInt(item.spending_Value)]],
                    total = total+parseInt(item.spending_Value)
                ))
                setTotalSpending(total);
                setHabitData(habitD);
            }
        });
    }, []);

    return (
        <div className="SummaryPage">
            <Header />
            <div className="Summary">
                <div className="summaryleft">
                    <div className="profileInfo">
                        <div className="avatar">
                            <Avatar color="#44DD8C" name={profile.name} size="150" textSizeRatio={1.25}/>
                        </div>
                        <h2>{profile.name}</h2>
                        <h4>Income: {profile.income ? profile.income + "₺" : "Unknown"}</h4>
                        <h4>Subscription: {profile.subscription ? "Subscribed" : "Not Subscribed"}</h4>
                        <h4>Location: {profile.location ? profile.location : "Unknown"}</h4>
                    </div>
                </div>
                <div className="summaryright">
                <div>
                <Chart
                    width={'500px'}
                    height={'300px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={habitData}
                    options={{
                        title: `Spending Habit Summary \nIncome: ${profile.income}₺, \nTotal Spending: ${totalSpending}₺`,
                    }}
                    rootProps={{ 'data-testid': '1' }}
                    />
                </div>
                <div>
                    
                </div>
                </div>
            </div>
            
        </div>
    )
}

export default Summary
