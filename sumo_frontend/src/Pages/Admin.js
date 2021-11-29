import React from 'react'
import './Admin.css'
import Header from '../Components/General/AdminHeader';
import axios from 'axios';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react'
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
        field: 'expert_Id', 
        headerName: 'Expert Id', 
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

    const [userData, setdata] = useState({});

    useEffect(() => {
        axios.get("/admin/getusers").then((response) => {
            const d = response.data;
            d.map((item,i) =>(
                item = {
                    id: i,
                    name: item.name,
                    email: item.email,
                    subscription: item.subscription ? true : false,
                    expert_Id: item.expert_Id ? item.expert_Id : "None"
                },
                d[i] = item

            ))
            setdata(d);
        });
    }, []);

    const { data } = useDemoData({
        dataSet: 'Employee',
        rowLength: 10,
      });

    console.log(userData);

    return (
        <div className = "Adminpage">
            <Header />
            <div className="Admin">
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={userData} columns={columns} />
                </div>
            </div>
        </div>
    )
}

export default Admin