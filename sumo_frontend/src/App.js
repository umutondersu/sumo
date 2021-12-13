import { BrowserRouter, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import Summary from './Pages/Summary';
import Admin from './Pages/Admin';
import AdminLogin from './Pages/AdminLogin';
import Calculation from './Pages/Calculation';
import Advisor from './Pages/Advisor';
import Stock from './Pages/Stock';
import axios from 'axios';
import ExpertLogin from './Pages/ExpertLogin';
import Expert from './Pages/Expert';

function App() {
  
  
  return (
    <BrowserRouter>
      <div className="App">
      </div>

      <Route path="/" component={Login} exact/>
      <Route path="/Signup" component={Signup} exact/>
      <Route path="/Profile" component={Profile} exact/>
      <Route path="/Summary" component={Summary} exact/>
      <Route path="/Admin" component={Admin} exact/>
      <Route path="/Adminlogin" component={AdminLogin} exact/>
      <Route path="/Expertlogin" component={ExpertLogin} exact/>
      <Route path="/Expert" component={Expert} exact/>
      <Route path="/Calculation" component={Calculation} exact/>
      <Route path="/Advisor" component={Advisor} exact/>
      <Route path="/Stock" component={Stock} exact/>
    </BrowserRouter>
  );
}

export default App;
