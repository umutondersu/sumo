import React from 'react';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import './Stock.css';
import axios from 'axios';
import Header from '../Components/General/Header';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Chart from "react-google-charts";
import Coin from '../Components/General/Coin';

function Stock() {
    axios.defaults.withCredentials = false;
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState('');
    
  useEffect(() => {
    axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      )
      .then(res => {
        setCoins(res.data);
        console.log(res.data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleChange = e => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );
  

  return (
    
    <div className='coin-app'>
        <Header />
      <div className='coin-search'>
        <h1 className='coin-text'>Search a stock</h1>
        <form>
          <input
            className='coin-input'
            type='text'
            onChange={handleChange}
            placeholder='Search'
          />
        </form>
      </div>
        <div className="stocks">
            <div className="stockstable">
                {filteredCoins.map(coin => {
                return (
                <Coin
                    key={coin.id}
                    name={coin.name}
                    price={coin.current_price}
                    symbol={coin.symbol}
                    marketcap={coin.total_volume}
                    volume={coin.market_cap}
                    image={coin.image}
                    priceChange={coin.price_change_percentage_24h}
                />
                );
            })}
            </div>
            
        </div>
    </div>
  );
}

export default Stock