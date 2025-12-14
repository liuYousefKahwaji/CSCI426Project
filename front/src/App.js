import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Auth from './components/Auth';
import Home from './pages/Home';
import Logout from './components/Logout';
import UserList from './pages/UserList';
import Profile from './pages/Profile';
import Stocks from './pages/Stocks';
import Transactions from './pages/Transactions';
import Requests from './pages/Requests';
import AdminRequests from './pages/AdminRequests';
import axios from "axios";
import { useState } from 'react';
import { Navigate } from "react-router-dom";
import ThemeContext from './context/ThemeContext';
import { useEffect } from 'react';

function App() {
  const [auth, setAuth] = useState(false);
  const [theme, setTheme] = useState('light');
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState({});
  const [stockList, setStocks] = useState([]);
  const [holdingList,setHoldings] = useState([]);
  const [requestList, setRequests] = useState([]);

  //users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/userlist')
      setUserList(res.data)
    } catch (e) {
      console.log("Error in fetching users database.")
    }
  }
  useEffect(() => {
    fetchUsers();
  }, [])

  //stocks
  const fetchStocks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/stocks')
      setStocks(res.data)
    } catch (e) {
      console.log("Error in fetching stocks database.")
    }
  }
  useEffect(() => {
    fetchStocks();
  }, [])

  //holdings
  const fetchHoldings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/holdings');
      setHoldings(res.data);
    } catch (e) {
      console.log("Error in fetching stocks database.")
    }
  }
  useEffect(() => {
    fetchHoldings();
  }, [])

  //requests
  const fetchRequests = async () => {
    try {
      const url = user.admin 
        ? 'http://localhost:5000/requests'
        : `http://localhost:5000/requests?user_id=${user.id}`;
      const res = await axios.get(url);
      setRequests(res.data);
    } catch (e) {
      console.log("Error in fetching requests database.")
    }
  }
  useEffect(() => {
    if (user.id) {
      fetchRequests();
    }
  }, [user.id])

  // check auth
  const authRoute = (Component, admin) => {
    if (!admin) return auth ? Component : <Navigate to="/login" />;
    if (admin) return auth && user.admin ? Component : <Navigate to="/login" />;
  }

  // update user in list
  const replaceUser = async (updatedUser,e=true) => {
    if(e){setUser(updatedUser);}
    try {
      await axios.put(`http://localhost:5000/userlist/${updatedUser.id}`, {
        name: updatedUser.name,
        pass: updatedUser.pass,
        admin: updatedUser.admin ? 1 : 0,
        wallet: updatedUser.wallet ?? 0,
      });
      setUserList((prev) =>
        prev.map((currentUser) =>
          currentUser.id === updatedUser.id ? { ...currentUser, ...updatedUser } : currentUser
        )
      );
    } catch (e) {
      console.log("Error updating user.", e);
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={"App " + theme}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <Router>
          <NavBar auth={auth} user={user} />
          <Routes>
            <Route path='/login' element={auth ? <Navigate to="/home" replace /> : <Auth login={true} auth={auth} setAuth={setAuth} userList={userList} setUserList={setUserList} user={user} setUser={setUser} fetchUsers={fetchUsers} />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/CSCI426Project" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home auth={auth} stockList={stockList} />} />
            <Route path='/logout' element={<Logout setAuth={setAuth} setUser={setUser} />} />
            <Route path='/register' element={<Auth login={false} auth={auth} setAuth={setAuth} userList={userList} setUserList={setUserList} user={user} setUser={setUser} fetchUsers={fetchUsers} />} />
            <Route path='/userlist' element={authRoute(<UserList userList={userList} setUserList={setUserList} replaceUser={replaceUser} fetchUsers={fetchUsers}/>, true)} />
            <Route path='/stocks' element={authRoute(<Stocks user={user} stockList={stockList} setUser={setUser} replaceUser={replaceUser} holdingList={holdingList} fetchHoldings={fetchHoldings}/>, false)} />
            <Route path='/profile' element={authRoute(<Profile user={user} stockList={stockList} setUser={setUser} userList={userList} setUserList={setUserList} replaceUser={replaceUser} holdingList={holdingList} fetchUsers={fetchUsers}/>, false)} />
            <Route path='/transactions' element={authRoute(<Transactions user={user} stockList={stockList}/>, false)} />
            <Route path='/requests' element={authRoute(<Requests user={user} stockList={stockList} fetchRequests={fetchRequests}/>, false)} />
            <Route path='/adminrequests' element={authRoute(<AdminRequests requestList={requestList} stockList={stockList} fetchRequests={fetchRequests} fetchStocks={fetchStocks}/>, true)} />
          </Routes>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
