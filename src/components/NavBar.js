import { useState } from "react";
import '../styles/NavBar.css';
import { Link } from "react-router-dom";

function NavBar({ auth, user }) {
  const list = auth ? (user.admin ? ['Home', 'Stocks', 'Profile', 'UserList', 'Logout'] : ['Home', 'Stocks', 'Profile', 'Logout']) : ['Home', 'Login', 'Register', 'Stocks', 'Profile'];
  const [nav, setNav] = useState(false);
  return (
    <div className="navBody">
      <div className={(!nav ? "navClosed" : 'navOpen') + ' navDiv'} onMouseOver={() => setNav(true)} onMouseOut={() => setNav(false)} >
        <h1 style={{ backgroundColor: 'transparent', transform: nav ? '' : 'translateX(700%)  rotate(0deg)', transition: 'transform 0.1s', cursor: 'default', visibility: nav ? 'hidden' : 'visible' }} className="h1">{'>'}</h1>
        <table cellPadding={1} cellSpacing={20} className="navTable" style={{ opacity: !nav ? 0 : 1, transition: 'opacity 0.1s', backgroundColor: 'transparent', position: 'relative', right: '5%' }} align="center">
          <thead>
            <tr><th>{!auth ? 'Logged out. Sign in or Sign up' : 'Logged in as ' + user.name}</th></tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="navRow" >
                <td className={"navItem"} style={{
                  cursor: auth || (index === 1 || index === 2)
                    ? 'pointer'
                    : 'not-allowed'
                }}><Link style={{
                  cursor: auth || (index === 1 || index === 2)
                    ? 'pointer'
                    : 'not-allowed'
                }} to={'/' + item.toLowerCase()}>{item}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="opaque" style={
        {
          opacity: !nav ? 0 : 0.8,
          visibility: !nav ? 'hidden' : 'visible'
        }
      }></div>
    </div>

  );
}

export default NavBar;