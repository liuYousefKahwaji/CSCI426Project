import React, { useState } from "react";
import "../styles/Home.css";
import { Link, Navigate } from "react-router-dom";

function Home({ auth, stockList, theme }) {
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const handleClick = () => {
    setShouldNavigate(true);
  };

  // get first 4 stocks
  const selectList = [...stockList].slice(0, 4);

  if (shouldNavigate) {
    return <Navigate to="/stocks" />;
  }

  return (
    <div className="home">
      <div className="homeTop">
        <div className="topText">
          <h1>Trade Smarter, Invest Better</h1>
          <h2>Access real-time market data and make informed investment decisions</h2>
        </div>
        <div className="topButtons">
          <Link to={auth ? '/profile' : '/login'}><button>Get Started</button></Link>
          <Link to='/stocks'><button className="homeBtn">Browse Stocks</button></Link>
        </div>
      </div>
      <div className={"homeBottom " + theme}>
        <h1>Featured Stocks</h1>
        <div className="bottomGrid">
          {
            selectList.map((item, index) => (
              <div key={index} onClick={handleClick} className={"gridElement " + (theme === 'light' ? 'lightAccent' : 'darkAccent')} style={{cursor:'pointer'}}>
                <div className="company">{item.company}</div>
                <div className="ticker">{item.ticker}</div>
                <div className="price">${item.price}</div>
                <div
                  className="change"
                  style={{ color: item.change >= 0 ? "green" : "red" }}
                >
                  {item.change >= 0 ? `+${item.change}` : item.change}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Home;