import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Auth from './components/Auth';
import Home from './pages/Home';
import Logout from './components/Logout';
import UserList from './pages/UserList';
import Profile from './pages/Profile';
import Stocks from './pages/Stocks';

import { useState } from 'react';
import { Navigate } from "react-router-dom";

function App() {
  const [auth, setAuth] = useState(true);
  const [theme, setTheme] = useState('light');
  const [userList, setUserList] = useState([{ name: 'admin', pass: 'admin', admin: true, wallet: 10000.0, stocks: [0, 4, 5] }, { name: 'test1', pass: '123', admin: false, wallet: 1000.0, stocks: [{ i: 0, q: 1 }, { i: 1, q: 4 }, { i: 3, q: 1 }] }, { name: 'test2', pass: '321', admin: false, wallet: 100.0, stocks: [{ i: 1, q: 5 }] }]);
  const [user, setUser] = useState({ name: 'admin', pass: 'admin', admin: true, wallet: 10000.0, stocks: [{ i: 0, q: 2 }, { i: 4, q: 1 }, { i: 5, q: 1 }] });
  const [stockList, setStockList] = useState([
    { company: "Apple Inc.", ticker: "AAPL", price: 178.45, change: 2.34 },
    { company: "Microsoft Corp.", ticker: "MSFT", price: 374.58, change: -1.24 },
    { company: "Tesla Inc.", ticker: "TSLA", price: 238.72, change: 5.67 },
    { company: "Amazon.com Inc.", ticker: "AMZN", price: 145.33, change: 3.21 },
    { company: "NVIDIA Corp.", ticker: "NVDA", price: 495.22, change: 8.45 },
    { company: "Alphabet Inc.", ticker: "GOOGL", price: 138.67, change: -0.89 },
    { company: "Meta Platforms", ticker: "META", price: 328.45, change: 4.12 },
    { company: "Netflix Inc.", ticker: "NFLX", price: 445.78, change: -2.34 },
  ]);

  const authRoute = (Component, admin) => {
    if (!admin) return auth ? Component : <Navigate to="/login" />;
    if (admin) return auth && user.admin ? Component : <Navigate to="/login" />;
  }

  const replaceUser = (updatedUser) => {
    const newUsersList = userList.map((currentUser) => {
      if (currentUser.name === updatedUser.name) {
        return updatedUser;
      }
      return currentUser;
    });
    setUserList(newUsersList);
  };

  return (
    <div className={"App " + theme}>
      <title>CSCI426Project</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <Router>
        <NavBar auth={auth} user={user} theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path='/login' element={auth ? <Navigate to="/home" replace /> : <Auth login={true} auth={auth} setAuth={setAuth} userList={userList} setUserList={setUserList} user={user} setUser={setUser} theme={theme} />} />
          <Route path="/" element={authRoute(<Navigate to="/home" replace />, false)} />
          <Route path="/CSCI426Project" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home auth={auth} stockList={stockList} theme={theme} />} />
          <Route path='/logout' element={<Logout setAuth={setAuth} setUser={setUser} />} />
          <Route path='/register' element={<Auth login={false} auth={auth} setAuth={setAuth} userList={userList} setUserList={setUserList} user={user} setUser={setUser} theme={theme} />} />
          <Route path='/userlist' element={authRoute(<UserList userList={userList} setUserList={setUserList} theme={theme} />, true)} />
          <Route path='/stocks' element={authRoute(<Stocks />, false)} />
          <Route path='/profile' element={authRoute(<Profile user={user} stockList={stockList} setUser={setUser} userList={userList} setUserList={setUserList} replaceUser={replaceUser}/>, false)} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
