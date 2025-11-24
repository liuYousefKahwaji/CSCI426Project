# StockEx – CSCI426 Stock Trading Project

A simple, educational stock trading simulation app where you can explore real-world stocks, sort, search, buy, sell, and manage users—all with a clean UI built using React.
The demo-website is hosted on [github pages](https://liuyousefkahwaji.github.io/CSCI426Project/). Due to the nature of github pages, some errors may be faced. Running the app locally would be better. Note that refreshing the github pages site will cause an error. Enter the link again to fix it.

## Features

- **User Login & Registration**
  - Create an account, login, or use the default admin
  - Role-based (admin/basic) user system

- **Browse & Search Stocks**
  - Explore a list of real-world stocks
  - Search stocks by company or ticker
  - Sort by any column (name, ticker, price, change, owned)

- **Buy & Sell Simulation**
  - Simple buy/sell dialog for each stock
  - Shows how much you own and your wallet balance

- **Portfolio & Profile**
  - Track your holdings and portfolio value
  - Change password (admin can adjust wallet funds)

- **User Management (Admin)**
  - See a list of all users
  - Reset user wallets or delete users (except admin)

- **TradingView Chart Integration**
  - Quickly open TradingView stock charts for each ticker

- **Light/Dark Theme**
  - Toggle theme at any time

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. Clone the repo:
   ```git clone https://github.com/yourusername/stockex.git```
   ```cd stockex```
   
3. Install dependencies:
   ```npm install```

3. Start the development server:
   ```npm start```
5. Open your browser to [http://localhost:3000](http://localhost:3000)

## File Structure

- `src/App.js` – Main app and routes
- `src/pages/Stocks.js` – Browse/search/sort stocks, trading logic
- `src/pages/Profile.js` – Profile and portfolio
- `src/pages/UserList.js` – Admin user management
- `src/pages/Home.js` – Front-page summary
- `src/components/Auth.js` – Authentication UI, functions for both login and register
- `src/components/NavBar.js`, `Logout.js` – Navigation and auth logic

## Credentials

- **Demo Admin:**  
  Username: `admin`  
  Password: `admin`
- **Demo User 1:**  
  Username: `test1`  
  Password: `123`
- **Demo User 2:**  
  Username: `test2`  
  Password: `321`

- Demo users are built in, but you can make new accounts from the registration page.

## Notes

- This app is for educational/demo purposes only and has no real trading functionality.
- Charts use [tradingview.com](https://tradingview.com) (opens in a new tab).
- Wallet/portfolio values are local to your session and not persistent / don't get stored on local nor cloud storage.

## Plans for the future

- Backend (database, etc)
- Mobile / more responsive support
- Favorites / watchlist
- Multicurrency conversions
- Transaction History
