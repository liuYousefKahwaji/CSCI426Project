import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import '../styles/Profile.css'
import ThemeContext from '../context/ThemeContext'

function Profile({ user, stockList, setUser, replaceUser, holdingList, fetchUsers }) {
    const [portfolioValue, setPortfolioValue] = useState(0.0);
    const [userStocks, setUserStocks] = useState([]);
    const { theme } = useContext(ThemeContext);
    const profileSrc = user && user.profile ? (user.profile.startsWith('http') ? user.profile : `http://localhost:5000${user.profile}`) : null;

    function selectImage() {
        if(user.profile!==''){
            const confirmChange = window.confirm("You already have a profile image. Do you want to reset it?");
            if (!confirmChange) return;
            replaceUser({ ...user, profile: '' });
            fetchUsers();
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const form = new FormData();
                form.append('profile', file);
                try {
                    const res = await axios.post(`http://localhost:5000/userlist/${user.id}/profile`, form);
                    const profileUrl = res.data.profile===null?'':`http://localhost:5000${res.data.profile}`;
                    const updatedUser = { ...user, profile: profileUrl };
                    setUser(updatedUser);
                    fetchUsers();
                } catch (e) {
                    console.log('Error uploading profile image', e);
                    alert('Failed to save profile image.');
                }
            }
        };
        input.click();
    }

    // calc portfolio value and set user stocks from holdings
    useEffect(() => {
        if (!holdingList || !user.id) return;
        
        const filteredHoldings = holdingList.filter((i) => i.id === user.id);
        setUserStocks(filteredHoldings);
        
        let total = 0.0;
        filteredHoldings.forEach((e) => {
            total += e.quantity * e.price;
        });
        setPortfolioValue(total);
    }, [holdingList, user.id]);

    // value display component
    function ValueComp({ title, value, children }){
        const displayValue = value !== undefined && value !== null ? value : 0;
        return <div className='value'>
            <h3 style={{
                textAlign: 'left', padding: '10px', paddingLeft: '30px', fontSize: '18px', color: 'gray', paddingBottom: '0'
            }}>{title} Value </h3>
            <h1 style={{
                textAlign: 'left', padding: '10px', paddingLeft: '30px', fontSize: '40px', fontWeight: 'bold', paddingTop: '0', paddingBottom: '0', marginBottom: '10px'
            }}>${displayValue.toFixed(2)}</h1>
            {children}
        </div>
    }

    // handle wallet/password change
    function prompted(change) {
        if (change === "wallet") {
            const input = prompt("Enter increase (can be negative): ");
            if (input === null || input.trim() === "") {
                return;
            }
            const add = parseFloat(input);
            if (isNaN(add)) {
                alert("Invalid number entered.");
                return;
            }
            let newWalletValue = user.wallet + add;
            if (newWalletValue < 0) {
                newWalletValue = 0;
            }
            if (!user.admin) {
                alert("Need financial info.");
                return;
            }
            const updatedUser = { ...user, wallet: newWalletValue };
            replaceUser(updatedUser)
        } else if (change === "pass") {
            const newPassword = prompt("Enter new password:");
            if (newPassword === null || newPassword.trim() === "") {
                return;
            }
            const updatedUser = { ...user, pass: newPassword };
            replaceUser(updatedUser);
        }
    }

    return (
        <div className={"profile " + theme}>
            <div className="personal pgriditem">
                <div className='orb' onClick={selectImage}>
                    {!profileSrc && <span className='orb-initial'>{user.name.toUpperCase()[0]}</span>}
                    {profileSrc && <img src={profileSrc} alt='User Image' className={'orb-img '+theme+"Accent"} style={{borderStyle: 'none', borderColor: 'transparent'}}/>}
                </div>
                <div className='info'>
                    <h1>Welcome {user.name}!</h1>
                    <h3>Tier: {user.admin ? 'Admin' : 'Basic'}</h3>
                </div>
                <button onClick={() => prompted('pass')} style={{ color: 'white' , cursor: 'pointer'}}>Change Password</button>
            </div>
            <div className="values pgriditem">
                <ValueComp title={'Wallet'} value={user.wallet}><button style={{ float: 'left', marginLeft: '30px', padding: '12px', color: 'white' }} onClick={() => prompted('wallet')}>Deposit</button></ValueComp>
                <ValueComp title={'Portfolio'} value={portfolioValue} />
                <ValueComp title={'Total'} value={(user.wallet || 0) + portfolioValue} />
            </div>
            <h1>Your Portfolio</h1>
            <div className="portfolio pgriditem">
                <ul>{
                    userStocks.length !== 0 ? userStocks.map((item, index) => <li key={index} className='gridListItem'>
                        <div className='leftLi'>
                            <h3>{item.company}</h3>
                            <h4>{item.ticker} • {item.quantity} {item.quantity>1?'shares':'share'}</h4>
                        </div>
                        <div className='rightLi'>
                            <h4>${(item.quantity * item.price).toFixed(2)}</h4>
                            <h5>SP: ${item.price}</h5>
                        </div>
                    </li>) : <li className='gridListEmpty' style={{textAlign:'left'}}>Your portfolio is empty. Start buying stocks!</li>
                }</ul>
            </div>
        </div>
    )
}

export default Profile;