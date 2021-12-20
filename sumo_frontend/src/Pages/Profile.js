import React from 'react'
import { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import './Profile.css'
import axios from 'axios';
import Header from '../Components/General/Header';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import { createTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DataGrid } from '@mui/x-data-grid';

const theme = createTheme({
    palette: {
        primary: {
            light: '#2C905B',
            main: '#2C905B',
            dark: '#2C905B',
            contrastText: '#000',
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
    const [addHabits, setAddHabits] = useState(false);
    const [addCount, setAddCount] = useState(-1);
    const [editIncome, setEditIncome] = useState(false);
    const [editLocation, setEditLocation] = useState(false);
    const [newarr, setNewArr] = useState([]);
    const [oldarr, setOldArr] = useState([]);
    const [profileIncome, setProfileIncome] = useState(false);
    const [profileHabits, setProfileHabits] = useState(false);
    const [showAlert, setShowAlert] = useState(true);
    const [editing, setEditing] = useState("");
    const [editingHabit, setEditingHabit] = useState({});
    const [editingChanged, setEditingChanged] = useState(false);
    const [tableData, setTableData] = useState([]);

    const columns = [
        { field: 'spending_Type', headerName: 'Habit', width: 180 },
        { 
            field: 'spending_Value', 
            headerName: 'Value', 
            width: 180 
        },
        {
            field: "edit",
            headerName: "Edit",
            sortable: false,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    const habit = habits.filter((habit) => habit.habit_Id == e.target.value)[0]
                    setEditHabits(false);
                    setEditLocation(false);
                    setEditIncome(false);
                    setAddHabits(false);
                    setEditingHabit(habit);
                    setEditing("EditHabit");
                    setEditHabits(true);
                };
                return <Button onClick={onClick} value={params.id} endIcon={<EditIcon />} theme={themelight} color="primary">Edit</Button>;
            }
        },
        {
            field: "remove",
            headerName: "Remove",
            sortable: false,
            renderCell: (params) => {
        
                return <Button onClick={removeHabit} value={params.id} endIcon={<DeleteForeverIcon />} color="error">Remove</Button>;
            }
        },
    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTypeChange = (event) => {
        var obj = editingHabit;
        obj["spending_Type"] = event.target.value;
        setEditingHabit(obj);
        console.log(editingHabit)
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

    const handleAddHabit = (event) => {
        event.preventDefault();
        const data = {
            habit: event.target.type.value,
            value: event.target.spending.value
        }
        if (data.habit && data.value) {
            axios.post("/profile/addhabit", {data}).then((resp) => {
                axios.get("/auth/habits").then((response) => {
                    setHabits(response.data);
                });

            });
            setEditHabits(false);
            setEditIncome(false);
            setEditLocation(false);
            setAddHabits(false);
            setEditing("");
            setEditingHabit({});
            setEditingChanged(!editingChanged);
        }
    }

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const data = {
            habit_Id: event.target.id.value,
            habit: event.target.type.value,
            value: event.target.spending.value
        }

        axios.post("/profile/edithabits", {data});
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

    const toggleEdits = (event) => {
        setEditHabits(false);
        setEditIncome(false);
        setEditLocation(false);
        setAddHabits(false);
        setEditing("");
        setEditingHabit({});
        setEditingChanged(!editingChanged);
    }

    const toggleEditHabits = (e) => {
        if(editHabits) {
            axios.get("/auth/habits").then((response) => {
                setHabits(response.data);
            });
        }
        else {
            const habit = habits.filter((habit) => habit.habit_Id == e.target.value)[0]
            setEditHabits(false);
            setEditLocation(false);
            setEditIncome(false);
            setAddHabits(false);
            setEditingHabit(habit);
            setEditing("EditHabit")
            setEditHabits(true);
        }
        setEditHabits(!editHabits);
    }
    const toggleAddHabits = (event) => {
        if(editHabits) {
            axios.get("/auth/habits").then((response) => {
                setHabits(response.data);
            });
            setAddCount(-1);
        }
        else {
            setEditing("AddHabit");
            setAddHabits(true);
            setEditHabits(false)
            setEditIncome(false);
            setEditLocation(false);
        }
        setAddHabits(!addHabits);
    }

    const toggleEditIncome = (event) => {
        if(editIncome) {
            axios.get("/auth/profile").then((response) => {
                setProfile(response.data);
            });
        }
        else {
            setEditing("Income");
            setEditLocation(false);
            setEditHabits(false);
            setAddHabits(false);
        }
        setEditIncome(!editIncome);
    }
    const toggleEditLocation = (event) => {
        if(editLocation) {
            axios.get("/auth/profile").then((response) => {
                setProfile(response.data);
            });
        }
        else {
            setEditing("Location");
            setEditIncome(false);
            setEditHabits(false);
            setAddHabits(false);
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
                window.location = "/";
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
            var d = [];
            response.data.map((item,i) =>(
                item = {
                    id: item.habit_Id,
                    spending_Type: item.spending_Type,
                    spending_Value: item.spending_Value,
                },
                d =  [...d, item]
            ))
            setTableData(d);
            if(response.data.length === 0) {
                setProfileHabits(true);
            }
        });
        setShowAlert(true);
    }, []);
    useEffect(() => {
        setHabits(habits);
        var d = [];
        habits.map((item,i) =>(
            item = {
                id: item.habit_Id,
                spending_Type: item.spending_Type,
                spending_Value: item.spending_Value,
            },
            d =  [...d, item]
        ))
        setTableData(d);
    }, [habits]);
    useEffect(() => {
        setEditingHabit(editingHabit);
    }, [editingHabit])
    useEffect(() => {
        setProfile(profile);
    }, [profile])
    useEffect(() => {
        axios.get("/auth/profile").then((response) => {
            setProfile(response.data);
            if(!response.data.income || response.data.income == 0) {
                setProfileIncome(true);
            }
        });
        axios.get("/auth/habits").then((response) => {
            setHabits(response.data);
            var d = [];
            response.data.map((item,i) =>(
                item = {
                    id: item.habit_Id,
                    spending_Type: item.spending_Type,
                    spending_Value: item.spending_Value,
                },
                d =  [...d, item]
            ))
            setTableData(d);
            if(response.data.length === 0) {
                setProfileHabits(true);
            }
        });
    }, [editingChanged])


    return (
        <div className="ProfilePage">
            <Header />
            <div className="Profile">
                <div className={editHabits || editIncome || editLocation || addHabits ? "profileeditarea editactive" : "profileeditarea editnotactive"}>
                    <div className="profileeditclosebutton">
                        <IconButton type="button" onClick={toggleEdits} variant="contained" theme={themelight}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {editing === "Income" ?
                        <>
                            <p className="editingLabel">Edit Income</p>
                            <form onSubmit={handleIncomeEdit}>
                                <label htmlFor="Income" className="profileeditformlabel">Income:</label>
                                {profile.income ? <input className="profileeditforminput" type="number" name="income" id="income" value={profile.income} placeholder="Income" onChange={handleIncomeChange} /> : <input type="number" className="profileeditforminput" name="income" id="income" placeholder="Income" />}
                                <Button className="profileeditformsave" type="submit" variant="contained" theme={themelight} endIcon={<SaveIcon />}>
                                    Save
                                </Button>
                            </form>
                        </>
                        :
                        <></>
                    }
                    {editing === "Location" ?
                        <>
                            <p className="editingLabel">Edit Location</p>
                            <form onSubmit={handleLocationEdit}>
                                <label htmlFor="Location" className="profileeditformlabel">Location</label>
                                {profile.location ? <input type="text" className="profileeditforminput" name="location" id="location" value={profile.location} placeholder="Location" onChange={handleLocationChange} /> : <input type="text" className="profileeditforminput" name="location" id="location" placeholder="Location" />}
                                <Button className="profileeditformsave" type="submit" variant="contained" theme={themelight} endIcon={<SaveIcon />}>
                                    Save
                                </Button>
                            </form>
                        </>
                        :
                        <></>
                    }
                    {editing === "EditHabit" ?
                        <>
                            <p className="editingLabel">Edit Habit</p>
                            <form onSubmit={handleEditSubmit}>
                                <input type="hidden" name="id" value={editingHabit.habit_Id} />
                                <label htmlFor="type" className="profileeditformlabel">Spending Habit:</label>
                                <input type="text" className="profileeditforminput" name="type" id="type" defaultValue={editingHabit.spending_Type}/>
                                <label htmlFor="value" className="profileeditformlabel">Value:</label>
                                <input type="number" className="profileeditforminput" name="spending" id="spending" defaultValue={editingHabit.spending_Value}/>
                                <Button className="profileeditformsave" type="submit" variant="contained" theme={themelight} endIcon={<SaveIcon />}>
                                    Save
                                </Button>
                            </form>
                        </>
                        :
                        <></>
                    }
                    {editing === "AddHabit" ?
                        <>
                            <p className="editingLabel">Add Habit</p>
                            <form onSubmit={handleAddHabit}>
                                <label htmlFor="type" className="profileeditformlabel">Spending Habit:</label>
                                <input type="text" className="profileeditforminput" name="type" id="type" placeholder="Spending Habit"/>
                                <label htmlFor="value" className="profileeditformlabel">Value:</label>
                                <input type="number" className="profileeditforminput" name="spending" id="spending" placeholder="Value"/>
                                <Button className="profileeditformsave" type="submit" variant="contained" theme={themelight} endIcon={<AddIcon />}>
                                    Add
                                </Button>
                            </form>
                        </>
                        :
                        <></>
                    }
                </div>
                <div className="profileleft">
                    <div className="profileInfo">
                        <div className="avatar">
                            <Avatar color="#44DD8C" name={profile.name} size="150" textSizeRatio={1.25}/>
                        </div>
                        <h2>{profile.name}</h2>
                        <h4>Income: {editIncome ? "Editing" : <>{profile.income ? profile.income + "₺" : "Unknown"}</>}</h4>
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
                <div className="profileright">
                    <div className="righttop">
                        <div className="rightleft">
                            <p className="profilerightlabel">Income:</p>
                            <p className="profilerightvalue">{profile.income}₺
                                <IconButton type="button" onClick={toggleEditIncome} variant="contained" theme={themelight} color="primary">
                                    <EditIcon />
                                </IconButton>
                            </p>
                        </div>
                        <div className="rightright">
                            <p className="profilerightlabel">Location:</p>
                            <p className="profilerightvalue">{profile.location}
                                <IconButton type="button" onClick={toggleEditLocation} variant="contained" theme={themelight} color="primary">
                                    <EditIcon />
                                </IconButton>
                            </p>
                        </div>
                    </div>
                    <div className="rightbottom">
                        <p className="profilerightlabel">Habits:</p>
                        <div className="profileHabits">
                            <div className="habitButtons">
                                <Button type="button" onClick={toggleAddHabits} variant="contained" theme={themelight} endIcon={<AddIcon />}>
                                    Add
                                </Button>
                            </div>
                            <div className="table">
                                <DataGrid rows={tableData} columns={columns} pageSize={5}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
