import React from 'react';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import './Currency.css';
import axios from 'axios';
import Header from '../Components/General/Header';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Chart from "react-google-charts";


function Currency() {
    const [ratesList, setRatesList] = useState([]);
    const [base, setBase] = useState("EUR");
  
    useEffect(() => {
      getRates("EUR");
    }, []);
  
    const getRates = async (base) => {
      const res = await axios.get(
        `http://api.exchangeratesapi.io/v1/latest?access_key=b05f6635fe89a3dbebca111664527e71&base=${base}`

      );
      const { rates } = res.data;
  
      const ratesTemp = [];
      for (const [symbol, rate] of Object.entries(rates)) {
        ratesTemp.push({ symbol, rate });
      }
      setRatesList(ratesTemp);
    };
  
    return (
      <div className="Currency">
           <Header />
        <select
          className="custom-select"
          value={base}
          onChange={(e) => {
            const value = e.target.value;
            setBase(value);
            getRates(value);
          }}
        >
          {ratesList.map((d) => (
            <option value={d.symbol} key={d.symbol}>
              {d.symbol}
            </option>
          ))}
        </select>
        <ul className="list-group">
          {ratesList.map((d) => (
            <li className="list-group-item" key={d.symbol}>
              {d.symbol} - {d.rate}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default Currency;