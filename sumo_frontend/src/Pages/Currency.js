import React from 'react';
import { useEffect, useState } from 'react';
import './Currency.css';
import axios from 'axios';
import Header from '../Components/General/Header';
import { DataGrid, GridToolbar  } from '@mui/x-data-grid';


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
                    value: `${value} ₺`
                }
                c = [...c, data];
            })
            setCurData(c);
            console.log(c);
        });
    }, []);

    return (
    <div className="Currency">
        <Header />
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
    );
}

export default Currency;