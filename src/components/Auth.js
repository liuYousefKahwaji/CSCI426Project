import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/Auth.css';
import openPng from '../assets/open.png';
import closedPng from '../assets/closed.png';
import ThemeContext from '../context/ThemeContext';

function Auth({ login, auth, setAuth, userList, setUserList, user, setUser }) {
    const [redirect, setRedirect] = useState(false);
    const { theme } = useContext(ThemeContext);
    const icons = [openPng, closedPng];
    const [passFlag, setFlag] = useState({ flag: false, type: 'password' });
    const errmsgs = ["Username cannot be empty", "Password cannot be empty", "Incorrect username or password.",];

    // login or register
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
                const newUser = { name: user.name, pass: user.pass, admin: false, wallet: 0 };
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
            <table className={'authTable '+(theme==='light'?'lightAccent':'darkAccent')} cellSpacing={32} width={'40%'} onKeyDown={(event) => { if (event.key === 'Enter') addUser() }}>
                <tbody>
                    <tr ><td colSpan={2} className='authHead'><h1>{login ? 'Login' : 'Register'}</h1><h2>{login ? 'Sign in with your account' : 'Create an account'}</h2></td></tr>
                    <tr><td><input className='authInputs' placeholder='Username' value={user.name} onChange={(e) => setUser({ name: e.target.value, pass: user.pass, admin: false, wallet: user.wallet })} /></td></tr>
                    <tr>
                        <td style={{ position: "relative" }}><input className='authInputs' placeholder='Password' type={passFlag.type} onChange={(e) => setUser({ name: user.name, pass: e.target.value, admin: false, wallet: user.wallet })} />
                            <img onClick={() => setFlag({ flag: !passFlag.flag, type: passFlag.type === "password" ? "" : "password", })} className='secret' alt='' src={passFlag.flag ? icons[0] : icons[1]} width={15} style={{ transition: '0.3s', margin: '0 auto', marginBottom: '1px', marginRight: '3.5px' }} />
                        </td>
                    </tr>

                    <tr style={{ textAlign: 'center'}}><td colSpan={2}><button className='addbtn' onClick={addUser} >{login ? 'Sign in' : 'Sign up'}</button></td></tr>
                    <tr><td className='switchAuth' colSpan={2}>{login ? 'Don\'t have an account?' : 'Already have an account?'} <Link to={login ? '/register' : '/login'}>{login ? 'Create one!' : 'Log in!'}</Link></td></tr>
                </tbody>
            </table>
        </div>
    );
}
export default Auth;