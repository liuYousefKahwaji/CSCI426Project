import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
  const homeList = [
    { title: "Welcome to Home Page!", desc: "This is the home page of the application.", link: "/home" },
    { title: "Navigation Menu", desc: "Use the navigation menu on the left to explore different sections.", link: "/home" },
    { title: "Preview Area", desc: "This area can be used to preview content.", link: "/home" },
    { title: "User Authentication", desc: "Login or register to access more features.", link: "/logout" },
    { title: "Admin Features", desc: "Admins can manage users and access additional functionalities.", link: "/userlist" },
    { title: "Responsive Design", desc: "The application is designed to be responsive and user-friendly.", link: "/home" },
  ];
  return (
    <div className="home">
      <h1 style={{ position: 'relative', }}>Welcome to Home Page!</h1>
      <h2>Features</h2>
      <div className="preview">
        {
          homeList.map((item, index) => (
            <Link key={index} to={item.link} >
              <div key={index} className="homeItem">
                <h2 style={{ textDecoration: item.link==='/home'?'none':'underline', color: 'inherit' }}>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default Home;