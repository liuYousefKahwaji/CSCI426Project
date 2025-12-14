import { useState, useContext, useEffect } from 'react';
import '../styles/AdminRequests.css';
import ThemeContext from '../context/ThemeContext';
import axios from 'axios';

function AdminRequests({ requestList, stockList, fetchRequests, fetchStocks }) {
    const [selectedRequest, setSelectedRequest] = useState('');
    const [showStockForm, setShowStockForm] = useState(false);
    const { theme } = useContext(ThemeContext);

    const selectedRequestData = requestList.find(r => r.id.toString() === selectedRequest);

    const handleDecline = async () => {
        if (!selectedRequest) {
            alert('Please select a request first.');
            return;
        }
        
        if (!window.confirm('Are you sure you want to decline this request?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/requests/${selectedRequest}`);
            alert('Request declined and deleted.');
            setSelectedRequest('');
            if (fetchRequests) fetchRequests();
        } catch (err) {
            console.log(err);
            alert('Failed to decline request.');
        }
    };

    const handleApprove = () => {
        if (!selectedRequest) {
            alert('Please select a request first.');
            return;
        }

        if (!selectedRequestData) {
            alert('Invalid request selected.');
            return;
        }

        if (selectedRequestData.type === 'ADD') {
            setShowStockForm(true);
        } else {
            // UPDATE request
            const stock = stockList.find(s => s.ticker === selectedRequestData.stock_ticker);
            const stockName = stock ? stock.company : selectedRequestData.name;
            const newPrice = prompt(`Enter new price for ${stockName} (${selectedRequestData.stock_ticker}):\nCurrent price: ${stock?.price || 'N/A'}${selectedRequestData.new_price?`\nSuggested Price: ${selectedRequestData.new_price}`:''}`,selectedRequestData.new_price || '');
            
            if (newPrice === null || newPrice.trim() === '') {
                return;
            }

            const price = parseFloat(newPrice);
            if (isNaN(price) || price <= 0) {
                alert('Please enter a valid positive number.');
                return;
            }

            handleUpdatePrice(selectedRequestData.stock_ticker, price);
        }
    };

    const handleUpdatePrice = async (ticker, newPrice) => {
        try {
            await axios.put(`http://localhost:5000/stocks/${ticker}`, { price: newPrice }, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            // Delete the request
            await axios.delete(`http://localhost:5000/requests/${selectedRequest}`);
            
            alert('Stock price updated successfully and request removed.');
            setSelectedRequest('');
            if (fetchRequests) fetchRequests();
            if (fetchStocks) fetchStocks();
        } catch (err) {
            console.log(err);
            alert('Failed to update stock price.');
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (showStockForm && selectedRequestData) {
        return (
            <StockForm
                request={selectedRequestData}
                onCancel={() => setShowStockForm(false)}
                onSuccess={async () => {
                    try {
                        await axios.delete(`http://localhost:5000/requests/${selectedRequest}`);
                        setShowStockForm(false);
                        setSelectedRequest('');
                        if (fetchRequests) fetchRequests();
                        if (fetchStocks) fetchStocks();
                    } catch (err) {
                        console.log(err);
                        alert('Failed to delete request after adding stock.');
                    }
                }}
            />
        );
    }

    return (
        <div className={`admin-requests ${theme}`}>
            <div className="admin-requests-container">
                <h1>All Requests</h1>
                
                <div className="request-selector">
                    <label htmlFor="requestSelect">Select Request</label>
                    <select
                        id="requestSelect"
                        value={selectedRequest}
                        onChange={(e) => setSelectedRequest(e.target.value)}
                        className="request-select"
                    >
                        <option value="">-- Select a request --</option>
                        {requestList.map((request) => {
                            const stock = request.stock_ticker ? stockList.find(s => s.ticker === request.stock_ticker) : null;
                            const displayName = request.type === 'UPDATE' && stock ? stock.company : request.name;
                            const tickerDisplay = request.stock_ticker ? ` (${request.stock_ticker})` : '';
                            return (
                                <option key={request.id} value={request.id}>
                                    {request.type} - {displayName}{tickerDisplay} - {request.user_name} - {formatDate(request.time)}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {selectedRequestData && (
                    <div className="request-details">
                        <h3>Request Details</h3>
                        <div className="detail-row">
                            <span className="detail-label">Type:</span>
                            <span className="detail-value">{selectedRequestData.type}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">User:</span>
                            <span className="detail-value">{selectedRequestData.user_name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Stock Name:</span>
                            <span className="detail-value">
                                {selectedRequestData.type === 'UPDATE' && selectedRequestData.stock_ticker
                                    ? (stockList.find(s => s.ticker === selectedRequestData.stock_ticker)?.company || selectedRequestData.name)
                                    : selectedRequestData.name}
                            </span>
                        </div>
                        {selectedRequestData.stock_ticker && (
                            <div className="detail-row">
                                <span className="detail-label">Ticker:</span>
                                <span className="detail-value">{selectedRequestData.stock_ticker}</span>
                            </div>
                        )}
                        {selectedRequestData.new_price && (
                            <div className="detail-row">
                                <span className="detail-label">Suggested Price:</span>
                                <span className="detail-value">${selectedRequestData.new_price}</span>
                            </div>
                        )}
                        <div className="detail-row">
                            <span className="detail-label">Submitted:</span>
                            <span className="detail-value">{formatDate(selectedRequestData.time)}</span>
                        </div>
                    </div>
                )}

                <div className="action-buttons">
                    <button
                        onClick={handleApprove}
                        disabled={!selectedRequest}
                        className="approve-btn"
                    >
                        Approve
                    </button>
                    <button
                        onClick={handleDecline}
                        disabled={!selectedRequest}
                        className="decline-btn"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}

function StockForm({ request, onCancel, onSuccess }) {
    const [company, setCompany] = useState(request.name);
    const [ticker, setTicker] = useState('');
    const [price, setPrice] = useState('');
    const { theme } = useContext(ThemeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!company.trim()) {
            alert('Company name is required.');
            return;
        }
        if (!ticker.trim()) {
            alert('Ticker is required.');
            return;
        }
        if (!price || parseFloat(price) <= 0) {
            alert('Please enter a valid positive price.');
            return;
        }

        try {
            const stockData = new FormData();
            stockData.append('company', company.trim());
            stockData.append('ticker', ticker.trim().toUpperCase());
            stockData.append('price', price);
            const response = await axios.post('http://localhost:5000/stocks', stockData);
            alert('Stock added successfully!');
            onSuccess();
        } catch (err) {
            console.log(err);
            let errorMsg = 'Failed to add stock.';
            if (err.response?.data?.error) {
                errorMsg = typeof err.response.data.error === 'string' 
                    ? err.response.data.error 
                    : err.response.data.error.message || JSON.stringify(err.response.data.error);
            } else if (err.message) {
                errorMsg = err.message;
            }
            const errorStr = String(errorMsg);
            if (errorStr.includes('already exists') || errorStr.includes('ER_DUP_ENTRY') || errorStr.includes('Duplicate')) {
                alert('Stock with this ticker already exists.');
            } else {
                alert(`Failed to add stock: ${errorStr}`);
            }
        }
    };

    return (
        <div className={`stock-form ${theme}`}>
            <div className="stock-form-container">
                <h1>Add New Stock</h1>
                <p className="form-subtitle">Request: {request.name}</p>
                
                <form onSubmit={handleSubmit} className="stock-form-inputs">
                    <div className="form-group">
                        <label htmlFor="company">Company Name</label>
                        <input
                            id="company"
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ticker">Ticker Symbol</label>
                        <input
                            id="ticker"
                            type="text"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            className="form-input"
                            placeholder="e.g., AAPL"
                            maxLength={6}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="form-input"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="change">Change</label>
                        <input
                            id="change"
                            type="text"
                            value="0.00"
                            disabled
                            className="form-input disabled"
                        />
                        <p className="form-hint">Change is automatically set to 0 for new stocks.</p>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminRequests;

