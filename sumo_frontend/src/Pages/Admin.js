import React from 'react'
import './Admin.css'
import Header from '../Components/General/AdminHeader';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

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



function Admin() {

    const [userData, setUserData] = useState([]);
    const [expertData, setExpertData] = useState([]);
    const [value, setValue] = useState(0);
    const [expertDataChanged, setExpertDataChanged] = useState(false);
    const [customerDataChanged, setCustomerDataChanged] = useState(false);
    const [addExpert, setAddExpert] = useState(false);
    const [error, setError] = useState("");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const toggleExpertDataChanged = () => {
        setExpertDataChanged(!expertDataChanged);
    }
    const toggleCustomerDataChanged = () => {
        setCustomerDataChanged(!customerDataChanged);
    }

    const toggleAddExpert = () => {
        setAddExpert(!addExpert);
    }

    const handleAddExpert = (event) => {
        event.preventDefault();
        const data = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value
        }

        axios.post("/admin/addexpert", data).then((response) => {
            if (response.data.error) {
                setError(response.data.error)
            }
            else {
                toggleAddExpert()
            }
        })

    }

    const expertcolumns = [
        { field: 'name', headerName: 'Name', width: 180 },
        { 
            field: 'email', 
            headerName: 'Email', 
            width: 240 
        },
        {
            field: "remove",
            headerName: "Remove",
            sortable: false,
            width: 200,
            renderCell: (params) => {
                const onClick = (e) => {
                    console.log(e.target.value);
                    e.stopPropagation(); // don't select this row after clicking

                    const data = {
                        id: e.target.value
                    }
                    console.log(data)

                    axios.post("/admin/removeexpert", data).then((response) => {
                        if(response.data.success) {
                            toggleExpertDataChanged();
                        }
                    })
            
                    return;
                };
    
                return <Button onClick={onClick} value={params.id} endIcon={<DeleteForeverIcon />} color="error">Remove</Button>;
            }
        },
    ];

    const columns = [
        { field: 'name', headerName: 'Name', width: 180 },
        { 
            field: 'email', 
            headerName: 'Email', 
            width: 240 
        },
        {
            field: 'expert_name', 
            headerName: 'Expert Name', 
            width: 180 
        },
        {
            field: "assign",
            headerName: "Assign",
            sortable: false,
            width: 200,
            renderCell: (params) => {
                const onChange = (e) => {
                    console.log(e.target.value);
                    e.stopPropagation();
                    const data = {
                        user_id: params.id,
                        expert_id: e.target.value
                    }

                    axios.post("/admin/assignexpert", data).then((response) => {
                        if(response.data.success) {
                            toggleCustomerDataChanged();
                        }
                    })
            
                    return;
                };
    
                return <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            labelId=""
                            id="assigned"
                            value=""
                            onChange={onChange}
                            >
                            <MenuItem value={-1}>
                                <em>None</em>
                            </MenuItem>
                            {expertData.map((item, i) => (
                                <MenuItem key={i} value={item.id}>{item.name}</MenuItem>
                                ))
                            }
                            </Select>
                            <FormHelperText>Assign an expert</FormHelperText>
                        </FormControl>
            }
        },
        {
            field: "remove",
            headerName: "Remove",
            sortable: false,
            width: 200,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const data = {
                        id: e.target.value
                    }

                    axios.post("/admin/removecustomer", data).then((response) => {
                        if(response.data.success) {
                            toggleCustomerDataChanged();
                        }
                    })
                    return;
                };
    
                return <Button onClick={onClick} value={params.id} endIcon={<DeleteForeverIcon />} color="error">Remove</Button>;
            }
        },
    ];

    useEffect(() => {
        axios.get("/admin/isAdmin").then((response) => {
            if(response.data.status != "success") {
                window.location = "/AdminLogin"
            }
        })
        axios.get("/admin/getexperts").then((response) => {
            const d = response.data;
            d.map((item,i) => (
                item = {
                    id: item.expert_Id,
                    name: item.expert_name,
                    email: item.expert_email
                },
                d[i] = item
            ))
            setExpertData(d);
        })
        axios.get("/admin/getusers").then((response) => {
            const d = response.data;
            d.map((item,i) =>(
                item = {
                    id: item.user_Id,
                    name: item.name,
                    email: item.email,
                    subscription: item.subscription,
                    expert_name: item.expert_name ? item.expert_name : "None",
                    expert_id: item.expert_Id ? item.expert_Id : -1,
                    index: i
                } ,
                d[i] = item
            ))
            setUserData(d);
        });

    }, []);

    useEffect(() => {
        axios.get("/admin/getexperts").then((response) => {
            const d = response.data;
            d.map((item,i) => (
                item = {
                    id: item.expert_Id,
                    name: item.expert_name,
                    email: item.expert_email
                },
                d[i] = item
            ))
            setExpertData(d);
        })
        axios.get("/admin/getusers").then((response) => {
            const d = response.data;
            console.log(response.data)
            d.map((item,i) =>(
                item = {
                    id: item.user_Id,
                    name: item.name,
                    email: item.email,
                    subscription: item.subscription,
                    expert_name: item.expert_name ? item.expert_name : "None",
                    expert_id: item.expert_Id,
                    index: i
                } ,
                d[i] = item
            ))
            setUserData(d);
        });

    }, [expertDataChanged, customerDataChanged, addExpert]);

    return (
        <div className = "Adminpage">
            <Header />

            <div className={addExpert ? "expertaddarea addactive" : "expertaddarea addnotactive"}>
                <div className="expertaddclosebutton">
                    <IconButton type="button" onClick={toggleAddExpert} variant="contained" theme={themelight}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <p>{error}</p>
                <p className="addLabel">Add Expert</p>
                <form onSubmit={handleAddExpert}>
                    <label htmlFor="type" className="expertaddformlabel">Expert Name:</label>
                    <input type="text" className="expertaddforminput" name="name" id="name" placeholder="Name"/>
                    <label htmlFor="value" className="expertaddformlabel">Expert Email:</label>
                    <input type="email" className="expertaddforminput" name="email" id="email" placeholder="Email"/>
                    <label htmlFor="value" className="expertaddformlabel">Expert Password:</label>
                    <input type="password" className="expertaddforminput" name="password" id="password" placeholder="Password"/>
                    <Button className="expertaddformsave" type="submit" variant="contained" theme={themelight} endIcon={<AddIcon />}>
                        Add
                    </Button>
                </form>
            </div>
            <div className="Admin">
                <Box sx={{width: '100%'}}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="disabled">
                            <Tab label="Customers" {...a11yProps(0)}/>
                            <Tab label="Experts" {...a11yProps(1)}/>
                        </Tabs>
                    </Box>
                </Box>
                <TabPanel value={value} index={0}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={userData} columns={columns} rowHeight={100} />
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className='expertaddformsave'>
                    <Button onClick={toggleAddExpert} type="submit" variant="contained" theme={themelight} endIcon={<AddIcon />}>
                        Add
                    </Button>
                    </div>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid rows={expertData} columns={expertcolumns} />
                    </div>
                </TabPanel>
            </div>
        </div>
    )
}

export default Admin