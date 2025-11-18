import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/Auth.css';
import openPng from '../assets/open.png';
import closedPng from '../assets/closed.png';

function Auth({ login, auth, setAuth, userList, setUserList, user, setUser }) {
    const [redirect, setRedirect] = useState(false);
    const icons = [openPng, closedPng];
    const [passFlag, setFlag] = useState({ flag: false, type: 'password' });
    const errmsgs = ["Username cannot be empty", "Password cannot be empty", "Incorrect username or password.",];

    const addUser = () => {
        let searchList = [];
        if (user.name === '') {
            alert(errmsgs[0]);
            return;
        }
        if (user.pass === '') {
            alert(errmsgs[1]);
            return;
        }
        searchList = userList.filter((u) => u.name === user.name);
        if (searchList.length === 0) {
            if (login) {
                alert(errmsgs[2]);
                return;
            } else {
                const newUser = { name: user.name, pass: user.pass, admin:false };
                setUserList([...userList, newUser]);
                setUser(newUser);
                setAuth(true);
                alert("Registered successfully. Welcome, " + user.name + "!");
                setRedirect(true);
            }
        } else {
            if (login && searchList[0].pass === user.pass) {
                alert("Logged in. Welcome back, " + user.name + "!");
                setAuth(true);
                setUser(searchList[0]);
                setRedirect(true);
            } else {
                alert("User already exists. Please login.");
                return;
            }
        }
    }

    if (redirect) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className='auth'>
            <table className='authTable' cellSpacing={32} width={'20%'} onKeyDown={(event)=>{if(event.key==='Enter')addUser()}}>
                <tbody>
                    <tr><td colSpan={2}><h1>{login ? 'Login' : 'Register'}</h1></td></tr>
                    <tr><td>Username</td><td><input value={user.name} onChange={(e) => setUser({ name: e.target.value, pass: user.pass, admin: false })}/></td></tr>
                    <tr>
                        <td>Password</td><td style={{ position: "relative" }}><input type={passFlag.type} onChange={(e) => setUser({ name: user.name, pass: e.target.value, admin: false })} />
                            <button type="button" onClick={() => setFlag({ flag: !passFlag.flag, type: passFlag.type === "password" ? "" : "password", })} style={{ position: "absolute", right: "5px", top: "55%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", padding: 0, }}>
                                <img alt='' src={passFlag.flag ? icons[0] : icons[1]} width={15} style={{ transition: '0.3s', margin: '0 auto', }} />
                            </button>
                        </td>
                    </tr>

                    <tr style={{ textAlign: 'center' }}><td colSpan={2}><button onClick={addUser} style={{ width: '70%' }}>{login ? 'Sign in' : 'Sign up'}</button></td></tr>
                    <tr><td colSpan={2}><Link to={login ? '/register' : '/login'}>{login ? 'Don\'t have an account? Register' : 'Already have an account? Login'}</Link></td></tr>
                </tbody>
            </table>
        </div>
    );
}
export default Auth;