import { useState, useContext } from 'react';
import '../styles/Stocks.css';
import ThemeContext from '../context/ThemeContext';
import axios from 'axios';

function Stocks({ user, stockList, setUser, replaceUser, holdingList, fetchHoldings }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { theme } = useContext(ThemeContext);

    const insertHolding = async (stock, quantity) => {
        try {
            const holdingData = new FormData();
            holdingData.append('user_id', user.id);
            holdingData.append('stock_ticker', stock.ticker);
            holdingData.append('quantity', quantity);
            await axios.post('http://localhost:5000/holdings', holdingData);
            await fetchHoldings();
        } catch (err) {
            console.log(err);
        }
    }

    const insertTransaction = async (ticker, transactionType, quantity, price) => {
        try {
            const transactionData = new FormData();
            transactionData.append('user_id', user.id);
            transactionData.append('ticker', ticker);
            transactionData.append('transaction_type', transactionType);
            transactionData.append('quantity', quantity);
            transactionData.append('price', price);
            await axios.post('http://localhost:5000/transactions', transactionData);
        } catch (err) {
            console.log(err);
        }
    }

    const updateHolding = async (holdingId, quantity) => {
        try {
            const holdingData = new FormData();
            holdingData.append('quantity', quantity);
            await axios.put(`http://localhost:5000/holdings/${holdingId}`, holdingData);
            await fetchHoldings();
        }catch (err) {
            console.log(err);
        }
    };

    // delete holding
    const deleteHolding = async (holding_id) => {
        try {
            await axios.delete(`http://localhost:5000/holdings/${holding_id}`);
            await fetchHoldings();
        }
        catch (err) {
            console.log(err);
        }
    };

    const getOwnedQuantity = (ticker) => {
        let holding = 0;
        holdingList.map((e) => {
            if (e.id === user.id && ticker === e.ticker) holding = e.quantity;
        })
        return holding;
    };

    const getHoldingId = (ticker) => {
        let holdingId = -1;
        holdingList.map((e) => {
            if (e.id === user.id && ticker === e.ticker) holdingId = e.holding_id;
        })
        return holdingId;
    };

    // toggle sort
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // filter by search
    let displayStocks = stockList.filter(stock =>
        stock.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // sort if needed
    if (sortColumn) {
        displayStocks = [...displayStocks].sort((a, b) => {
            if (sortColumn === 'company') {
                if (sortDirection === 'asc') return a.company.localeCompare(b.company);
                return b.company.localeCompare(a.company);
            }
            if (sortColumn === 'ticker') {
                if (sortDirection === 'asc') return a.ticker.localeCompare(b.ticker);
                return b.ticker.localeCompare(a.ticker);
            }
            if (sortColumn === 'price') {
                if (sortDirection === 'asc') return a.price - b.price;
                return b.price - a.price;
            }
            if (sortColumn === 'change') {
                if (sortDirection === 'asc') return a.change - b.change;
                return b.change - a.change;
            }
            if (sortColumn === 'owned') {
                const aOwned = getOwnedQuantity(a.ticker);
                const bOwned = getOwnedQuantity(b.ticker);
                if (sortDirection === 'asc') return aOwned - bOwned;
                return bOwned - aOwned;
            }
            return 0;
        });
    }

    // buy stock
    const handleBuy = async (stock) => {
        const quantity = prompt(`How many shares of ${stock.ticker} would you like to buy?`);
        if (quantity === null || quantity.trim() === '') return;

        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) {
            alert('Please enter a valid positive number.');
            return;
        }

        const totalCost = stock.price * qty;
        if (totalCost > user.wallet) {
            alert('Insufficient funds in wallet.');
            return;
        }

        const doubleCheck = () => {
            if (window.confirm(`Are you sure you want to buy ${qty} share(s) of ${stock.ticker} for ${totalCost.toFixed(2)}?`)) {
                return true;
            }
            return false;
        }

        const holdingId = getHoldingId(stock.ticker);
        if (holdingId === -1) {
            //insert new holding
            if (doubleCheck()) {
                await insertHolding(stock, qty);
                await insertTransaction(stock.ticker, 'BUY', qty, stock.price);
            } else {
                return;
            }
        }
        else {
            //update existing holding
            if (doubleCheck()) {
                const qty1 = qty + getOwnedQuantity(stock.ticker);
                await updateHolding(holdingId, qty1);
                await insertTransaction(stock.ticker, 'BUY', qty, stock.price);
            } else {
                return;
            }
        }

        const updatedUser = {
            ...user,
            wallet: user.wallet - totalCost
        };
        replaceUser(updatedUser);
        alert(`Successfully bought ${qty} share(s) of ${stock.ticker}!`);
    };

    // sell stock
    const handleSell = async (stock) => {
        const quantity = prompt(`How many shares of ${stock.ticker} would you like to sell?`);
        if (quantity === null || quantity.trim() === '') return;

        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) {
            alert('Please enter a valid positive number.');
            return;
        }

        const totalCost = stock.price * qty;

        const doubleCheck = () => {
            if (window.confirm(`Are you sure you want to sell ${qty} share(s) of ${stock.ticker} for ${totalCost.toFixed(2)}?`)) {
                return true;
            }
            return false;
        }

        const holdingId = getHoldingId(stock.ticker);
        const owned = getOwnedQuantity(stock.ticker);
        if (owned < qty) {
            alert('Insufficient shares to sell.');
            return;
        } else if (owned === qty) {
            if(doubleCheck()) {
                await deleteHolding(holdingId);
                await insertTransaction(stock.ticker, 'SELL', qty, stock.price);
            } else {
                return;
            }
        } else {
            if(doubleCheck()) {
                const qty1 = owned - qty;
                await updateHolding(holdingId, qty1);
                await insertTransaction(stock.ticker, 'SELL', qty, stock.price);
            } else {
                return;
            }
        }

        const updatedUser = {
            ...user,
            wallet: user.wallet + totalCost
        };
        replaceUser(updatedUser);
        alert(`Successfully sold ${qty} share(s) of ${stock.ticker}!`);
    };

    return (
        <div className={`stocks ${theme}`}>
            <div className="stocks-header-container">
                <table className="stocks-header-table">
                    <tbody>
                        <tr className='stockerRow'>
                            <td className="stocks-header-title-cell">
                                <h1>Explore Stocks</h1>
                                <input
                                    type="text"
                                    placeholder="Search stocks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="stocks-search"
                                />
                            </td>
                            <td className="stocks-header-wallet-cell">
                                <div className="stocks-wallet">
                                    <span>Wallet: ${user.wallet.toFixed(2)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="stocks-table-container">
                <table className="stocks-table">
                    <thead>
                        <tr>
                            <th
                                onClick={() => handleSort('company')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Company {sortColumn === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('ticker')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Ticker {sortColumn === 'ticker' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('price')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Price {sortColumn === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('change')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Change {sortColumn === 'change' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('owned')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Owned {sortColumn === 'owned' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayStocks.map((stock, index) => {
                            const stockIndex = stock.ticker;
                            const owned = getOwnedQuantity(stockIndex);
                            const changeColor = stock.change >= 0 ? 'green' : 'red';
                            const changeSign = stock.change >= 0 ? '+' : '';

                            return (
                                <tr key={index}>
                                    <td>{stock.company}</td>
                                    <td>{stock.ticker}</td>
                                    <td>${stock.price.toFixed(2)}</td>
                                    <td style={{ color: changeColor }}>
                                        {changeSign}{stock.change.toFixed(2)}
                                    </td>
                                    <td>{owned} {owned === 1 ? 'share' : 'shares'}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="buy-button"
                                            onClick={() => handleBuy(stock)}
                                        >
                                            Buy
                                        </button>
                                        <button
                                            className={`sell-button ${owned === 0 ? 'disabled' : ''}`}
                                            onClick={() => handleSell(stock)}
                                            disabled={owned === 0}
                                        >
                                            Sell
                                        </button>
                                        <a href={'https://www.tradingview.com/chart/?symbol=' + stock.ticker} target="_blank">
                                            <button className={'chart-button'}>Chart</button>
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stocks;
