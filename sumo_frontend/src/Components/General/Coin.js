import React from 'react';
import './Coin.css';

const Coin = ({
  name,
  price,
  symbol,
  marketcap,
  volume,
  image,
  priceChange
}) => {
  return (
    <div className='coin-container'>
      <div className='coin-row'>
        <div className='coin'>
          <img src={image} alt='crypto' />
          <h1>{name}</h1>
          <p className='coin-symbol'>{symbol}</p>
        </div>
        <div className='coin-data'>
            <div className="priceInfo">
                <p>Price:</p>
                <p className='coin-price'>{price} ₺</p>
            </div>
            <div className="priceInfo">
                <p>Volume:</p>
                <p className='coin-volume'>{volume.toLocaleString()} ₺</p>
            </div>

            <div className="priceInfo">
                <p>Change:</p>
                {priceChange < 0 ? (
                <p className='coin-percent red'> {priceChange.toFixed(2)}%</p>
                ) : (
                    <p className='coin-percent green'>{priceChange.toFixed(2)}%</p>
                )}
            </div>

            <div className="priceInfo">
                <p>Mkt Cap:</p>
                <p className='coin-volume'>{marketcap.toLocaleString()} ₺</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Coin;