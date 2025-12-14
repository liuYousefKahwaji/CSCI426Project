import React, { useContext, useState, useRef, useEffect } from 'react';
import '../styles/Dropdown.css';
import { Link } from 'react-router-dom';
import ThemeContext from '../context/ThemeContext';


const Dropdown = ({links, children}) => {
    const { theme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className={"dropdown-container "+theme+"Accent"} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <p className="dropdown-toggle" style={{cursor:'default'}}>{children}<span className="arrow-icon">▼</span></p>
            {isOpen && (
                <ul className={"dropdown-menu "+theme}>
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.link}
                                onClick={handleLinkClick}
                                className="dropdown-item"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;