import Header from './Components/General/Header';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import Summary from './Pages/Summary';
import Admin from './Pages/Admin';
import AdminLogin from './Pages/AdminLogin';
import Calculation from './Pages/Calculation';
import Advisor from './Pages/Advisor';

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
      <Route path="/Calculation" component={Calculation} exact/>
      <Route path="/Advisor" component={Advisor} exact/>
    </BrowserRouter>
  );
}

export default App;
