import { useState, useContext, useEffect } from 'react';
import '../styles/Transactions.css';
import ThemeContext from '../context/ThemeContext';
import axios from 'axios';

function Transactions({ user, stockList }) {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { theme } = useContext(ThemeContext);

    const fetchTransactions = async () => {
        try {
            const url = user.admin 
                ? 'http://localhost:5000/transactions'
                : `http://localhost:5000/transactions?user_id=${user.id}`;
            const res = await axios.get(url);
            setTransactions(res.data);
        } catch (e) {
            console.log("Error in fetching transactions database.");
        }
    };

    useEffect(() => {
        if (user.id) {
            fetchTransactions();
        }
    });

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
    let displayTransactions = transactions.filter(transaction =>
        transaction.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.name && transaction.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // sort if needed
    if (sortColumn) {
        displayTransactions = [...displayTransactions].sort((a, b) => {
            if (sortColumn === 'ticker') {
                if (sortDirection === 'asc') return a.ticker.localeCompare(b.ticker);
                return b.ticker.localeCompare(a.ticker);
            }
            if (sortColumn === 'name') {
                if (sortDirection === 'asc') return (a.name || '').localeCompare(b.name || '');
                return (b.name || '').localeCompare(a.name || '');
            }
            if (sortColumn === 'type') {
                if (sortDirection === 'asc') return a.transaction_type.localeCompare(b.transaction_type);
                return b.transaction_type.localeCompare(a.transaction_type);
            }
            if (sortColumn === 'quantity') {
                if (sortDirection === 'asc') return a.quantity - b.quantity;
                return b.quantity - a.quantity;
            }
            if (sortColumn === 'price') {
                if (sortDirection === 'asc') return a.price - b.price;
                return b.price - a.price;
            }
            if (sortColumn === 'total') {
                const aTotal = a.quantity * a.price;
                const bTotal = b.quantity * b.price;
                if (sortDirection === 'asc') return aTotal - bTotal;
                return bTotal - aTotal;
            }
            if (sortColumn === 'timestamp') {
                if (sortDirection === 'asc') return new Date(a.timestamp) - new Date(b.timestamp);
                return new Date(b.timestamp) - new Date(a.timestamp);
            }
            return 0;
        });
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className={`transactions ${theme}`}>
            <div className="transactions-header-container">
                <table className="transactions-header-table">
                    <tbody>
                        <tr className='transactionsRow'>
                            <td className="transactions-header-title-cell">
                                <h1>{user.admin ? 'All Transactions' : 'My Transactions'}</h1>
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="transactions-search"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="transactions-table-container">
                <table className={`transactions-table ${user.admin ? 'admin-view' : ''}`}>
                    <thead>
                        <tr>
                            {user.admin ? (
                                <th
                                    onClick={() => handleSort('name')}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                >
                                    User {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                            ) : null}
                            <th
                                onClick={() => handleSort('ticker')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Ticker {sortColumn === 'ticker' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('type')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Type {sortColumn === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('quantity')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Quantity {sortColumn === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('price')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Price {sortColumn === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('total')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Total Price {sortColumn === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSort('timestamp')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Date {sortColumn === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={user.admin ? 7 : 6} style={{ textAlign: 'center', padding: '40px' }}>
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            displayTransactions.map((transaction, index) => {
                                const typeColor = transaction.transaction_type === 'BUY' ? 'green' : 'red';
                                const totalPrice = transaction.quantity * transaction.price;
                                return (
                                    <tr key={index}>
                                        {user.admin ? <td>{transaction.name}</td> : null}
                                        <td>{transaction.ticker}</td>
                                        <td style={{ color: typeColor, fontWeight: '600' }}>
                                            {transaction.transaction_type}
                                        </td>
                                        <td>{transaction.quantity}</td>
                                        <td>${transaction.price.toFixed(2)}</td>
                                        <td>${totalPrice.toFixed(2)}</td>
                                        <td>{formatDate(transaction.timestamp)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Transactions;

