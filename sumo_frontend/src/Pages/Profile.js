import React from 'react'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import './Profile.css'
import axios from 'axios';
import Header from '../Components/General/Header';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { createTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


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

function Profile() {

    const [profile, setProfile] = useState({});
    const [value, setValue] = useState(0);
    const [habits, setHabits] = useState([]);
    const [editHabits, setEditHabits] = useState(false);
    const [addCount, setAddCount] = useState(-1);
    const [editIncome, setEditIncome] = useState(false);
    const [editLocation, setEditLocation] = useState(false);
    const [newarr, setNewArr] = useState([]);
    const [oldarr, setOldArr] = useState([]);
    const [profileIncome, setProfileIncome] = useState(false);
    const [profileHabits, setProfileHabits] = useState(false);
    const [showAlert, setShowAlert] = useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTypeChange = (event) => {
        const hab = [...habits];
        const obj =  hab.filter((element) => {
            if (element.habit_Id == event.target.id.replace("type_", "")) {
                return element;
            }
        })
        var index = hab.indexOf(obj[0]);
        obj[0]["spending_Type"] = event.target.value;
        hab[index] = obj[0];

        setHabits(hab);
    }
    const handleValueChange = (event) => {
        const hab = [...habits];
        const obj =  hab.filter((element) => {
            if (element.habit_Id == event.target.id.replace("value_", "")) {
                return element;
            }
        })
        var index = hab.indexOf(obj[0]);
        obj[0]["spending_Value"] = event.target.value;
        hab[index] = obj[0];

        console.log(hab);
        setHabits(hab);
    }

    const handleIncomeEdit = (event) => {
        event.preventDefault();
        const income = event.target.elements.income.value;
        if (income) {
            axios.post("/profile/editincome", {income}).then((resp) => {
                axios.get("/auth/profile").then((response) => {
                    setProfile(response.data);
                });
            });
            setEditIncome(false);
        }
    }
    const handleLocationEdit = (event) => {
        event.preventDefault();
        const location = event.target.elements.location.value;
        if (location) {
            axios.post("/profile/editlocation", {location}).then((resp) => {
                axios.get("/auth/profile").then((response) => {
                    setProfile(response.data);
                });
            });
            setEditLocation(false);
        }
    }

    const closeAlert = (event) => {
        setShowAlert(false);
    }

    const handleEditSubmit = (event) => {
        event.preventDefault();

        console.log(event.target.length);
        for(let i = 0;  i< event.target.length-2; i = i+3) {
            if (event.target[i].id.includes('-')) {
                newarr.push({
                    habit: event.target[i].value,
                    value: event.target[i+1].value
                });
                
            }
            else {
                oldarr.push({
                    habit_Id: event.target[i].id.replace("type_", ""),
                    habit: event.target[i].value,
                    value: event.target[i+1].value
                });
            }
        }
        axios.post("/profile/edithabits", {newarr, oldarr});
        setNewArr([]);
        setOldArr([]);
        axios.get("/auth/habits").then((response) => {
            setHabits(response.data);
        });
        setEditHabits(false);
        
    }

    const handleIncomeChange = (event) => {
        const prof = {...profile};
        prof["income"] = event.target.value;
        setProfile(prof);
    }

    const handleLocationChange = (event) => {
        const prof = {...profile};
        prof["location"] = event.target.value;
        setProfile(prof);
    }

    const toggleEditHabits = (event) => {
        if(editHabits) {
            axios.get("/auth/habits").then((response) => {
                setHabits(response.data);
            });
            setAddCount(-1);
        }
        setEditHabits(!editHabits);
    }

    const toggleEditIncome = (event) => {
        if(editIncome) {
            axios.get("/auth/profile").then((response) => {
                setProfile(response.data);
            });
        }
        setEditIncome(!editIncome);
    }
    const toggleEditLocation = (event) => {
        if(editLocation) {
            axios.get("/auth/profile").then((response) => {
                setProfile(response.data);
            });
        }
        setEditLocation(!editLocation);
    }

    const addHabit = () => {
        setHabits([...habits, {habit_Id: addCount, customer_Id: -1, spending_Type: "", spending_Value: 0}]);
        setAddCount(addCount-1);
    }


    axios.defaults.withCredentials = true;
    const removeHabit = (event) => {
        event.preventDefault();
        var habit_Id = event.target.value;
        if (habit_Id < 0) {
            console.log(habit_Id)

            setHabits(habits.filter((item) => {
                if (item.habit_Id != habit_Id) {
                    return item;
                }
            }));
            
        }
        else {
            const data = {
                habit_Id
            }
            axios.post("/profile/remove", data).then((response) => {
                if (response.data.success) {
                    axios.get("/auth/habits").then((response) => {
                        setHabits(response.data);
                    });
                }
            });
        }
        
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
            if(!response.data.income || response.data.income == 0) {
                setProfileIncome(true);
            }
        });


        axios.get("/auth/habits").then((response) => {
            setHabits(response.data);
            if(response.data.length === 0) {
                setProfileHabits(true);
            }
        });

        setShowAlert(true);
    }, []);
    useEffect(() => {
        setHabits(habits);
    }, [habits])
    useEffect(() => {
        setProfile(profile);
    
    }, [profile])


    return (
        <div className="ProfilePage">
            <Header />
            <div className="Profile">
                <div className="profileleft">
                    <div className="profileInfo">
                        <div className="avatar">
                            <Avatar color="#44DD8C" name={profile.name} size="150" textSizeRatio={1.25}/>
                        </div>
                        <h2>{profile.name}</h2>
                        <h4>Income: {editIncome ? "Editing" : <>{profile.income ? profile.income + "₺" : "Unknown"}</>}</h4>
                        <h4>Subscription: {profile.subscription ? "Subscribed" : "Not Subscribed"}</h4>
                        <h4>Location: {editLocation ? "Editing" : <>{profile.location ? profile.location : "Unknown"}</>}</h4>
                    </div>
                    
                </div>
                {
                    ((profileHabits || profileIncome) && showAlert) ? 
                    <Alert variant="filled" severity="error" sx={{ width: '250px' }} className="Alert">
                        Please fill your profile information!
                        <CloseIcon className="closeAlertBtn" onClick={closeAlert}/>
                            
                    </Alert>
                    :
                    ""
                }
                {
                    (profileIncome && showAlert) ? 
                    <Alert variant="filled" severity="error" sx={{ width: '250px' }} className="Alert">
                        Please fill your profile information!
                        <CloseIcon className="closeAlertBtn" onClick={closeAlert}/>
                            
                    </Alert>
                    :
                    ""
                }
                <div className="alert">
                    
                </div>
                <div className="profileright">
                    <Box sx={{width: '100%'}}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="disabled" >
                                <Tab label="Spending Habits" {...a11yProps(0)}/>
                                <Tab label="Income" {...a11yProps(1)}/>
                                <Tab label="Location" {...a11yProps(2)}/>
                            </Tabs>
                        </Box>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <div className="profileHabits">
                            <div className="habitButtons">
                            <Button type="button" onClick={toggleEditHabits} variant="contained" theme={themelight} endIcon={<EditIcon />}>
                                Edit
                            </Button>
                            </div>
                            {editHabits ? <form onSubmit={handleEditSubmit}> 
                                <div className="habitsTable">
                                    {
                                        habits.length > 0 ?
                                            habits.map((item,i)=>(
                                                <div key={i} className="habitsFormInput">
                                                {item.habit_Id < 0 ? 
                                                    <>
                                                    <div className="habitsInput input-group">
                                                        <label htmlFor={`type_${item.habit_Id}`}>Spending Habit:</label>
                                                        <input type="text" name={`type_${item.habit_Id}`} id={`type_${item.habit_Id}`} placeholder="Habit"/>
                                                    </div>
                                                    <div className="habitsInput input-group">
                                                        <label htmlFor={`value_${item.habit_Id}`}>Value:</label>
                                                        <input type="number" name={`value_${item.habit_Id}`} id={`value_${item.habit_Id}`} placeholder="Spending"/>
                                                    </div>
                                                    </>
                                                    :
                                                    <>
                                                    <div className="habitsInput">
                                                        <label htmlFor={`type_${item.habit_Id}`}>Spending Habit:</label>
                                                        <input type="text" name={`type_${item.habit_Id}`} id={`type_${item.habit_Id}`} value={item.spending_Type} placeholder="Habit" onChange={handleTypeChange} />
                                                    </div>
                                                    <div className="habitsInput">
                                                        <label htmlFor={`value_${item.habit_Id}`}>Value:</label>
                                                        <input type="number" name={`value_${item.habit_Id}`} id={`value_${item.habit_Id}`} value={item.spending_Value} placeholder="Value" onChange={handleValueChange}/>
                                                    </div>
                                                    </>
                                                
                                                }
                                                <Button type="button" value={item.habit_Id} onClick={removeHabit} variant="contained" theme={themelight} endIcon={<DeleteForeverIcon />}>
                                                    Remove
                                                </Button>
                                                </div>
                                            )) : ""
                                    }

                                </div>
                                <Button type="button" onClick={addHabit} variant="contained" theme={themelight} endIcon={<AddIcon />}>
                                    Add
                                </Button>
                                <Button type="submit" variant="contained" theme={themelight} endIcon={<SaveIcon />}>
                                    Save
                                </Button>
                                </form> 
                                
                                : 
                                
                                <div className="habitsTable">
                                {
                                    habits ?
                                    <div className="habitsTable">
                                        {
                                            habits.length > 0 ? habits.map((item,i)=>(
                                            <div key={i} className="Habit">
                                                    <p className="habitType">{item.spending_Type}</p>
                                                    <p className="habitValue">{item.spending_Value}</p>
                                            </div>
                                            )) 
                                            : <p>No Habits</p>
                                        }
                                        </div>
                                        : <p>No Habits</p>
                                        
                                        
                                }
                                </div>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                    <Button type="button" onClick={toggleEditIncome} variant="contained" theme={themelight} endIcon={<EditIcon />}>
                        Edit
                    </Button>
                    {editIncome ? 
                        <form onSubmit={handleIncomeEdit}>
                            <label htmlFor="Income">Income</label>
                            {profile.income ? <input type="number" name="income" id="income" value={profile.income} placeholder="Income" onChange={handleIncomeChange} /> : <input type="number" name="income" id="income" placeholder="Income" />}
                            <Button type="submit" variant="contained" theme={themelight} endIcon={<SaveIcon />}>
                                Save
                            </Button>
                        </form>

                        :
                        <p>Income: {profile.income}</p>

                    }
                        
                    </TabPanel>
                    <TabPanel value={value} index={2}>

                    <Button type="button" onClick={toggleEditLocation} variant="contained" theme={themelight} endIcon={<EditIcon />}>
                        Edit
                    </Button>
                    {editLocation ? 
                        <form onSubmit={handleLocationEdit}>
                            <label htmlFor="Location">Location</label>
                            {profile.location ? <input type="text" name="location" id="location" value={profile.location} placeholder="Location" onChange={handleLocationChange} /> : <input type="text" name="location" id="location" placeholder="Location" />}
                            <Button type="submit" variant="contained" theme={themelight} endIcon={<SaveIcon />}>
                                Save
                            </Button>
                        </form>
                        :
                        <p>Location: {profile.location}</p>
                    
                    }
                        
                    </TabPanel>
                </div>
            </div>
        </div>
    )
}

export default Profile;
