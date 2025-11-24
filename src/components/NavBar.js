import '../styles/NavBar.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

function NavBar({ auth, user }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const list = auth ? (user.admin ? ['Home', 'Stocks', 'Profile', 'UserList', 'Logout'] : ['Home', 'Stocks', 'Profile', 'Logout']) : ['Home', 'Login', 'Register', 'Stocks', 'Profile'];
  return (
    <div className={"navBody "+(theme==='light'?'lightAccent':'darkAccent')}>
      <ul className='navList'>
        <li className='navTitle'><Link to={'/home'} style={{textDecoration:'none'}}><h1>📈StockEx</h1></Link></li>
        {list.map((item, index) => (
          <li key={index} className={"navItem"} ><Link style={{
            cursor: auth || (index === 1 || index === 2 || index === 0)
              ? 'pointer'
              : 'not-allowed'
          }} to={'/' + item.toLowerCase()}>{item}</Link></li>
        ))}
        <li className={"navItem"} style={{cursor:'pointer'}} onClick={()=>setTheme(theme==='light'?'dark':'light')}><a>{theme==='light'?'⚪':'⚫'}</a></li>
      </ul>
    </div>

  );
}

export default NavBar;