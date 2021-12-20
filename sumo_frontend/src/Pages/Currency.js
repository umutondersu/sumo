import React from 'react';
import { useEffect, useState } from 'react';
import './Currency.css';
import axios from 'axios';
import Header from '../Components/General/Header';
import { DataGrid, GridToolbar  } from '@mui/x-data-grid';
import Avatar from 'react-avatar';


function Currency() {
    const [curData, setCurData] = useState([])

    const columns = [
        { field: 'id', headerName: 'Currency', width: 180 },
        { 
            field: 'value', 
            headerName: 'Value', 
            width: 180 
        },
    ];

    useEffect(() => {
        axios.get("https://freecurrencyapi.net/api/v2/latest?apikey=613c9950-5f45-11ec-b272-c73e03b9dfe3&base_currency=TRY").then((response) => {
            setCurData([])
            var c = []
            Object.keys(response.data.data).forEach(function(key) {
                var value = response.data.data[key];
                const data = {
                    id: key,
                    value: `${value}`
                }
                c = [...c, data];
            })
            setCurData(c);
            console.log(c);
        });
    }, []);

    const [profile, setProfile] = useState({});
    /*const [habits, setHabits] = useState([]);
    const [habitData, setHabitData] = useState([['Habit', 'Value']]);
    const [totalSpending, setTotalSpending] = useState(0);*/


    useEffect(() => {
        //setHabitData([['Habit', 'Value']]);
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


        
    }, []);

    return (
        <div className="CurrencyPage">
        <Header />
        <div className="Currency">
            <div className="currencyleft">
                <div className="profileInfo">
                    <div className="avatar">
                        <Avatar color="#44DD8C" name={profile.name} size="150" textSizeRatio={1.25}/>
                    </div>
                    <h2>{profile.name}</h2>
                    <h4>Income: {profile.income ? profile.income + "₺" : "Unknown"}</h4>
                    
                    <h4>Location: {profile.location ? profile.location : "Unknown"}</h4>
                </div>
            </div>
            <div className="currencyright">
            <DataGrid components={{
            Toolbar: GridToolbar,
            }}
            initialState={{
                filter: {
                    filterModel: {
                        items: [
                        {
                            columnField: 'id',
                            operatorValue: 'contains',
                            value: '',
                        },
                        ],
                    },
                },
            }}
            rows={curData} columns={columns} pageSize={100}/>
            </div>
        </div>
        
    </div>
    );
}

export default Currency;