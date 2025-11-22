import { useEffect, useState } from 'react'
import '../styles/Profile.css'

function Profile({ user, theme, stockList, setUser, replaceUser }) {
    const [portfolioValue, setPortfolioValue] = useState(0.0);
    const [userStocks, setUserStocks] = useState([]);
    useEffect(() => {
        let total = 0.0;
        let tempList = [];
        if (user.stocks && Array.isArray(user.stocks) && user.stocks.length > 0) {
            for (const holding of user.stocks) {
                const stockIndex = holding.i;
                const quantity = holding.q;
                tempList = [...tempList, stockList[stockIndex]];
                const currentPrice = stockList[stockIndex].price;
                total += currentPrice * quantity;
            }
            setPortfolioValue(total);
            setUserStocks(tempList);
        } else setUserStocks([]);
    }, [user.stocks, stockList]);

    function ValueComp({ title, value, children }) {
        return <div className='value'>
            <h3 style={{
                textAlign: 'left', padding: '10px', paddingLeft: '30px', fontSize: '18px', color: 'gray', paddingBottom: '0'
            }}>{title} Value </h3>
            <h1 style={{
                textAlign: 'left', padding: '10px', paddingLeft: '30px', fontSize: '40px', fontWeight: 'bold', paddingTop: '0', paddingBottom: '0', marginBottom: '10px'
            }}>${value.toFixed(2)}</h1>
            {children}
        </div>
    }

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
            setUser(updatedUser);
            replaceUser(updatedUser)
        } else if (change === "pass") {
            const newPassword = prompt("Enter new password:");
            if (newPassword === null || newPassword.trim() === "") {
                return;
            }
            const updatedUser = { ...user, pass: newPassword };
            setUser(updatedUser);
            replaceUser(updatedUser);
        }
    }

    return (
        <div className={"profile " + theme}>
            <div className="personal pgriditem">
                <div className='orb'>{user.name.toUpperCase()[0]}</div>
                <div className='info'>
                    <h1>Welcome {user.name}!</h1>
                    <h3>Tier: {user.admin ? 'Admin' : 'Basic'}</h3>
                </div>
                <button onClick={() => prompted('pass')} style={{ color: 'white' }}>Change Password</button>
            </div>
            <div className="values pgriditem">
                <ValueComp title={'Wallet'} value={user.wallet}><button style={{ float: 'left', marginLeft: '30px', padding: '12px', color: 'white' }} onClick={() => prompted('wallet')}>Deposit</button></ValueComp>
                <ValueComp title={'Portfolio'} value={portfolioValue} />
                <ValueComp title={'Total'} value={user.wallet + portfolioValue} />
            </div>
            <h1>Your Portfolio</h1>
            <div className="portfolio pgriditem">
                <ul>{
                    userStocks.length !== 0 ? userStocks.map((item, index) => <li key={index} className='gridListItem'>
                        <div className='leftLi'>
                            <h3>{item.company}</h3>
                            <h4>{item.ticker} •  {user.stocks[index].q} shares</h4>
                        </div>
                        <div className='rightLi'>
                            <h4>${user.stocks[index].q * item.price}</h4>
                            <h5>SP: ${item.price}</h5>
                        </div>
                    </li>) : <li className='gridListEmpty' style={{textAlign:'left'}}>Your portfolio is empty. Start buying stocks!</li>
                }</ul>
            </div>
        </div>
    )
}

export default Profile;