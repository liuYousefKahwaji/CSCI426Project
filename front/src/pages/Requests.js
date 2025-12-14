import { useState, useContext } from 'react';
import '../styles/Requests.css';
import ThemeContext from '../context/ThemeContext';
import axios from 'axios';

function Requests({ user, stockList, fetchRequests }) {
    const [requestType, setRequestType] = useState('add');
    const [stockName, setStockName] = useState('');
    const [selectedStock, setSelectedStock] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const { theme } = useContext(ThemeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (requestType === 'add') {
            if (!stockName.trim()) {
                alert('Please enter a stock name.');
                return;
            }
            
            try {
                const requestData = new FormData();
                requestData.append('user_id', user.id);
                requestData.append('name', stockName.trim());
                requestData.append('type', 'ADD');
                await axios.post('http://localhost:5000/requests', requestData);
                alert('Request submitted successfully!');
                setStockName('');
                if (fetchRequests) fetchRequests();
            } catch (err) {
                console.log(err);
                alert('Failed to submit request.');
            }
        } else {
            if (!selectedStock) {
                alert('Please select a stock.');
                return;
            }
            
            try {
                const requestData = new FormData();
                requestData.append('user_id', user.id);
                requestData.append('name', selectedStock);
                requestData.append('type', 'UPDATE');
                requestData.append('stock_ticker', selectedStock);
                if (newPrice.trim()) {
                    requestData.append('new_price', parseFloat(newPrice));
                }
                await axios.post('http://localhost:5000/requests', requestData);
                alert('Request submitted successfully!');
                setSelectedStock('');
                setNewPrice('');
                if (fetchRequests) fetchRequests();
            } catch (err) {
                console.log(err);
                alert('Failed to submit request.');
            }
        }
    };

    return (
        <div className={`requests ${theme}`}>
            <div className="requests-container">
                <h1>Stock Requests</h1>
                
                <div className="request-type-selector">
                    <button
                        className={`type-btn ${requestType === 'add' ? 'active' : ''}`}
                        onClick={() => setRequestType('add')}
                    >
                        Add New Stock
                    </button>
                    <button
                        className={`type-btn ${requestType === 'update' ? 'active' : ''}`}
                        onClick={() => setRequestType('update')}
                    >
                        Update Stock Price
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="request-form">
                    {requestType === 'add' ? (
                        <div className="form-group">
                            <label htmlFor="stockName">Stock Name</label>
                            <input
                                id="stockName"
                                type="text"
                                placeholder="Enter stock name (e.g., Apple Inc.)"
                                value={stockName}
                                onChange={(e) => setStockName(e.target.value)}
                                className="form-input"
                                required
                            />
                            <p className="form-hint">Enter the company name for the stock you'd like to add.</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="stockSelect">Select Stock</label>
                                <select
                                    id="stockSelect"
                                    value={selectedStock}
                                    onChange={(e) => setSelectedStock(e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="">-- Select a stock --</option>
                                    {stockList.map((stock) => (
                                        <option key={stock.ticker} value={stock.ticker}>
                                            {stock.company} ({stock.ticker}) - ${stock.price.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPrice">New Price (Optional)</label>
                                <input
                                    id="newPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter new price (optional)"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="form-input"
                                />
                                <p className="form-hint">If left blank, admin will set the price when approving.</p>
                            </div>
                        </>
                    )}
                    
                    <button type="submit" className="submit-btn">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Requests;

