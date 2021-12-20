import React from 'react'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import './Calculation.css'
import axios from 'axios';
import Header from '../Components/General/Header';
import Chart from "react-google-charts";

function Calculation() {
    
    const [profile, setProfile] = useState({});
    const [income, setIncome] = useState(0);
    const [saving, setSaving] = useState(20);
    const [hobbies, setHobbies] = useState(10);
    const [home, setHome] = useState(70);
    const [calc, setCalc] = useState([['Month', 'Saved']]);
    const [calcPercent, setCalcPercent] = useState([['Category', 'Value']])
    const dates = [1, 2, 3, 6, 9, 12]

    const handleIncomeChange = (event) => {
        setIncome(event.target.value);
    }
    const handleSavingChange = (event) => {
        const a = parseInt(event.target.value) + hobbies + home;
        if (a > 100) {
            event.target.value = parseInt(100 - home - hobbies);
            setSaving(parseInt(100 - home - hobbies));
        }
        else {
            setSaving(parseInt(event.target.value))
        }
    }
    const handleHobbiesChange = (event) => {
        const a = parseInt(event.target.value) + saving + home;
        if (a > 100) {
            event.target.value = parseInt(100 - home - saving);
            setHobbies(parseInt(100 - home - saving));
        }
        else {
            setHobbies(parseInt(event.target.value))
        }
    }
    const handleHomeChange = (event) => {
        const a = parseInt(event.target.value) + hobbies + saving;
        if (a > 100) {
            event.target.value = parseInt(100 - saving - hobbies);
            setHome(parseInt(100 - saving - hobbies));
        }
        else {
            setHome(parseInt(event.target.value))
        }
        
    }

    const calculate = (income, saving) => {
        var x = [['Month', 'Saved']];
        dates.map((item, i) => (
            x = [...x, [
                item+" Month", parseInt(income*(saving/100)*item)
            ]]
        ))
        setCalc(x);
    }
    const calculatePercents = (income, saving, home, hobbies) => {
        var x = [['Category', 'Value']]
        if (parseInt(saving + home + hobbies) < 100) {
            x = [...x, ["Other", parseInt(income*((100-home-saving-hobbies)/100))]]
        }
        x = [...x, ["Saving", parseInt(income*(saving/100))]];
        x = [...x, ["Expenses", parseInt(income*(home/100))]];
        x = [...x, ["Personal Use", parseInt(income*(hobbies/100))]];
        setCalcPercent(x);
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
            setIncome(response.data.income);
        });
        calculate(income, saving);
        calculatePercents(income, saving, home, hobbies);
    }, []);


    useEffect(() => {
        calculate(income, saving);
        calculatePercents(income, saving, home, hobbies);
    }, [income, saving, home, hobbies]);


    
    return (
        <div className="CalculationPage">
            <Header />
            <div className="Calculation">
                <div className="calculationleft">
                    <div className="profileInfo">
                        <div className="avatar">
                            <Avatar color="#44DD8C" name={profile.name} size="150" textSizeRatio={1.25}/>
                        </div>
                        <h2>{profile.name}</h2>
                        <h4>Income: {profile.income ? profile.income + "₺" : "Unknown"}</h4>
                        <h4>Location: {profile.location ? profile.location : "Unknown"}</h4>
                    </div>
                </div>
                <div className="calculationright">
                    <h3>Recommended plan is already given.</h3>
                    <div>
                        <div className="calculationrightleft">
                            <div className="chart">
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="LineChart"
                                    loader={<div>Loading Chart</div>}
                                    data={calc}
                                    options={{
                                        title: `Savings Chart`,
                                        hAxis: {
                                        title: 'Month',
                                        },
                                        vAxis: {
                                        title: 'Saved',
                                        },
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                    />
                            </div>
                            <div className="chart">
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={calcPercent}
                                    options={{
                                        title: `Spendings Chart`,
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                    />
                            </div>
                            
                        </div>
                        <div className="calculationrightright">
                            <div className="calcinput">
                                <h3 className="calculationinputlabel">Income %:</h3>
                                <input type="number"  onChange={handleIncomeChange} value={income}/>
                            </div>
                            <div className="calcinput">
                                <h3 className="calculationinputlabel">Saving %:</h3>
                                <input type="number" onChange={handleSavingChange} defaultValue={saving}/>
                            </div>
                            <div className="calcinput">
                                <h3 className="calculationinputlabel">Expenses %:</h3>
                                <input type="number" onChange={handleHomeChange} defaultValue={home}/>
                            </div>
                            <div className="calcinput">
                                <h3 className="calculationinputlabel">Personal Use %:</h3>
                                <input type="number" onChange={handleHobbiesChange} defaultValue={hobbies}/>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}

export default Calculation
