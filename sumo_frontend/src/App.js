import Header from './Components/General/Header';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import Admin from './Pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
      </div>

      <Route path="/" component={Login} exact/>
      <Route path="/Signup" component={Signup} exact/>
      <Route path="/Profile" component={Profile} exact/>
      <Route path="/Admin" component={Admin} exact/>
    </BrowserRouter>
  );
}

export default App;
