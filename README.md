# StockEx – CSCI426 Stock Trading Project
### Made By Yousef Kahwaji, Ahmad Akoum, Mohmammad Al Dirani

A simple, educational stock trading simulation app where you can explore real-world stocks, sort, search, buy, sell, and manage users—all with a clean UI built using React.
The demo-website is hosted on [github pages](https://liuyousefkahwaji.github.io/CSCI426Project/). Due to the nature of github pages, some errors may be faced. Running the app locally would be better. Note that refreshing the github pages site will cause an error. Enter the link again to fix it. Note that xampp is needed regardless of using local or github pages.

## Features

- **Navigation Bar**
  - Well-made and decluttered navigation bar
  - changes depending on if user is logged in, and their tier (user/admin)
  - The website title "StockEx" functions as a home button
  - Includes dropdown elements (Admin and Account)
  - Allows changing themes using the theme button on the far right

- **User Login & Registration**
  - Create an account, login, or use the pre-made users
  - Role-based (admin/basic) user system

- **Browse & Search Stocks**
  - Explore a list of real-world stocks
  - Search stocks by company or ticker
  - Sort by any column (name, ticker, price, change, owned)

- **Buy & Sell Simulation**
  - Simple buy/sell dialog for each stock
  - Shows how much you own and your wallet balance
  - Each stock has a chart button that redirects to tradingview chart

- **Account**
  - Profile
    - Display name, tier (user/admin), and wallet value
    - User image can be changed by clicking on it
    - Allows changing password
    - Shows portfolio value and total value (portfolio + wallet)
    - Has a portfolio area that shows all owned stocks (quantity, price, etc)
  - My Transactions (user) / All Transactions (admin)
    - Similar to the stocks table, shows transactions
    - Displays user's transactions if user, all transactions by all users if admin
    - Includes a search function by ticker, and sorting for all columns
    - Shows exact date and time of transaction
  - My Requests
    - A page that allows user or admin to request adding or updating a stock
    - For adding a stock, user has to enter the stock name
    - For updating a stock's price, the user has to choose from list of existing stocks and may optionally include a suggested price
  - Logout

- **Admin**
  - UserList
    - Shows a list of all users, including their name, password, tier, and wallet
    - Allows deleting users (not admins), and changing their wallet values
    - Allows multi-selection and deletion
  - All Requests
    - Shows a list of all requests
    - Regardless of request type, the admin may choose to decline it, deleting it from the list
    - If the request is an approved ADD, then the admin has to enter company name, ticker, and price.
    - Otherwise if UPDATE request, then the admin is presented with the selected stock and suggested price. The admin is allowed to choose a new price or use the suggested one

- **Light/Dark Theme**
  - Toggle theme at any time

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- xampp with apache and mysql

### Installation

1. Clone the repo:
   ```git clone https://github.com/yourusername/stockex.git```
   ```cd stockex```

2. Ready XAMPP and MySql:
   - Start Apache and MySql
   - In phpMyAdmin, create a database named "stockex" and import it from the sql file
   
3. Install dependencies for each end if necessary:
   
   -```cd back```
   ```npm install```

   -```cd front```
   ```npm install```

5. Start the development server:
   ```cd back;npm start```
   ```cd front;npm start```
   
6. Open your browser to [http://localhost:3000](http://localhost:3000)

## File Structure

- `src/components/` – reusable UI components
  - `NavBar.js` – top navigation, theme toggle, links
  - `Auth.js` – login & register forms and logic
  - `Dropdown.js` – small dropdown used by the nav
  - `Logout.js` – logout action/redirect

- `src/pages/` – page-level views
  - `Home.js` – landing / summary page
  - `Profile.js` – user profile, portfolio, upload avatar
  - `Stocks.js` – stocks browser, buy/sell UI, chart links
  - `Transactions.js` – transactions view (user or all)
  - `UserList.js` – admin user management
  - `Requests.js` – submit add/update stock requests
  - `AdminRequests.js` – admin view of requests

- `src/styles/` – component/page styles (CSS files)
  - `NavBar.css`, `Home.css`, `Profile.css`, `Stocks.css`, `Transactions.css`, `UserList.css`, `Requests.css`, `Dropdown.css`, `Auth.css`, `AdminRequests.css`

- `src/context/` – app-wide contexts
  - `ThemeContext.js` – light/dark theme provider

- `src/assets/` – small images and gifs used in the UI
  - `home.gif`, `open.png`, `closed.png`, etc.

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
- The rest are found in the database

- Demo users are built-in the database, but you can make new accounts from the registration page.

## Notes

- This app is for educational/demo purposes only and has no real trading functionality.
- Charts use [tradingview.com](https://tradingview.com) (opens in a new tab).

## Plans for the future

- ~Backend (database, etc)~ Added in v1.0
- Multicurrency conversions
- ~Transaction History~ Added in v1.0
- Mobile / more responsive support 
