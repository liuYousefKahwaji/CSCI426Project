import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Auth from './components/Auth';
import Home from './pages/Home';
import Logout from './components/Logout';
import UserList from './pages/UserList';
import { useState } from 'react';
import { Navigate } from "react-router-dom";

function App() {
  const [auth, setAuth] = useState(false);
  const [userList, setUserList] = useState([{ name: 'admin', pass: 'admin' , admin: true },{ name: 'test1', pass: '123' , admin: false },{ name: 'test2', pass: '321' , admin: false }]);
  const [user, setUser] = useState({ name: '', pass: '' , admin: false });
  const authRoute = (Component, admin) => {
    if (!admin)return auth ? Component : <Navigate to="/login" />;
    if(admin) return auth && user.admin ? Component : <Navigate to="/login" />;
  }
  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <Router>
        <div className="App-nav" ><NavBar auth={auth} user={user}/></div>
        <Routes>
          <Route path='/login' element={auth ? <Navigate to="/home" replace /> : <Auth login={true} auth={auth} setAuth={setAuth} userList={userList} setUserList={setUserList} user={user} setUser={setUser} />} />
          <Route path="/" element={authRoute(<Navigate to="/home" replace />, false)} />
          <Route path="/home" element={<Home />}/>
          <Route path='/logout' element={<Logout setAuth={setAuth} setUser={setUser}/>} />
          <Route path='/register' element={<Auth login={false} auth={auth} setAuth={setAuth} userList={userList} setUserList={setUserList} user={user} setUser={setUser} />} />
          <Route path='/userlist' element={authRoute(<UserList userList={userList} setUserList={setUserList}/>, true)}/>
          <Route path='/stocks' element={authRoute(<div><h1>Stocks Page - Under Construction</h1></div>, false)}/>
          <Route path='/profile' element={authRoute(<div><h1>Profile Page - Under Construction</h1></div>, false)}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
