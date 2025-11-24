import { useState, useContext } from 'react';
import '../styles/Stocks.css';
import ThemeContext from '../context/ThemeContext';

function Stocks({ user, stockList, setUser, replaceUser }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { theme } = useContext(ThemeContext);

    const getOwnedQuantity = (stockIndex) => {
        if (!user.stocks || !Array.isArray(user.stocks)) return 0;
        const holding = user.stocks.find(s => s.i === stockIndex);
        return holding ? holding.q : 0;
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
                const aOwned = getOwnedQuantity(stockList.indexOf(a));
                const bOwned = getOwnedQuantity(stockList.indexOf(b));
                if (sortDirection === 'asc') return aOwned - bOwned;
                return bOwned - aOwned;
            }
            return 0;
        });
    }

    // buy stock
    const handleBuy = (stockIndex) => {
        const stock = stockList[stockIndex];
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

        const updatedStocks = [...(user.stocks || [])];
        const existingIndex = updatedStocks.findIndex(s => s.i === stockIndex);

        if (existingIndex >= 0) {
            updatedStocks[existingIndex].q += qty;
        } else {
            updatedStocks.push({ i: stockIndex, q: qty });
        }

        const updatedUser = {
            ...user,
            wallet: user.wallet - totalCost,
            stocks: updatedStocks
        };

        setUser(updatedUser);
        replaceUser(updatedUser);
        alert(`Successfully bought ${qty} share(s) of ${stock.ticker}!`);
    };

    // sell stock
    const handleSell = (stockIndex) => {
        const stock = stockList[stockIndex];
        const owned = getOwnedQuantity(stockIndex);

        if (owned === 0) {
            alert(`You don't own any shares of ${stock.ticker}.`);
            return;
        }

        const quantity = prompt(`How many shares of ${stock.ticker} would you like to sell? (You own ${owned})`);

        if (quantity === null || quantity.trim() === '') return;

        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) {
            alert('Please enter a valid positive number.');
            return;
        }

        if (qty > owned) {
            alert(`You only own ${owned} share(s) of ${stock.ticker}.`);
            return;
        }

        const totalValue = stock.price * qty;

        const updatedStocks = [...(user.stocks || [])];
        const existingIndex = updatedStocks.findIndex(s => s.i === stockIndex);

        if (existingIndex >= 0) {
            updatedStocks[existingIndex].q -= qty;
            if (updatedStocks[existingIndex].q === 0) {
                updatedStocks.splice(existingIndex, 1);
            }
        }

        const updatedUser = {
            ...user,
            wallet: user.wallet + totalValue,
            stocks: updatedStocks
        };

        setUser(updatedUser);
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
                            const stockIndex = stockList.indexOf(stock);
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
                                            onClick={() => handleBuy(stockIndex)}
                                        >
                                            Buy
                                        </button>
                                        <button
                                            className={`sell-button ${owned === 0 ? 'disabled' : ''}`}
                                            onClick={() => handleSell(stockIndex)}
                                            disabled={owned === 0}
                                        >
                                            Sell
                                        </button>
                                        <a href={'https://www.tradingview.com/chart/?symbol='+stock.ticker} target="_blank">
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
