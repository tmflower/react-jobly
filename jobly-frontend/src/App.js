import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Homepage from './Components/Homepage';
import CompaniesList from './Components/CompaniesList';
import CompanyDetail from './Components/CompanyDetail';
import JobsList from './Components/JobsList';
import LoginForm from './Components/Login';
import SignupForm from './Components/Signup';
import Profile from './Components/Profile';
import JoblyApi from './api';
import jwt from 'jsonwebtoken';
import userContext from './Components/userContext';

function App() {

  // this function is used during authentication to redirect the user to a new location
  const navigate = useNavigate();

  // sets an initial value of null to the current logged in user
  // checks for existing token in localStorage; if one exists, sets it at initial value; otherwise, sets initial value of null
  // const [currentUser, setCurrentUser] = useState({});
  const [currentUsername, setCurrentUsername] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [token, setToken] = useState(() => {
    let value;
    value = JSON.parse(
      window.localStorage.getItem('token') || null);
    return value;
  });

  // based on the token provided once logged in, saves the current user in state
  // if no token exists, user receives a message and is redirected to login
  useEffect(() => {
    async function updateCurrentUsername() {
      console.log('inside useEffect');
      if (token) {
        window.localStorage.setItem('token', `"${token}"`);
        const user = jwt.decode(token);
        JoblyApi.token = token;
        setCurrentUsername(user.username); 
        const details = await JoblyApi.getUser(user.username);
        setUserDetails({...details});     
        navigate("/", { replace: true });
      }
      else {
        console.log('not logged in');
      }    
    }
    updateCurrentUsername();
    console.log('USER DETAILS IN APP.JS:', userDetails);
  }, [token]);

  // checks username and password and if valid, sets this user to currentUser and saves their token in state
  // this function is called when the user submits the login form
  async function login(user) {
    await JoblyApi.authenticateUser(user);
    setCurrentUsername(user.username);
    setToken(JoblyApi.token);
  }
  
  // adds a new user account when valid required credentials are provided
  // sets this user to currentUser and saves their token in state
  // this function is called when the user submits the signup form
  async function signup (newUser) {
    await JoblyApi.registerUser(newUser);
    setCurrentUsername(newUser.username);
    setToken(JoblyApi.token);
  }

  // removes the currentUser and their token from state
  // this function is called when the user clicks the logout button
  const logout = () => {
    setCurrentUsername(null);
    setToken(null);
    window.localStorage.removeItem('token', `"${token}"`);
    navigate("/login", { replace: true });
  }


  return (    
    <div className="App">
      <userContext.Provider value={ currentUsername }>          
      <Navbar logout={logout}/>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/companies" element={<CompaniesList login={login} />}></Route>
        <Route path="/companies/:company" element={<CompanyDetail />}></Route>
        <Route path="/jobs" element={<JobsList userDetails={userDetails} />}></Route>
        <Route path="/login" element={<LoginForm login={login} />}></Route>
        <Route path="/signup" element={<SignupForm signup={signup} />}></Route>
        <Route path="/profile" element={<Profile userDetails={userDetails} setUserDetails={setUserDetails} />}></Route>
      </Routes>
      </userContext.Provider>

    </div>
  );
}

export default App;
