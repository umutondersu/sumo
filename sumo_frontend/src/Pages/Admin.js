import React from 'react'
import './Admin.css'
import Header from '../Components/General/AdminHeader';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridApi, GridCellValue } from '@mui/x-data-grid'; // last 3 are for button

const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { 
        field: 'email', 
        headerName: 'email', 
        width: 180 
    },
    {
        field: 'subscription',
        headerName: 'Is Subscribed?',
        width: 120,
        type: 'boolean',
    },
    {
        field: 'expert_Name', 
        headerName: 'Expert Name', 
        width: 180 
    },
    {
        field: "remove",
        headerName: "Remove",
        sortable: false,
        renderCell: (params) => {
          const onClick = (e) => {
            e.stopPropagation(); // don't select this row after clicking
    
            const api = params.api;
            const thisRow = {};
    
            api
              .getAllColumns()
              .filter((c) => c.field !== "__check__" && !!c)
              .forEach(
                (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
              );
    
            return alert(JSON.stringify(thisRow, null, 4));
          };
    
          return <Button onClick={onClick}>Remove</Button>;
        }
      },
  ];


function Admin() {
/*
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
*/
    const { data } = useDemoData({
        dataSet: 'Employee',
        rowLength: 10,
      });

    return (
        <div className = "Adminpage">
            <Header />
            <div className="Admin">
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={data.rows} columns={columns} />

                </div>
            </div>
        </div>
    )
}

export default Admin