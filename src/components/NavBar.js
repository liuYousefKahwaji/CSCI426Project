import { useState } from "react";
import '../styles/NavBar.css';
import { Link } from "react-router-dom";

function NavBar({auth, user}) {
  const list = auth ? (user.admin?['Home', 'About', 'Contact', 'UserList' ,'Logout']:['Home', 'About', 'Contact' ,'Logout']) : ['Home', 'Login','Register','About', 'Contact'];
  const [nav, setNav] = useState(false);
  return (
    <div className="navBody">
      <div className={(!nav ? "navClosed" : 'navOpen') + ' navDiv'} onMouseOver={() => setNav(true)} onMouseOut={() => setNav(false)} >
        <h1 style={{ backgroundColor: 'transparent', transform: nav ? '' : 'translateX(270%)  rotate(0deg)', transition: 'transform 0.3s', cursor: 'default', pointerEvents: 'none', visibility: nav?'hidden':'visible'}} className="h1">{'>'}</h1>
        <table cellPadding={1} cellSpacing={20} className="navTable" style={{ opacity: !nav ? 0 : 1, transition: 'opacity 0.3s', backgroundColor: 'transparent', position: 'relative', right: '5%'}} align="center">
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="navRow" >
                <td className="navItem" style={{background: '#2e3a7a'}}><Link to={'/'+item.toLowerCase()}>{item}</Link></td>
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