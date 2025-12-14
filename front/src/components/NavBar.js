import '../styles/NavBar.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import Dropdown from './Dropdown';

function NavBar({ auth, user }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const navItems = [
  { 
    name: 'Home', 
    link: '/home', 
    needAuth: false, 
    needAdmin: false, 
    isDropdown: false 
  },
  { 
    name: 'Stocks', 
    link: '/stocks', 
    needAuth: false, 
    needAdmin: false, 
    isDropdown: false ,
    think: true
  },
  

  { 
    name: 'Admin', 
    link: null,
    needAuth: true, 
    needAdmin: true, 
    isDropdown: true, 
    subItems: [
      { name: 'UserList', link: '/userlist' },
      { name: 'All Requests', link: '/adminrequests' }
    ] 
  },
  

  { 
    name: 'Account', 
    link: null, 
    needAuth: true, 
    needAdmin: false, 
    isDropdown: true, 
    subItems: [
      { name: 'Profile', link: '/profile' },
      { name: `${user.admin?'All ':'My '}Transactions`, link: '/transactions' },
      { name: 'My Requests', link: '/requests' }, 
      { name: 'Logout', link: '/logout' }
    ] 
  },
  

  { 
    name: 'Sign In', 
    link: '/login',
    needAuth: false, 
    needAdmin: false, 
    isDropdown: false,
    showIfLoggedOut: true 
  }
];


const finalNavList = navItems.filter(item => {
  if (!item.needAuth && !item.showIfLoggedOut) {
    return true; 
  }

  if (item.showIfLoggedOut && !auth) {
    return true; 
  }
  
  if (!auth) {
    return false;
  }
  if(item.showIfLoggedOut && auth){
    return false;
  }

  if (auth && !item.needAdmin) {
    return true;
  }

  if (auth && user.admin && item.needAdmin) {
    return true;
  }

  return false;
});


  return (
    <div className={"navBody "+(theme==='light'?'lightAccent':'darkAccent')}>
      <ul className='navList'>
        <li className='navTitle'><Link to={'/home'} style={{textDecoration:'none'}}><h1>📈StockEx</h1></Link></li>
        {finalNavList.map((item, index) => (
          <li key={index} className={"navItem"} >
            {!item.isDropdown?<Link style={{cursor: !auth&&item.name==='Stocks' ? 'not-allowed' : item.isDropdown?'default':'pointer'}} to={item.link}>{item.name}</Link>:<Dropdown links={item.subItems}>{item.name}</Dropdown>}
          </li>
        ))}
        <li className={"navItem"} style={{cursor:'pointer'}} onClick={()=>setTheme(theme==='light'?'dark':'light')}><p>{theme==='light'?'⚪':'⚫'}</p></li>
      </ul>
    </div>

  );
}

export default NavBar;